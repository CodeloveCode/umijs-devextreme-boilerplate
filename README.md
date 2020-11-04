# vskysoft-QMS, 西宁质量管理.

基于ReactJS, devExtreme组件库 开发.

## Getting Started

* 使用前准备

删除pages目录下除login, 404.tsx, document.ejs, index.tsx以外的所有目录
/src/configs/menus.ts中配置需要的菜单
/src/configs/url.ts中配置接口用到的url

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

修改/src/configs/url.ts中的uri为正式环境的服务器接口.

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

## 从服务器获取菜单.

路由在项目本地肯定是要有的. 但是否生效, 可以从服务器获取数据进行控制.
菜单也是如此. 本项目目前菜单为了方便测试, 还是在本地测试, 服务器上只在部署时去Portal页进行相应的配置.

给没有服务器端菜单管理的项目集成此功能过程:

1. /src/pages/login下,复制DTO.ts到目标项目
2. /src/configs/configs.ts,/src/pages/login/service.ts中,更新登录的url
3. /src/layout/index.tsx中,复制方法loopMenuItem到目标项目对应位置,修改render方法中的部分代码

``` JS
menuDataRender = {
    () => loopMenuItem(menus, userProfile)
}
```

4. 部署前检查/public/configs.ts, 确保登陆url已配置.
5. 部署后,去Portal系统配置目标系统的菜单权限,分挂到相应用户下.用户登录时,即可获取到menus,项目中便会自动进行菜单的相应渲染.
