export interface ICoinbasePaymentParams {
  price: {
    amount: string;
    currency: string;
  };
}

export interface IStripePaymentParams {
  // TODO: expand more properties
  source: string;
  amount: number; // devided by 1000
  currency: string;
  decription?: string;
  metadata?: any;
}

export interface IPaymentTransaction {
  id: string;
  type: 'paypal' | 'stripe' | 'coinbase';
  created: string;
  amount: number;
  payer: string;
  username: string;
}
