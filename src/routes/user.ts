import { Router, Request, Response, NextFunction } from 'express'
import User from '../models/user'

const router: Router = Router()

/**
 * POST /users
 * 创建新用户
 */
router.post(
  '/users',
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { username, email, password } = req.body

      // 验证请求参数
      if (!username || typeof username !== 'string') {
        return res.status(400).json({
          success: false,
          code: 'INVALID_USERNAME',
          message: '用户名不能为空',
          data: null,
          timestamp: new Date().toISOString(),
        })
      }

      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          code: 'INVALID_EMAIL',
          message: '邮箱不能为空',
          data: null,
          timestamp: new Date().toISOString(),
        })
      }

      if (!password || typeof password !== 'string') {
        return res.status(400).json({
          success: false,
          code: 'INVALID_PASSWORD',
          message: '密码不能为空',
          data: null,
          timestamp: new Date().toISOString(),
        })
      }

      // 检查邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          code: 'INVALID_EMAIL_FORMAT',
          message: '邮箱格式不正确',
          data: null,
          timestamp: new Date().toISOString(),
        })
      }

      // 检查用户名是否已存在
      const existingUserByUsername = await User.findOne({
        where: { username },
      })
      if (existingUserByUsername) {
        return res.status(409).json({
          success: false,
          code: 'USERNAME_EXISTS',
          message: '用户名已存在',
          data: null,
          timestamp: new Date().toISOString(),
        })
      }

      // 检查邮箱是否已存在
      const existingUserByEmail = await User.findOne({
        where: { email },
      })
      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          code: 'EMAIL_EXISTS',
          message: '邮箱已被注册',
          data: null,
          timestamp: new Date().toISOString(),
        })
      }

      // 创建新用户
      const newUser = await User.create({
        username,
        email,
        password,
      })

      // 返回创建成功的用户信息（不包含密码）
      const userResponse = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      }

      return res.status(201).json({
        success: true,
        code: 'SUCCESS',
        message: '用户创建成功',
        data: userResponse,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error creating user:', error)

      // 如果错误是 Error 类型，返回错误信息
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          code: 'INTERNAL_ERROR',
          message: '创建用户时出现错误',
          data: null,
          timestamp: new Date().toISOString(),
        })
      }

      // 对于未知错误类型
      return res.status(500).json({
        success: false,
        code: 'UNKNOWN_ERROR',
        message: '未知错误',
        data: null,
        timestamp: new Date().toISOString(),
      })
    }
  }
)

export default router