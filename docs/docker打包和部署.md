参考: [用Docker部署前端应用](https://www.jianshu.com/p/08e6f00bb689)

## 打包到Docker镜像

docker build -f ./Dockerfile -t scaffolding:1.0 .
docker build -t scaffolding:1.0 .

## 运行docker镜像

docker run -id --name testdocker -p 80:80 testdocker:latest

## 登录容器:

docker exec -it testdocker /bin/bash

* 启动nginx:

service start nginx

* 查看状态:

service status nginx

* 重载:

service reload nginx
