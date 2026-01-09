/**
 * 根路径路由
 * @author phil
 * @date 2026-01-08
 */

import { Router, Request, Response } from 'express'
// import chatRouter from './chat'

// 创建路由实例
const router: Router = Router()

/**
 * GET /
 * 根路径接口
 * @param req - Express请求对象
 * @param res - Express响应对象
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '欢迎使用 API 服务',
    version: '1.0.0',
    endpoints: [
      {
        path: '/',
        method: 'GET',
        description: 'API根路径',
      },
      {
        path: '/health',
        method: 'GET',
        description: '健康检查接口',
      },
      {
        path: '/chat',
        method: 'POST',
        description: '聊天接口',
      },
      {
        path: '/chat/history',
        method: 'GET',
        description: '获取聊天历史',
      },
      {
        path: '/chat/history',
        method: 'DELETE',
        description: '清空聊天历史',
      },
    ],
  })
})

// 注册聊天路由
// router.use('/chat', chatRouter)

export { router as rootRouter }
