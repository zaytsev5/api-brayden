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
