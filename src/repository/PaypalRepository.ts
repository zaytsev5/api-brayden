import * as admin from 'firebase-admin';
import paypal from '../utils/paypal';
import BaseRepository from './BaseRepository';
import { TXN_MODEL } from '../constants';

class PaypalRepository extends BaseRepository {
  protected db = admin.database().ref(TXN_MODEL);
  constructor() {
    super();
  }

  async storeTransaction(params: any): Promise<any> {
    //TODO: define common type to store into firebase
    const { data } = await this.getPaymentById(params.payment.id);

    // const storeData = params.payment;
    data.type = 'paypal';
    delete data.links;
    delete data.httpStatusCode;

    await this.db.child(data.id).set({ ...data, payer: params.payer, payee: params.payee });
    return this.responseSuccess('', {});
  }

  async getPaymentById(id: string): Promise<any> {
    const get = () =>
      new Promise((resolve) => {
        paypal.capture.get(id, (error, payment) => {
          if (error) {
            resolve(null);
          }
          resolve(payment);
        });
      });

    const result = await get();
    return this.responseSuccess('', result);
  }
}

export default PaypalRepository;
