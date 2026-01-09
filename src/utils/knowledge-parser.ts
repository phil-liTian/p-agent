import { readFileSync } from 'fs'

export interface KnowledgeSection {
  title: string
  content: string
  keywords: string[]
}

export interface KnowledgeBase {
  sections: KnowledgeSection[]
  summary: string
}

export class KnowledgeParser {
  private knowledgeBase: KnowledgeBase | null = null

  constructor(private filePath: string) {}

  parse(): KnowledgeBase {
    if (this.knowledgeBase) {
      return this.knowledgeBase
    }

    try {
      const content = readFileSync(this.filePath, 'utf-8')

      const sections = this.extractSections(content)

      this.knowledgeBase = {
        sections,
        summary: this.generateSummary(sections),
      }

      return this.knowledgeBase
    } catch (error) {
      console.error('Error parsing knowledge file:', error)
      throw new Error(`Failed to parse knowledge file: ${this.filePath}`)
    }
  }

  private extractSections(content: string): KnowledgeSection[] {
    const sections: KnowledgeSection[] = []

    // 使用正则表达式匹配markdown标题
    const sectionRegex = /^(#{1,6})\s+(.+)$([\s\S]*?)(?=^#{1,6}\s+|\Z)/gm
    let match

    while ((match = sectionRegex.exec(content)) !== null) {
      const title = match[2]?.trim() || ''
      const sectionContent = match[3]?.trim() || ''
      const keywords = this.extractKeywords(title, sectionContent)

      sections.push({
        title,
        content,
        keywords,
      })
    }

    return sections
  }

  private extractKeywords(title: string, content: string): string[] {
    // 提取关键词，包括标题中的词和内容中的重要词汇
    const keywords: string[] = []

    // 添加标题中的词
    const titleWords = title.split(/\s+/)
    keywords.push(...titleWords.filter((word) => word.length > 2))

    // 添加内容中的高频词（排除常见停用词）
    const stopWords = new Set([
      '的',
      '了',
      '在',
      '是',
      '我',
      '有',
      '和',
      '就',
      '不',
      '人',
      '都',
      '一',
      '一个',
      '上',
      '也',
      '很',
      '到',
      '说',
      '要',
      '去',
      '你',
      '会',
      '着',
      '没有',
      '看',
      '好',
      '自己',
      '这',
    ])

    const words = content.toLowerCase().match(/[\u4e00-\u9fa5]+/g) || []
    const wordCount: Record<string, number> = {}

    words.forEach((word) => {
      if (word.length > 1 && !stopWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })

    // 按频率排序，取前10个
    const sortedWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)

    keywords.push(...sortedWords)

    return [...new Set(keywords)]
  }

  private generateSummary(sections: KnowledgeSection[]): string {
    const totalSections = sections.length
    const totalContentLength = sections.reduce(
      (sum, section) => sum + section.content.length,
      0
    )

    return `知识库包含 ${totalSections} 个主题，总内容长度 ${totalContentLength} 字符，涵盖工作项目、技术创新、团队建设等多个方面。`
  }

  findRelevantSections(query: string): KnowledgeSection[] {
    if (!this.knowledgeBase) {
      this.parse()
    }

    const queryWords = query.toLowerCase().split(/\s+/)
    const relevantSections: { section: KnowledgeSection; score: number }[] = []

    this.knowledgeBase!.sections.forEach((section) => {
      let score = 0

      // 关键词匹配得分
      queryWords.forEach((queryWord) => {
        if (section.title.toLowerCase().includes(queryWord)) {
          score += 3
        }

        if (section.content.toLowerCase().includes(queryWord)) {
          score += 1
        }

        section.keywords.forEach((keyword) => {
          if (keyword.toLowerCase().includes(queryWord)) {
            score += 2
          }
        })
      })

      if (score > 0) {
        relevantSections.push({ section, score })
      }
    })

    // 按得分排序
    relevantSections.sort((a, b) => b.score - a.score)

    return relevantSections.slice(0, 3).map((item) => item.section)
  }

  getAllSections(): KnowledgeSection[] {
    if (!this.knowledgeBase) {
      this.parse()
    }

    return this.knowledgeBase!.sections
  }
}
