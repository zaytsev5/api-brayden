import paypal from 'paypal-rest-sdk';

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: 'AWgYYDvYvC35qGNvoTs8QDLUZdl8kmaOISELHK1lAA6GcEhjMc5eCR-c54eOVOLOuNyWQE7fpkoD5w_w' || '',
  client_secret: 'EDvXzdrHt_E6fWCdiE5ifE27TceUXVCcea9_iO3jl0u4XlFRiFYcrz1Lo6uXaLKKVZ0zOKGh9HfjQdc1' || '',
});

export default paypal;
