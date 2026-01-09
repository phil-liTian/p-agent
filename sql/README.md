# SQL 脚本目录

此目录包含项目的数据库表创建脚本和迁移脚本。

## 文件说明

- `create-user-table.sql` - 创建用户表的SQL脚本

## 使用方法

### 手动执行
```bash
mysql -u your_username -p your_database_name < sql/create-user-table.sql
```

### 在应用启动时自动执行
可以在应用启动时检查表是否存在，如果不存在则自动执行创建脚本。

## 注意事项

- 所有SQL脚本都使用InnoDB引擎和utf8mb4字符集
- 时间戳字段使用datetime类型，支持自动更新
- 软删除通过deleted_at字段实现
- 所有表都包含created_at和updated_at字段