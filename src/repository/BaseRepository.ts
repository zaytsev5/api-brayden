import { CommonResponse } from '../types/global';

export default class BaseRepository {
  responseError(message): CommonResponse {
    return {
      status: false,
      message,
    };
  }

  responseSuccess(message, data): CommonResponse {
    return {
      status: true,
      data,
      message,
    };
  }
}
