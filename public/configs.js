const urls = {
  oss_uri: 'http://118.31.184.21:9006', // tucci的文档管理微服务
  portal_system_url: 'http://118.31.184.21:6543/', // Portal系统登录页.
  base_url_login: 'http://118.31.184.21:5035', // 后台登录接口.需要在header中带上token. 用的是葛志坚在21测试服的接口.
};

window.__configs = {
  urls,
};
