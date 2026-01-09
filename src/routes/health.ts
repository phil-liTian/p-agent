/**
 * 健康检查路由
 * @author phil
 * @date 2026-01-08
 */

import { Router, Request, Response } from 'express'

// 创建路由实例
const router: Router = Router()

/**
 * GET /health
 * 健康检查接口
 * @param req - Express请求对象
 * @param res - Express响应对象
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '服务运行正常',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

export { router as healthRouter }
