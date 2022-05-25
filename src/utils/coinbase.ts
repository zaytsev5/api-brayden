export const preparePaymentData = (data) => {
  if (!data) return data;

  delete data.addresses;
  delete data.exchange_rates;
  delete data.local_exchange_rates;
  delete data.payment_threshold;
  delete data.pricing;

  data.payment = data.payments.length ? data.payments[0] : {};
  delete data.payments;
  delete data.payment.block;

  return data;
};
