'use strict';

import { ValidateErrorJSON } from '../types';
import { TwoFA } from '../types/auth';
import { Route, Post, Response, Body, Tags, Security, Request } from 'tsoa';
import { HttpResponseCode } from '../constants/http_response';
import { BaseController } from './BaseController';
import UserRepository from '../repository/UserRepository';

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

  @Security('jwt')
  @Post('auth/2fa')
  @Response<ValidateErrorJSON>(HttpResponseCode.HTTP_VALIDATE_ERROR, 'Validation Failed')
  public async auth2fa(@Request() request: any): Promise<any> {
    const result = await new UserRepository().generate2Fa(request.user.user_id, request.user.email);
    return this.handleResponse(result, HttpResponseCode.HTTP_OK, result?.message);
  }

  @Security('jwt')
  @Post('auth/verify-2fa')
  @Response<ValidateErrorJSON>(HttpResponseCode.HTTP_VALIDATE_ERROR, 'Validation Failed')
  public async verify2fa(@Body() requestBody: TwoFA, @Request() request: any): Promise<any> {
    const result = await new UserRepository().verify2Fa(requestBody.code, request.user.user_id);
    return this.handleResponse(result, HttpResponseCode.HTTP_OK, result?.message);
  }
}
