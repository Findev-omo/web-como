export interface IResponse<T> {
  data: T;
  resultCode: string;
  resultMessage: string;
}
