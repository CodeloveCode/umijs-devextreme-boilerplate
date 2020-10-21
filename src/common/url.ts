// 局域网开发和测试环境.

let uri
let uri_company
let uri_monitor
let oss_uri
let uri_login
if ('development' === process.env.NODE_ENV) {
    uri = 'http://118.31.184.21:9009'; // 系统微服务
    uri_company = 'http://118.31.184.21:9009'; // 企业微服务
    uri_monitor = 'http://118.31.184.21:9009'; // 监控微服务
    oss_uri = 'http://118.31.184.21:9009';

    uri_login = 'http://118.31.184.21:5000'
} else {
    // 供正式环境部署使用
    uri = 'http://172.18.5.30:9001';
    uri_company = 'http://118.31.184.21:9002'; // 企业微服务
    uri_monitor = 'http://118.31.184.21:9004'; // 监控微服务
    oss_uri = 'http://172.18.5.30:9006';
    uri_login = 'http://118.31.184.21:5000'
}

export { uri, uri_company, uri_monitor, oss_uri, uri_login }

