# 心理健康助手

一个心理健康服务系统的全栈项目，包含**前台用户端**与**后台管理端**，前后端分离开发。

- 前台：首页、在线咨询、情绪日记、心理知识文章（列表 / 详情）
- 后台：数据分析看板、知识文章管理、咨询记录管理、情绪日志管理
- 权限：登录后按 `userType` 区分角色（1 = 普通用户，2 = 管理员），路由守卫自动引导到对应端

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3.5、Vite 8、Vue Router 4、Pinia、Element Plus、ECharts、wangEditor、axios |
| 后端 | Spring Boot 4.2、Spring Security、MyBatis-Plus 3.5、Lombok、Java 17 |
| 数据库 | MySQL 8 |

## 目录结构

```
vue+springboot/
├── vite-project/                     # 前端
│   ├── src/
│   │   ├── api/                      # 接口封装（admin.js / frontend.js）
│   │   ├── components/               # 布局框架与通用组件
│   │   ├── views/                    # 页面（前台 + 后台）
│   │   ├── router/index.js           # 路由表 + 登录/角色守卫
│   │   ├── stores/                   # Pinia 状态
│   │   └── assets/utils/request.js   # axios 实例与拦截器
│   └── vite.config.js                # 开发代理配置
│
└── springboot/                       # 后端
    ├── src/main/java/com/gym/springboot/
    │   ├── controller/               # 接口层
    │   ├── service/                  # 业务层
    │   ├── mapper/                   # MyBatis-Plus Mapper
    │   ├── entity/ DTO/              # 实体与出入参对象
    │   └── common/                   # 统一响应 Result、全局异常处理
    └── src/main/resources/
        └── application.yml           # 数据库连接与端口配置
```

## 环境要求

- Node.js 18+
- JDK 17
- MySQL 8
- Maven 3.9+（也可直接使用项目自带的 `mvnw`，无需单独安装）

## 快速开始

### 1. 准备数据库

```sql
CREATE DATABASE mental_health_assistant02 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

> 仓库目前未包含建表脚本，表结构请按 `springboot/src/main/java/com/gym/springboot/entity` 下的实体字段自行创建，或把你本地的 `.sql` 导出后放进 `sql/` 目录一并提交。

### 2. 启动后端

```bash
cd springboot

# 按需修改 src/main/resources/application.yml 里的数据库账号密码

# 启动（Windows 用 mvnw.cmd，已装 Maven 可直接 mvn spring-boot:run）
./mvnw spring-boot:run
```

服务默认端口 **1236**，启动后接口地址形如 `http://localhost:1236/api/...`。

### 3. 启动前端

```bash
cd vite-project
npm install
npm run dev
```

浏览器打开 Vite 提示的地址（默认 `http://localhost:5173`）。

### 关于接口代理

`vite-project/vite.config.js` 中 `/api` 当前代理到已部署的远程后端 `http://159.75.169.224:1235`。
如果要用**本机后端联调**，把 target 改成 `http://localhost:1236` 即可。

## 构建部署

```bash
# 前端：产物在 vite-project/dist
cd vite-project && npm run build

# 后端：产物在 springboot/target/*.jar
cd springboot && ./mvnw clean package
java -jar target/springboot-0.0.1-SNAPSHOT.jar
```

前端是 History 路由模式，部署到 Nginx 时需要配置 `try_files $uri $uri/ /index.html`，否则刷新子路由会 404。

## 页面路由

| 路径 | 说明 |
|---|---|
| `/` | 前台首页 |
| `/consultation` | 在线咨询 |
| `/emotion-diary` | 情绪日记 |
| `/knowledge` | 知识文章列表 |
| `/knowledge/article/:id` | 文章详情 |
| `/auth/login`、`/auth/register` | 登录、注册 |
| `/back/dashboard` | 后台数据看板 |
| `/back/knowledge` | 知识文章管理 |
| `/back/consultions` | 咨询记录 |
| `/back/emotional` | 情绪日志 |

## 配置说明

- `springboot/src/main/resources/application.yml` 中只保留**示例配置**，数据库账号密码是占位符，真实的账号密码不会提交到仓库
- 本地首次运行：把该文件里的 `username` / `password` 改成自己的 MySQL 账号即可，代码无需其他改动
- 该文件对 Git 设置了「忽略本地修改」（`git update-index --skip-worktree`），所以本地填了真实密码后 `git status` 依旧干净，`git add .` 也不会把密码提交上去
- 如果要修改仓库里的示例内容（例如换端口），先临时解除忽略，改完提交后再恢复：

```bash
git update-index --no-skip-worktree springboot/src/main/resources/application.yml
# 修改 → commit → push
git update-index --skip-worktree springboot/src/main/resources/application.yml
```
