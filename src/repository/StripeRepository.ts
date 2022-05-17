import Stripe from 'stripe';
import BaseRepository from './BaseRepository';

class StripeRepository extends BaseRepository {
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
      //TODO: store need data
      const data = await await this.stripe.charges.create(params);
      return this.responseSuccess('', data);
    } catch (e: any) {
      return this.responseError(e.message);
    }
  }
}

export default StripeRepository;
