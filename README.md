# vskysoft-boilerplate.

基于ReactJS, devExtreme组件库 开发.
[https://gitee.com/mudking/react-umijs-devextreme](https://gitee.com/mudking/react-umijs-devextreme.git)

## Getting Started

* 安装tyarn

``` bash
npm install -g tyarn
```

* 安装项目依赖.

``` bash
tyarn
```

[使用方法](https://yarn.bootcss.com/docs/usage/)

* 启动: npm start
* 打包: npm run build

## 开发

### 增加一个页面

* src/pages下建立一个目录pageA, 放置index.jsx和index.less.
* 去src/configs/menus.ts中添加对应的菜单.
* 去pageA目录下开发UI
* pageA目录下增加一个service.ts, 封装对后台API接口的请求. 用到的uri前缀, 建议放到src/configs/configs.ts目录下.

## 部署

* 关闭mock(默认是关闭的)
* 检查src/configs/configs.ts中的地址是否添加到/public/configs.js中.
* npm run build 打包
* 将dist目录下的文件部署到目标服务器.

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
