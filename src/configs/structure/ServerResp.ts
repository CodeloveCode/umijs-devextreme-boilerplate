/**
 * 后台的响应数据结构.
 */
export default interface ServerResp {
  code: number;
  message: string;
  data: [] | boolean | any;
}

/**
 * 另一种 后台响应数据结构.
 */
export interface DTOResponse {
  success: boolean;
  code: number;
  message: string;
  data: any;
}