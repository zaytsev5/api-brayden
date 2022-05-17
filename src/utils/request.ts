import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { DataResponse, ErrorResponse } from '../types/axios';
import { encrypt } from './encrypt';

export abstract class HTTPBaseService {
  protected instance: AxiosInstance;

  public constructor(service: string) {
    const baseURL = this.setService(service);

    this.instance = axios.create({
      baseURL,
      withCredentials: true, // send cookies when cross-domain requests
      timeout: 5000, // request timeout
    });
    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  private initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // encrypt where
        if (config?.params?.where) {
          config.params.where = encrypt(JSON.stringify(config.params.where));
        }

        return config;
      },
      (error) => {
        console.log(error.message); // for debug
      },
    );
  };

  private initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use((response: AxiosResponse<DataResponse>) => {
      // Handle the returned result here

      return response;
    }, this.handleError);
  };

  private handleError = (error: AxiosError<ErrorResponse>) => {
    // Handle the returned error here

    return Promise.reject(error);
  };

  private setService(service: string): string | never {
    const GATEWAY = process.env.GATEWAY;
    switch (service) {
      case 'partner':
        return GATEWAY ? `${GATEWAY}/customer-service/api/v1` : `${process.env.PARTNER_SERVICE_URL}`;
      case 'customer':
        return GATEWAY ? `${GATEWAY}/customer-service/api/v1` : `${process.env.CUSTOMER_SERVICE_URL}`;
      case 'affiliate':
        return GATEWAY ? `${GATEWAY}/customer-service/api/v1` : `${process.env.AFFILIATE_SERVICE_URL}`;
    }
    throw new Error('SERVICE NOT FOUND');
  }
}
