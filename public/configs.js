const urls = {
  oss_uri: 'http://118.31.184.21:9006', // tucci的文档管理微服务
  portal_system_url: 'http://118.31.184.21:6543/', // Portal系统登录页.
  base_url_login: 'http://118.31.184.21:5035', // 后台登录接口.需要在header中带上token. 用的是葛志坚在21测试服的接口.

  base_url_java_two_table: 'http://10.21.18.231:8080', // 海燕要的两张临时表.配置java后台使用.
};

const PERMISSIONS = {
  CAN_ADD: 'perm-add-res',
  CAN_DELETE: 'perm-del-res',
};

window.__configs = {
  urls,
  PERMISSIONS,
};
