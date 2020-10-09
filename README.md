# reactJs, devExtreme-ui project

vskysoft-QMS, 西宁质量管理.

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
