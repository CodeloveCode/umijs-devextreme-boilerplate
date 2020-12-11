const urls = {
  oss_uri: 'http://118.31.184.21:9006', // tucci的文档管理微服务
  portal_system_url: 'http://118.31.184.21:6543/', // Portal系统登录页.
  base_url_login: 'http://118.31.184.21:5035', // 葛志坚的QMS的对接Portal的后台登录接口.需要在header中带上token
  base_url_java_two_table: 'http://172.16.10.15:8080', // 海燕要的两张临时表.配置java后台使用.
  system_mgmt: 'http://172.16.10.75:8010/api/v1', // 微服务-系统管理
};
const PERMISSIONS = {
  CAN_ADD: 'perm-add-res',
  CAN_DELETE: 'perm-del-res',

};
export {
  urls,
  PERMISSIONS,
};
