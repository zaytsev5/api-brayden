import * as admin from 'firebase-admin';
import BaseRepository from './BaseRepository';
import MailRepository from './MailRepository';
import { USER_MODEL, LIMIT_2FA } from '../constants';
import { CommonResponse } from '../types/global';
import { randomCode } from '../utils/index';
import QRCODE from 'qrcode';
import { authenticator } from 'otplib';

class UserRepository extends BaseRepository {
  protected db = admin.database().ref(USER_MODEL);
  constructor() {
    super();
  }

  async generate2Fa(hash: string, email: string): Promise<any> {
    try {
      return await this.db
        .child(hash)
        .once('value')
        .then(async (snapshot) => {
          if (snapshot.exists()) {
            const code = randomCode(6);
            snapshot.ref.child('2fa_code').set(code);
            snapshot.ref.child('expired_2fa').set(new Date().getTime());
            await new MailRepository().send2FaCode(code, email);
          }
          return this.responseSuccess('', {});
        });
    } catch (e: any) {
      console.log(e.message);
      return this.responseError('Failed to get 2fa code.');
    }
  }

  async verify2Fa(code: string, hash: string): Promise<any> {
    try {
      return await this.db
        .child(hash)
        .once('value')
        .then((snapshot) => {
          if (snapshot.exists()) {
            const user = snapshot.val();
            const now = new Date().getTime();
            if (code === user['2fa_code'] && now - user.expired_2fa <= LIMIT_2FA) {
              snapshot.ref.child('2fa_code').set('');
              snapshot.ref.child('expired_2fa').set('');
              return this.responseSuccess('Verified done', {});
            }
          }
          return this.responseError('Failed to verify code, Please try again!');
        });
    } catch {
      return this.responseError('Failed to verify code, Please try again!');
    }
  }

  async signupG2fa(user: any): Promise<any> {
    const result: CommonResponse = { status: true };
    const secret = authenticator.generateSecret();
    await this.db
      .child(user.user_id)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) snapshot.ref.child('secret_code').set(secret);
      });
    const data = await QRCODE.toDataURL(
      `otpauth://totp/${process.env.APP_NAME}:${user.email}?secret=${secret}&issuer=${process.env.APP_NAME}`,
    );
    if (!data) {
      result.message = 'Could not register 2fa authentication';
      result.status = false;
    } else result.data = data;

    return result;
  }

  async verifyG2fa(code: string, user: any): Promise<any> {
    return await this.db
      .child(user.user_id)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (authenticator.check(code, data.secret_code)) {
            snapshot.ref.child('verified_session').set(1);
            return true;
          }
          return false;
        }
      });
  }
}

export default UserRepository;
