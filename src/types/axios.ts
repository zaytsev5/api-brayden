export interface DataResponse {
  data?: any;
  message?: string;
  status: boolean;
}

export interface ErrorDetail {
  message: string;
  value?: string;
}

export interface ErrorResponse {
  status: boolean;
  message: string;
  details?: { [k: string]: ErrorDetail };
}
