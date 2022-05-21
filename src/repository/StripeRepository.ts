import Stripe from 'stripe';
import BaseRepository from './BaseRepository';
import * as admin from 'firebase-admin';
import { IPaymentTransaction } from '../types/payment';
import { TXN_MODEL } from '../constants';

class StripeRepository extends BaseRepository {
  protected db = admin.database().ref(TXN_MODEL);
  private opt: any = {
    apiVersion: process.env.STRIPE_API_VERSION || '2020-08-27',
  };
  private stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET || '', this.opt);

  constructor() {
    super();
    const options: any = {
      apiVersion: process.env.STRIPE_API_VERSION || '2020-08-27',
    };
    this.stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET || '', options);
  }

  async createCharge(params: Stripe.ChargeCreateParams): Promise<any> {
    try {
      const data: any = await await this.stripe.charges.create(params);

      //TODO: store need data
      await this.storeTransaction(data);
      return this.responseSuccess('', {});
    } catch (e: any) {
      return this.responseError(e.message);
    }
  }
  async getChargeById(id: string): Promise<any> {
    try {
      const data: any = await await this.stripe.charges.retrieve(id);

      //TODO: store need data
      console.log(data);
      return this.responseSuccess('', data);
    } catch (e: any) {
      return this.responseError(e.message);
    }
  }

  async storeTransaction(params: IPaymentTransaction): Promise<any> {
    params.type = 'stripe';
    await this.db.child(params.id).set(params);
    return this.responseSuccess('', {});
  }
}

export default StripeRepository;
