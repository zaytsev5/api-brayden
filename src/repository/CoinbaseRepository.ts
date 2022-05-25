import * as admin from 'firebase-admin';
import BaseRepository from './BaseRepository';
// import { IPaymentTransaction } from '../types/payment';
import { TXN_MODEL } from '../constants';
import { resources } from 'coinbase-commerce-node';

class CoinbaseRepository extends BaseRepository {
  protected db = admin.database().ref(TXN_MODEL);
  constructor() {
    super();
  }

  async storeTransaction(data: any): Promise<any> {
    if (!data) return;

    data.payment_type = 'coinbase';
    await this.db.child(data.id).set(data);
    return this.responseSuccess('', {});
  }

  async getPaymentById(id: string): Promise<any> {
    const { Charge } = resources;
    const result = await Charge.retrieve(id);
    return this.responseSuccess('', result);
  }
}

export default CoinbaseRepository;
