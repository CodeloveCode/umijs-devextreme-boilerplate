参考: [用Docker部署前端应用](https://www.jianshu.com/p/08e6f00bb689)

## 打包到Docker镜像

docker build -f ./Dockerfile -t scaffolding:latest .
docker build -t scaffolding:latest .

## 运行docker镜像

docker run -id --name scaffolding -p 80:80 scaffolding:latest

## 登录容器:

docker exec -it scaffolding /bin/bash

* 启动nginx:

service nginx start

* 查看状态:

service nginx status

* 重载:

service nginx reload

## 镜像推送阿里云-容器镜像服务

阿里云控制台-容器镜像服务-实例列表-镜像仓库

``` bash
# 1. 登录阿里云Docker Registry.用于登录的用户名为阿里云账号全名，密码为开通服务时设置的密码。
$ sudo docker login --username=176585166@qq.com registry.cn-hangzhou.aliyuncs.com
# 2. 从Registry中拉取镜像

$ sudo docker pull registry.cn-hangzhou.aliyuncs.com/com_impking/vskysoft:[镜像版本号]
# 3. 将镜像推送到Registry

$ sudo docker login --username=17658****@qq.com registry.cn-hangzhou.aliyuncs.com
$ sudo docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/com_impking/vskysoft:[镜像版本号]
$ sudo docker push registry.cn-hangzhou.aliyuncs.com/com_impking/vskysoft:[镜像版本号]
```
