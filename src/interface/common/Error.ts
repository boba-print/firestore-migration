export interface ErrorWithStatus {
  name?: string;
  message: string;
  description?: string;
  statusCode: number;
  stack?: string;
}
