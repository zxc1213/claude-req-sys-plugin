# /req-conv:search

使用 Fuse.js 模糊搜索查找对话记录。

## 用法

```
/req-conv:search <关键词> [选项]
```

## 选项

| 简写 | 完整          | 默认值 | 描述                            |
| ---- | ------------- | ------ | ------------------------------- |
| `-l` | `--limit`     | 10     | 返回的最大结果数                |
| `-t` | `--threshold` | 0.3    | 匹配阈值（0-1，越小越精确）     |
| `-f` | `--format`    | table  | 输出格式：table、json、markdown |
|      | `--date-from` |        | 开始日期过滤                    |
|      | `--date-to`   |        | 结束日期过滤                    |
|      | `--tags`      |        | 标签过滤（逗号分隔）            |
|      | `--status`    |        | 状态过滤（active/archived）     |

## 示例

```bash
# 搜索包含"登录"的对话
/req-conv:search 登录

# 搜索包含"API"的对话，返回前20条
/req-conv:search API --limit 20

# 搜索并使用更精确的匹配
/req-conv:search 数据库 --threshold 0.2

# 搜索特定日期范围
/req-conv:search 部署 --date-from 2026-05-01 --date-to 2026-05-31

# 搜索带特定标签的对话
/req-conv:search bug --tags bug,frontend

# JSON 格式输出
/req-conv:search 重构 --format json
```

## 搜索原理

使用 Fuse.js 模糊搜索引擎：

- **消息内容**: 权重 50%
- **标签**: 权重 30%
- **摘要**: 权重 20%

相关性评分：100% = 完全匹配，0% = 不相关

## 相关命令

- `/req-conv:list` - 列出所有对话
- `/req-conv:view` - 查看对话详情
- `/req-conv:mark` - 标记对话
