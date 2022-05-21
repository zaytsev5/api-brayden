export const DEFAULT_CHARGE_DATA: any = {
  name: 'SCHOOL EVENTS',
  description: 'Payment for purchasing products',
  pricing_type: 'fixed_price',
  redirect_url: process.env.CLIENT_DOMAIN + '/payment/coinbase/callback/success', // here is the url that handle callback
  cancel_url: process.env.CLIENT_DOMAIN + '/payment/coinbase/callback/cancel', // here is the url that handle callback
};
