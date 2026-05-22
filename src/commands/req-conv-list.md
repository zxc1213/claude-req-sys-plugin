# /req-conv:list

列出所有对话记录。

## 用法

```
/req-conv:list [选项]
```

## 选项

| 简写 | 完整       | 默认值 | 描述                            |
| ---- | ---------- | ------ | ------------------------------- |
| `-l` | `--limit`  | 20     | 返回的最大记录数                |
| `-f` | `--format` | table  | 输出格式：table、json、markdown |

## 示例

```bash
# 列出最近 20 条对话（表格格式）
/req-conv:list

# 列出最近 50 条对话
/req-conv:list --limit 50

# JSON 格式输出
/req-conv:list --format json

# Markdown 格式输出
/req-conv:list -f markdown
```

## 相关命令

- `/req-conv:search` - 搜索对话记录
- `/req-conv:view` - 查看对话详情
- `/req-conv:stats` - 查看统计信息
