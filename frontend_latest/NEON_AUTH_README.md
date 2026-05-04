# Neon 真实认证系统完成文档

## 系统概览

你现在有了一个**完全真实的 Neon PostgreSQL + Next.js API Routes 认证系统**，所有用户数据都存储在真实的数据库中。

## 组件说明

### 数据库

- **users 表**：存储邮箱、加密密码、姓名、创建时间
- **user_profiles 表**：用户档案（头像、电话、地址、个人简介等）

### API 路由

1. **POST /api/auth/init-db** - 初始化数据库表（自动调用）
2. **POST /api/auth/register** - 邮箱注册新账户
3. **POST /api/auth/login** - 邮箱登录
4. **POST /api/auth/logout** - 退出登录（清除 cookie）
5. **GET /api/auth/me** - 获取当前用户信息

### 页面

- **/register** - 注册页面
- **/login** - 登录页面
- **/dashboard** - 需要登录才能访问

## 配置步骤

### 1. 确保 DATABASE_URL 已配置

在 v0 的 **Settings → Vars** 中，需要有 `DATABASE_URL` 环境变量，指向你的 Neon PostgreSQL 数据库。

格式类似：`postgresql://user:password@host/database`

### 2. 安装依赖

系统会自动安装：
- `@neondatabase/serverless` - Neon 数据库驱动
- `bcryptjs` - 密码加密库

## 工作流程

### 注册流程
1. 用户访问 `/register`
2. 填写姓名、邮箱、密码
3. 前端调用 `/api/auth/init-db`（自动初始化表）
4. 前端调用 `/api/auth/register`
5. 密码被 bcryptjs 加密后存储到数据库
6. 注册成功后跳转到登录页

### 登录流程
1. 用户访问 `/login`
2. 输入邮箱和密码
3. 前端调用 `/api/auth/login`
4. API 验证邮箱存在且密码正确
5. 设置 HttpOnly cookie（session_id、user_id、user_email）
6. 登录成功后跳转到 `/dashboard`

### 路由守卫
- **middleware.ts** 检查访问 `/dashboard` 是否有有效的 `user_id` cookie
- 未登录用户自动重定向到 `/login`
- 已登录用户访问 `/login` 或 `/register` 自动重定向到 `/dashboard`

### 退出登录流程
1. 用户点击导航栏的"退出登录"按钮
2. 前端调用 `/api/auth/logout`
3. API 删除所有认证 cookie
4. 用户被重定向到 `/login`

## 密码安全

- 密码要求：至少 8 个字符，包含大小写字母和数字
- 存储方式：bcryptjs 加密（盐值 10 轮）
- 验证方式：`bcrypt.compare()` 安全对比

## Cookie 设置

- **session_id** - HttpOnly，7 天过期
- **user_id** - HttpOnly，7 天过期
- **user_email** - 可在客户端读取，7 天过期

## 测试账户

第一次使用时，系统会自动创建表。你可以：

1. 先访问 `/register` 创建一个测试账户
2. 输入示例：
   - 姓名：张三
   - 邮箱：test@example.com
   - 密码：Test123456
3. 注册成功后登录
4. 点击"退出登录"测试 logout

## 生产部署建议

1. **使用 JWT 代替 cookie**（可选）
   - 目前使用 cookie session，也可以改成 JWT token
   
2. **添加邮箱验证**（可选）
   - 发送验证邮件到用户邮箱
   
3. **添加找回密码功能**（可选）
   - 创建 `/api/auth/forgot-password` 和 `/api/auth/reset-password`

4. **添加速率限制**（推荐）
   - 防止暴力破解
   - 使用 Upstash Redis

5. **启用 HTTPS**
   - 生产环境必须使用 HTTPS（secure cookie 才会有效）

## 故障排除

### "failed to fetch" 错误
- 检查 `DATABASE_URL` 是否正确设置
- 检查 Neon 数据库连接是否有效
- 打开浏览器开发者工具 (F12) → Network 标签查看具体错误

### 密码不匹配错误
- 检查"两次输入的密码"是否一致
- 检查密码是否符合强度要求

### 邮箱已存在错误
- 该邮箱已被注册过
- 使用不同的邮箱重试，或尝试登录

## 源代码位置

- **认证 API**：`/app/api/auth/`
- **认证工具**：`/lib/auth.ts`
- **数据库客户端**：`/lib/db.ts`
- **页面**：`/app/register/page.tsx`、`/app/login/page.tsx`
- **路由守卫**：`/middleware.ts`
- **导航栏**：`/components/dashboard-nav.tsx`

祝你使用愉快！
