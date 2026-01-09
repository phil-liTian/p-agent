import { ChatDeepSeek } from '@langchain/deepseek'
import { HumanMessage, SystemMessage } from 'langchain'
import { KnowledgeParser } from '../utils/knowledge-parser'
import { join } from 'path'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatResponse {
  message: string
  relevantSections?: string[]
  confidence: number
}

export class ChatBot {
  private llm: ChatDeepSeek
  private knowledgeParser: KnowledgeParser
  private conversationHistory: ChatMessage[] = []

  constructor() {
    this.llm = new ChatDeepSeek({
      modelName: 'deepseek-chat',
      temperature: 0.7,
      apiKey: 'sk-d1e367c4afa046e39bb3aa7a8e4189a9',
      streaming: false,
    })

    // 初始化知识解析器
    const knowledgePath = join(
      process.cwd(),
      'src',
      'utils',
      'me-restructured.md'
    )
    this.knowledgeParser = new KnowledgeParser(knowledgePath)
  }

  /**
   * 初始化知识库
   */
  async initialize(): Promise<void> {
    try {
      await this.knowledgeParser.parse()
      console.log('知识库初始化成功')
    } catch (error) {
      console.error('知识库初始化失败:', error)
      throw new Error('无法加载知识库')
    }
  }

  /**
   * 处理用户消息并生成回复
   */
  async processMessage(userMessage: string): Promise<ChatResponse> {
    try {
      // 记录用户消息
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      })

      // 查找相关知识
      const relevantSections =
        this.knowledgeParser.findRelevantSections(userMessage)

      // 构建系统提示
      const systemPrompt = this.buildSystemPrompt(relevantSections)

      // 构建消息历史
      const messages = [
        new SystemMessage(systemPrompt),
        ...this.conversationHistory.map((msg) =>
          msg.role === 'user'
            ? new HumanMessage(msg.content)
            : new SystemMessage(msg.content)
        ),
      ]

      // 调用LLM生成回复
      const response = await this.llm.invoke(messages)
      const assistantMessage = response.content as string

      // 记录助手回复
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
      })

      // 计算置信度（基于相关知识的匹配程度）
      const confidence = this.calculateConfidence(relevantSections, userMessage)

      return {
        message: assistantMessage,
        relevantSections: relevantSections.map((section) => section.title),
        confidence,
      }
    } catch (error) {
      console.error('处理消息时出错:', error)
      return {
        message: '抱歉，处理您的消息时出现了错误。请稍后再试。',
        confidence: 0,
      }
    }
  }

  /**
   * 构建系统提示
   */
  private buildSystemPrompt(relevantSections: any[]): string {
    let prompt = `你是phil的私人助理。请根据以下知识库信息回答问题：

知识库内容：
`
    relevantSections.forEach((section) => {
      prompt += `标题: ${section.title}\n内容: ${section.content}\n\n`
    })

    prompt += `
回答要求：
1. 基于提供的知识库内容准确回答问题
2. 如果问题超出知识库范围，请明确说明
3. 保持回答简洁明了
4. 使用中文回答
5. 如果相关，可以引用具体的项目或成就`

    return prompt
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(relevantSections: any[], query: string): number {
    if (relevantSections.length === 0) return 0.3

    // 简单的置信度计算：基于相关章节数量和查询长度
    const sectionCountFactor = Math.min(relevantSections.length / 3, 1)
    const lengthFactor = Math.min(query.length / 50, 1)

    return Math.min((sectionCountFactor + lengthFactor) / 2, 0.95)
  }

  /**
   * 获取对话历史
   */
  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory]
  }

  /**
   * 清空对话历史
   */
  clearHistory(): void {
    this.conversationHistory = []
  }

  /**
   * 获取知识库状态
   */
  isKnowledgeBaseReady(): boolean {
    return true // 简化处理，假设知识库总是准备好的
  }
}
