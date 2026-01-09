import { Op } from 'sequelize'
import User, { UserAttributes, UserCreationAttributes } from '../models/user'

// 数据库操作错误类型
class DatabaseError extends Error {
  constructor(message: string, public code: string = 'DATABASE_ERROR') {
    super(message)
    this.name = 'DatabaseError'
  }
}

// 用户相关错误类型
class UserError extends DatabaseError {
  constructor(message: string, code: string = 'USER_ERROR') {
    super(message, code)
    this.name = 'UserError'
  }
}

/**
 * 数据库服务类 - 使用Sequelize ORM
 */
class DatabaseService {
  /**
   * 测试数据库连接
   */
  async testConnection(): Promise<boolean> {
    try {
      await User.sequelize?.authenticate()
      console.log('数据库连接成功')
      return true
    } catch (error) {
      console.error('数据库连接失败:', error)
      throw new DatabaseError('数据库连接失败', 'CONNECTION_ERROR')
    }
  }

  /**
   * 同步数据库模型
   */
  async syncDatabase(): Promise<void> {
    try {
      await User.sync({ alter: true })
      console.log('数据库模型同步成功')
    } catch (error) {
      console.error('数据库模型同步失败:', error)
      throw new DatabaseError('数据库模型同步失败', 'SYNC_ERROR')
    }
  }

  // 用户相关操作

  /**
   * 创建用户
   */
  async createUser(userData: UserCreationAttributes): Promise<User> {
    try {
      const user = await User.create(userData)
      return user
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new UserError('用户名或邮箱已存在', 'DUPLICATE_USER')
      }
      throw new DatabaseError('创建用户失败', 'CREATE_USER_ERROR')
    }
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await User.findByPk(id)
      if (!user) {
        throw new UserError('用户不存在', 'USER_NOT_FOUND')
      }
      return user
    } catch (error) {
      if (error instanceof UserError) {
        throw error
      }
      throw new DatabaseError('获取用户失败', 'GET_USER_ERROR')
    }
  }

  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const user = await User.findOne({ where: { username } })
      return user
    } catch (error) {
      throw new DatabaseError('获取用户失败', 'GET_USER_ERROR')
    }
  }

  /**
   * 根据邮箱获取用户
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await User.findOne({ where: { email } })
      return user
    } catch (error) {
      throw new DatabaseError('获取用户失败', 'GET_USER_ERROR')
    }
  }

  /**
   * 获取所有用户
   */
  async getAllUsers(limit: number = 100, offset: number = 0): Promise<{ users: User[]; total: number }> {
    try {
      const { count, rows } = await User.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })
      return { users: rows, total: count }
    } catch (error) {
      throw new DatabaseError('获取用户列表失败', 'GET_USERS_ERROR')
    }
  }

  /**
   * 搜索用户
   */
  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    try {
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
          ],
        },
        limit,
        order: [['createdAt', 'DESC']],
      })
      return users
    } catch (error) {
      throw new DatabaseError('搜索用户失败', 'SEARCH_USERS_ERROR')
    }
  }

  /**
   * 更新用户
   */
  async updateUser(id: number, updateData: Partial<UserAttributes>): Promise<User> {
    try {
      const user = await User.findByPk(id)
      if (!user) {
        throw new UserError('用户不存在', 'USER_NOT_FOUND')
      }
      await user.update(updateData)
      return user
    } catch (error) {
      if (error instanceof UserError) {
        throw error
      }
      throw new DatabaseError('更新用户失败', 'UPDATE_USER_ERROR')
    }
  }

  /**
   * 删除用户（软删除）
   */
  async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await User.findByPk(id)
      if (!user) {
        throw new UserError('用户不存在', 'USER_NOT_FOUND')
      }
      await user.destroy()
      return true
    } catch (error) {
      if (error instanceof UserError) {
        throw error
      }
      throw new DatabaseError('删除用户失败', 'DELETE_USER_ERROR')
    }
  }

  /**
   * 批量删除用户
   */
  async deleteUsers(ids: number[]): Promise<number> {
    try {
      const result = await User.destroy({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      })
      return result
    } catch (error) {
      throw new DatabaseError('批量删除用户失败', 'BATCH_DELETE_USERS_ERROR')
    }
  }
}

export default new DatabaseService()
export { DatabaseError, UserError }