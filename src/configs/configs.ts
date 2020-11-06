const urls = {
  oss_uri: 'http://118.31.184.21:9006', // tucci的文档管理微服务
  portal_system_url: 'http://118.31.184.21:6543/', // Portal系统登录页.
  base_url_login: 'http://118.31.184.21:5035', // 后台登录接口.需要在header中带上token
  base_url_java_two_table: 'http://172.16.10.15:8080', // 海燕要的两张临时表.配置java后台使用.
};
const permissions = {
  CAN_DELETE: 'can-delete',
};
export default {
  urls,
  permissions,
};
