# 构建阶段: 使用Node.js环境
FROM node:16-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 创建生产环境变量文件（如果在容器构建期间需要覆盖环境变量）
RUN echo "VITE_APP_API_BASE_URL=${API_BASE_URL:-http://backend.smartclass.ubanillx.cn/api}" > .env.production

# 构建应用
RUN npm run build

# 生产阶段: 使用Nginx部署静态文件
FROM nginx:stable-alpine as production-stage

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 从构建阶段复制构建文件
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义Nginx配置（如果需要）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"] 