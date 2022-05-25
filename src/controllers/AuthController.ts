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
    console.log(request.user);

    return { token: 'Token', status: true };
  }
}
