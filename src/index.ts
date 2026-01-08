/**
 * Node.js 项目入口文件
 * @author phil
 * @date 2026-01-08
 */

import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { Server } from 'http'

// 加载环境变量
dotenv.config()

// 创建 Express 应用
const app: Application = express()

// 中间件配置
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 健康检查路由
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// 根路径路由
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '欢迎使用 Node.js 项目模板',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// 404 处理
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: '请求的资源不存在',
    timestamp: new Date().toISOString(),
  })
})

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误',
    timestamp: new Date().toISOString(),
  })
})

// 启动服务器
const PORT: number = parseInt((process.env.PORT as string) || '3000', 10)
const HOST: string = (process.env.HOST as string) || 'localhost'

const server: Server = app.listen(PORT, HOST, () => {
  console.log(`🚀 服务器启动成功！`)
  console.log(`📝 服务器地址: http://${HOST}:${PORT}`)
  console.log(`🔍 健康检查: http://${HOST}:${PORT}/health`)
  console.log(`📦 环境: ${process.env.NODE_ENV || 'development'}`)
})

export default app
