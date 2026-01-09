import { Router, Request, Response, NextFunction } from 'express'
import { ChatBot } from '../services/chat-bot'
import { ChatResponse } from '../services/chat-bot'

const router: Router = Router()

// 创建聊天机器人实例
const chatBot = new ChatBot()

// 初始化聊天机器人
chatBot.initialize().catch((error) => {
  console.error('Failed to initialize chat bot:', error)
})

/**
 * POST /chat
 * 处理聊天消息
 */
router.post(
  '/chat',
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { message } = req.body

      // 验证请求参数
      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          code: 'INVALID_MESSAGE',
          message: '消息内容不能为空',
          data: null,
          timestamp: new Date().toISOString(),
        })
      }

      // 检查聊天机器人是否已准备好
      if (!chatBot.isKnowledgeBaseReady()) {
        return res.status(503).json({
          success: false,
          code: 'SERVICE_UNAVAILABLE',
          message: '聊天服务暂时不可用，请稍后再试',
          data: null,
          timestamp: new Date().toISOString(),
        })
      }

      // 处理用户消息
      const response: ChatResponse = await chatBot.processMessage(
        message.trim()
      )

      // 返回成功响应
      return res.json({
        success: true,
        code: 'SUCCESS',
        message: '消息处理成功',
        data: response,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error processing chat message:', error)

      // 如果错误是 Error 类型，返回错误信息
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          code: 'INTERNAL_ERROR',
          message: '处理消息时出现错误',
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

/**
 * GET /chat/history
 * 获取对话历史
 */
router.get('/chat/history', (_req: Request, res: Response) => {
  try {
    const history = chatBot.getConversationHistory()

    return res.json({
      success: true,
      code: 'SUCCESS',
      message: '获取对话历史成功',
      data: history,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error getting chat history:', error)

    return res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      message: '获取对话历史失败',
      data: null,
      timestamp: new Date().toISOString(),
    })
  }
})

/**
 * DELETE /chat/history
 * 清空对话历史
 */
router.delete('/chat/history', (_req: Request, res: Response) => {
  try {
    chatBot.clearHistory()

    return res.json({
      success: true,
      code: 'SUCCESS',
      message: '对话历史已清空',
      data: null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error clearing chat history:', error)

    return res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      message: '清空对话历史失败',
      data: null,
      timestamp: new Date().toISOString(),
    })
  }
})

export default router
