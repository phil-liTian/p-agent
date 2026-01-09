/*
 * @Author: phil
 * @Date: 2026-01-08 13:48:52
 */
/**
 * Node.js 项目入口文件
 * @author phil
 * @date 2026-01-08
 */

import express, { Application } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'http'

// 加载环境变量
dotenv.config()

// 导入路由
import { rootRouter } from './routes/index'
import { healthRouter } from './routes/health'
import chatRouter from './routes/chat'
import userRouter from './routes/user'

// 导入中间件
import { errorHandler, notFoundHandler } from './middleware/error-handler'

// 创建 Express 应用
const app: Application = express()

// 中间件配置
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由配置
app.use('/', rootRouter)
app.use('/', healthRouter)
app.use('/', chatRouter)
app.use('/', userRouter)

// 404 处理中间件 - 必须在所有路由之后
app.use(notFoundHandler)

// 错误处理中间件 - 必须在最后
app.use(errorHandler)

// 启动服务器
const PORT: number = parseInt((process.env.PORT as string) || '3000', 10)
const HOST: string = (process.env.HOST as string) || '0.0.0.0' || 'localhost'

export const server: Server = app.listen(PORT, HOST, () => {
  console.log(`🚀 服务器启动成功！`)
  console.log(`📝 服务器地址: http://${HOST}:${PORT}`)
  console.log(`🔍 健康检查: http://${HOST}:${PORT}/health`)
  console.log(`📦 环境: ${process.env.NODE_ENV || 'development'}`)
})

export default app
