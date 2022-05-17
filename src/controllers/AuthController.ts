'use strict';

import { ValidateErrorJSON } from '../types';
import { Route, Post, Response, Body, Tags, Security, Request } from 'tsoa';
import { HttpResponseCode } from '../constants/http_response';
import { BaseController } from './BaseController';

// import * as admin from 'firebase-admin';

// const md5 = require('md5');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');

@Route('account')
@Tags('Accounts')
export class AuthController extends BaseController {
  model;

  constructor() {
    super();
  }

  @Security('jwt')
  @Post('auth')
  @Response<ValidateErrorJSON>(HttpResponseCode.HTTP_VALIDATE_ERROR, 'Validation Failed')
  public async auth(@Body() requestBody: any, @Request() request: any): Promise<any> {
    console.log(requestBody);
    // const data = await admin.auth().verifyIdToken(requestBody.username);
    console.log(request.user);
    // const { username, password, type } = requestBody;

    // const { data } = await this.model.one({
    //   where: { username, password: md5(password), type },
    //   columns: ['id', 'type', 'role', 'username', 'email', 'first_name', 'last_name', 'verified'],
    // });

    // const privateKEY = fs.readFileSync('./private.key', 'utf8');

    // const token = jwt.sign({ ...data }, privateKEY, {
    //   expiresIn: '12h',
    //   algorithm: 'RS256', // RSASSA [ "RS256", "RS384", "RS512" ]
    // });

    return { token: 'abc', status: true };
  }
}
