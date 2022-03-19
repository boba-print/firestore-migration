import Axios, { AxiosError } from "axios";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
};
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ExternalHttpServiceError extends Error {
  // 외부 Http 서비스 오류
  constructor(message: string, private axiosError: AxiosError) {
    super(message);
    this.name = 'ExternalHttpServiceError';
  }
}