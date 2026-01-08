<!--
 * @Author: phil
 * @Date: 2026-01-08 13:44:12
-->
# Node.js 项目

这是一个基于 Node.js 的标准化项目模板，遵循最佳实践和开发规范。

## 项目结构

```
project-root/
├── src/                    # 源代码目录
│   ├── api/               # API接口相关
│   ├── config/            # 配置文件
│   ├── controllers/       # 控制器层
│   ├── middleware/        # 中间件
│   ├── models/            # 数据模型
│   ├── routes/            # 路由定义
│   ├── services/          # 业务逻辑层
│   ├── utils/             # 工具函数
│   └── index.js           # 入口文件
├── test/                  # 测试文件
├── docs/                  # 文档
├── .github/               # GitHub相关配置
├── .husky/                # Git钩子
├── .vscode/               # VSCode配置
├── node_modules/          # 依赖包
├── package.json           # 项目配置
├── .gitignore             # Git忽略文件
├── .env                   # 环境变量
├── .env.example           # 环境变量示例
├── README.md              # 项目说明
└── pnpm-lock.yaml         # 依赖锁文件
```

## 开发环境准备

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

然后根据需要修改 `.env` 文件中的配置。

### 3. 启动开发服务器

```bash
pnpm dev
```

## 开发规范

本项目遵循 Node.js 开发规范，详见 `.joycode/rules/node.mdc` 文件。

### 主要规范

- 使用 ES6+ 语法
- 使用 2 个空格缩进
- 使用单引号字符串
- 行末不使用分号
- 使用 kebab-case 命名文件和目录
- 使用 pnpm 作为包管理器

## 脚本命令

- `pnpm dev` - 启动开发服务器
- `pnpm start` - 启动生产服务器
- `pnpm test` - 运行测试
- `pnpm lint` - 运行代码检查
- `pnpm format` - 格式化代码

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT