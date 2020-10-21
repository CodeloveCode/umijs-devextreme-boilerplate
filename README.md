# vskysoft-QMS, 西宁质量管理.

基于ReactJS, devExtreme组件库 开发.

## Getting Started

* 安装依赖 tyarn

PS:[tyarn的安装](npm install yarn tyarn -g)
PS:[cnpm的安装](https://developer.aliyun.com/mirror/NPM?from=tnpm)

* 启动: npm start
* 打包: npm run build

## 部署

.umirc.ts中

``` js
mock: false,
```

修改/src/common/url.ts中的uri为正式环境的服务器接口.

npm run build

## 测试

## 环境变量

https://www.jianshu.com/p/328b79e262f7
process.env. NODE_ENV本来是只能再nodejs环境下访问的. 在浏览器端不能使用.
但webpack在打包时, 通过扩展 webpack. DefinePlugin 可以注入变量，在打包期间将js代码替换掉.umijs应该是默认配置了此功能.
因此执行npm start时, process.env. NODE_ENV是'development', 
npm run build时, 是'production'
npm run test时, 是'test'

``` js
new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
})
```

利用这个特性, 代码中可以在需要的地方使用process.env. NODE_ENV进行判断, 并使用不同的代码. 如: 数据库连接, 后台接口url等.
打包时, process.env. NODE_ENV会被替换成对应的常量.
