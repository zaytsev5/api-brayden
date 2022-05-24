'use strict';

import { ValidateErrorJSON } from '../types';
import { Route, Post, Response, Body, Tags, Request, Security, Get, Path } from 'tsoa';
import { HttpResponseCode } from '../constants/http_response';
import { BaseController } from './BaseController';
import { CreateCharge, resources } from 'coinbase-commerce-node';
import { ICoinbasePaymentParams, IStripePaymentParams } from '../types/payment';
import { DEFAULT_CHARGE_DATA } from '../constants/coinbase';
import StripeRepository from '../repository/StripeRepository';
import PaypalRepository from '../repository/PaypalRepository';
import CoinbaseRepository from '../repository/CoinbaseRepository';

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
  @Post('{type}/success')
  @Response<ValidateErrorJSON>(HttpResponseCode.HTTP_VALIDATE_ERROR, 'Validation Failed')
  public async paypal(@Body() requestBody: any, @Path() type: string): Promise<any> {
    // console.log(request.user);
    const result =
      type == 'paypal'
        ? await new PaypalRepository().storeTransaction(requestBody)
        : type == 'coinbase'
        ? await new CoinbaseRepository().storeTransaction(requestBody)
        : { status: true };

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
}
