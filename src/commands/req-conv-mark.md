# /req-conv:mark

标记对话记录（添加标签、状态、摘要或评分）。

## 用法

```
/req-conv:mark <对话ID> [选项]
```

## 选项

| 简写 | 完整        | 描述                                  |
| ---- | ----------- | ------------------------------------- |
| `-t` | `--tags`    | 添加标签（逗号分隔，自动添加 # 前缀） |
| `-s` | `--status`  | 设置状态：active、archived、important |
| `-m` | `--summary` | 设置摘要                              |
|      | `--rating`  | 设置评分（1-5）                       |

## 示例

```bash
# 添加标签
/req-conv:mark 20260522-001 --tags bug,frontend
/req-conv:mark 20260522-001 -t "#feature,#api"

# 设置状态
/req-conv:mark 20260522-001 --status archived
/req-conv:mark 20260522-001 -s important

# 设置摘要
/req-conv:mark 20260522-001 --summary "实现了用户登录功能"

# 设置评分
/req-conv:mark 20260522-001 --rating 5

# 组合使用
/req-conv:mark 20260522-001 -t "#bug" -s important -m "修复了登录超时问题" --rating 4
```

## 状态说明

| 状态      | 说明             |
| --------- | ---------------- |
| active    | 活跃对话（默认） |
| archived  | 已归档           |
| important | 重要对话         |

## 评分系统

- ⭐ 1 星：需要改进
- ⭐⭐ 2 星：一般
- ⭐⭐⭐ 3 星：良好
- ⭐⭐⭐⭐ 4 星：优秀
- ⭐⭐⭐⭐⭐ 5 星：完美

## 相关命令

- `/req-conv:list` - 列出所有对话
- `/req-conv:view` - 查看对话详情
- `/req-conv:search` - 搜索对话
