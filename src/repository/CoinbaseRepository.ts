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

  async storeTransaction(params: any): Promise<any> {
    params.type = 'coinbase';
    const { data: payment } = await this.getPaymentById(params.id);

    await this.db
      .child(payment.id)
      .set({ id: payment.id, code: payment.code, metadata: payment.metadata, created_at: payment.created_at });
    return this.responseSuccess('', {});
  }

  async getPaymentById(id: string): Promise<any> {
    const { Charge } = resources;
    const result = await Charge.retrieve(id);
    return this.responseSuccess('', result);
  }
}

export default CoinbaseRepository;
