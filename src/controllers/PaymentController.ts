'use strict';

import { ValidateErrorJSON } from '../types';
import { Route, Post, Response, Body, Tags, Request, Security, Get, Path } from 'tsoa';
import { HttpResponseCode } from '../constants/http_response';
import { BaseController } from './BaseController';
import { CreateCharge, resources, Webhook } from 'coinbase-commerce-node';
import { ICoinbasePaymentParams, IStripePaymentParams } from '../types/payment';
import { DEFAULT_CHARGE_DATA } from '../constants/coinbase';
import StripeRepository from '../repository/StripeRepository';
import PaypalRepository from '../repository/PaypalRepository';
import CoinbaseRepository from '../repository/CoinbaseRepository';
import { preparePaymentData } from '../utils/coinbase';

@Route('payment')
@Tags('Payment')
export class PaymentController extends BaseController {
  model;

  constructor() {
    super();
  }

  @Security('jwt')
  @Post('coinbase')
  @Response<ValidateErrorJSON>(HttpResponseCode.HTTP_VALIDATE_ERROR, 'Validation Failed')
  public async coinabase(@Body() requestBody: ICoinbasePaymentParams, @Request() request: any): Promise<any> {
    const { Charge } = resources;
    const chargeData: CreateCharge = {
      ...DEFAULT_CHARGE_DATA,
      local_price: requestBody.price,
      metadata: {
        name: request.user.name,
        email: request.user.email,
      },
    };
    const charge = await Charge.create(chargeData);
    // return charge;
    const result = charge
      ? { data: { hosted_url: charge.hosted_url, code: charge.code }, status: true }
      : { status: false };

    return this.handleResponse(result, HttpResponseCode.HTTP_OK, 'Please try again');
  }

  // @Security('jwt')
  @Post('stripe')
  @Response<ValidateErrorJSON>(HttpResponseCode.HTTP_VALIDATE_ERROR, 'Validation Failed')
  public async stripe(@Body() requestBody: IStripePaymentParams, @Request() request: any): Promise<any> {
    console.log(request.user);
    const result = await new StripeRepository().createCharge(requestBody);
    return this.handleResponse(result, HttpResponseCode.HTTP_OK, result.message);
  }

  // @Security('jwt')
  @Post('paypal/success')
  @Response<ValidateErrorJSON>(HttpResponseCode.HTTP_VALIDATE_ERROR, 'Validation Failed')
  public async paypal(@Body() requestBody: any): Promise<any> {
    const result = await new PaypalRepository().storeTransaction(requestBody);

    return this.handleResponse(result, HttpResponseCode.HTTP_OK, result.message);
  }

  // TODO: remove
  @Get('charge/paypal/{id}')
  public async getOrder(@Path() id: string): Promise<any> {
    await new PaypalRepository().getPaymentById(id);

    return this.handleResponse({ status: true }, HttpResponseCode.HTTP_OK, '');
  }

  @Get('charge/stripe/{id}')
  public async getStripe(@Path() id: string): Promise<any> {
    await new StripeRepository().getChargeById(id);

    return this.handleResponse({ status: true }, HttpResponseCode.HTTP_OK, '');
  }

  @Post('callback/coinbase/success')
  public async pcbc(@Request() request: any): Promise<any> {
    const rawBody = request.rawBody;
    const signature = request.headers['x-cc-webhook-signature'];
    const webhookSecret = '7bb498e9-9fae-4305-b76c-97699c1a4eed';
    const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

    const storeData = preparePaymentData(event.data ?? null);
    await new CoinbaseRepository().storeTransaction(storeData);

    return this.handleResponse({ status: true }, HttpResponseCode.HTTP_OK, '');
  }
}
