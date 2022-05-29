import sendMail from '../utils/mailer';
import BaseRepository from './BaseRepository';
import path from 'path';
const ejs = require('ejs');
const inlineCss = require('inline-css');
const appRoot = path.resolve(__dirname, '../');
const emailCss = require('../css/email-css');

class MailRepository extends BaseRepository {
  constructor() {
    super();
  }

  async send2FaCode(code: string, recipient: string): Promise<any> {
    const data = await ejs.renderFile(appRoot + '/emails/verify_code.ejs', { code });
    const html = await inlineCss(data, { extraCss: emailCss, url: ' ' });

    try {
      sendMail({
        to: recipient,
        subject: `Two-Factor Authentication (2FA)`,
        html,
        from: process.env.MAIL_FROM,
      });
      return this.responseSuccess('OK', {});
    } catch (e: any) {
      return this.responseError(e.message);
    }
  }
}

export default MailRepository;
