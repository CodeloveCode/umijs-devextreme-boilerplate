/**
 * 后台的响应数据结构.
 */
export default interface ServerResp {
  code: number;
  message: string;
  data: [] | boolean | any;
}
