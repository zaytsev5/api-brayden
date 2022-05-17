'use strict';

import { Controller } from 'tsoa';

export class BaseController extends Controller {
  // handle response for create, update, delete
  handleResponse(result: any, statusCode: number, message?: string) {
    this.setStatus(statusCode);

    return result.status
      ? result
      : {
          status: false,
          message: message || 'An error occurred, please try again later',
        };
  }
}
