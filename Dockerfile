# 将项目使用Node打包,然后部署到Nginx镜像. 参考https://www.jianshu.com/p/08e6f00bb689
# 基于node slim镜像进行打包..并给这个阶段一个名字builder
FROM node:current-buster-slim as builder
WORKDIR /app
# 安装tyarn,并拷贝package.json然后安装依赖.
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install -g tyarn
COPY package.json . 
# 利用docker的cache机制，可避免不必要的依赖安装的耗时。因此先拷贝package.json,单独安装依赖.下一次再执行Dockerfile时,只要package.json没有修改,就不会再次执行极其耗时的tyarn(npm install).
# 第二次构建的时候，他会根据你COPY指令中对应的内容是否与上一次构建的内容一致来决定是否要启用上一次执行的cache，如果检查到COPY package.json .这一层中，package.json文件和上次没有任何改变，那么接下来的RUN npm install这一层就会使用上一次执行的cache。
RUN tyarn

# 其他代码文件肯定是每次都有修改的,因此npm run build单独执行.
# 注意别把ndoe_modules和.vscode啥的拷过去了.实际上这个操作应当在服务器上GIT同步文件后执行,而不是本地的开发环境.
COPY . .
RUN npm run build

FROM nginx:latest 
COPY docs/nginx.conf /etc/nginx
# 将stage:builder的打包产物dist目录下所有内容拷贝到nginx工作目录下.
COPY --from=builder /app/dist /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

CMD ["/bin/bash"]
