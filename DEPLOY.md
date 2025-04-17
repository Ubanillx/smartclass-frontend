# 智能课堂前端应用部署指南

本文档提供了使用Docker和Docker Compose部署智能课堂前端应用的详细步骤。

## 前提条件

- 安装了Docker和Docker Compose
- 有访问代码仓库的权限

## 部署步骤

### 1. 获取代码

```bash
git clone <仓库地址> smartclass-frontend
cd smartclass-frontend
```

### 2. 配置环境变量（可选）

如果需要自定义后端API地址，编辑`docker-compose.yml`文件，修改`API_BASE_URL`环境变量：

```yaml
environment:
  - API_BASE_URL=http://你的后端地址/api
```

### 3. 构建和启动容器

使用Docker Compose一键启动应用：

```bash
docker-compose up -d
```

这将会：
- 构建前端应用Docker镜像
- 创建并启动容器
- 在后台运行服务

### 4. 验证部署

在浏览器中访问：`http://服务器IP地址`

如果一切正常，你应该能看到智能课堂前端应用的登录页面。

### 5. 查看容器日志

如果需要排查问题，可以查看容器日志：

```bash
docker-compose logs -f
```

### 6. 停止服务

```bash
docker-compose down
```

### 7. 更新应用

当有代码更新时，执行以下命令重新构建并启动：

```bash
git pull                      # 获取最新代码
docker-compose down           # 停止当前容器
docker-compose build          # 重新构建镜像
docker-compose up -d          # 启动新容器
```

## 常见问题

### 1. 访问应用时出现404或空白页

- 检查Nginx配置是否正确
- 确认应用构建成功，dist目录中有文件

### 2. 无法连接到后端API

- 确认后端服务是否正常运行
- 检查`API_BASE_URL`环境变量是否设置正确

### 3. 修改端口

如果需要更改默认的80端口，编辑`docker-compose.yml`文件中的端口映射：

```yaml
ports:
  - "你的新端口:80"
```

## 自定义配置

### 修改Nginx配置

如需修改Nginx配置，编辑项目中的`nginx.conf`文件，然后重新构建并启动容器。 