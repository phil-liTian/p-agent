/**
 * 错误处理中间件
 * @author phil
 * @date 2026-01-08
 */

import { Request, Response, NextFunction } from 'express'

/**
 * 自定义错误类型接口
 */
export interface AppError extends Error {
  statusCode?: number
  code?: string
}

/**
 * 错误处理中间件
 * @param err - 错误对象
 * @param req - Express请求对象
 * @param res - Express响应对象
 * @param next - Express下一步函数
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err, req, next)

  // 设置默认状态码
  const statusCode = err.statusCode || 500
  const code = err.code || 'INTERNAL_SERVER_ERROR'

  // 返回错误响应
  res.status(statusCode).json({
    success: false,
    code,
    message: err.message || '服务器内部错误',
    timestamp: new Date().toISOString(),
  })
}

/**
 * 404 错误处理中间件
 * @param req - Express请求对象
 * @param res - Express响应对象
 * @param next - Express下一步函数
 */
export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: '请求的资源不存在',
    timestamp: new Date().toISOString(),
  })
}
