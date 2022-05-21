import * as admin from 'firebase-admin';
import BaseRepository from './BaseRepository';
import { IPaymentTransaction } from '../types/payment';
import { TXN_MODEL } from '../constants';

class PaypalRepository extends BaseRepository {
  protected db = admin.database().ref(TXN_MODEL);
  constructor() {
    super();
  }

  async storeTransaction(params: IPaymentTransaction): Promise<any> {
    params.type = 'paypal';
    await this.db.child(params.id).set(params);
    return this.responseSuccess('', {});
  }
}

export default PaypalRepository;
