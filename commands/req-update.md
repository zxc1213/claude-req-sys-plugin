---
description: 更新 ClaudeReqSys 到最新版本 - 拉取代码并重新链接技能
---

# 需求管理系统更新命令

更新 ClaudeReqSys 到最新版本，包括代码更新和技能文件重新链接。

## 用法

```bash
/req:update
```

## 命令行为

当用户执行此命令时，系统将自动：

### 1. 检查 Git 仓库

- 验证当前目录是否在 git 仓库中
- 获取仓库根目录路径

### 2. 拉取最新代码

```bash
git pull
```

### 3. 重新链接技能文件

运行技能链接脚本：

```bash
bash scripts/link-skills.sh
```

此脚本会：

- 删除旧的技能符号链接
- 创建新的技能符号链接
- 确保所有技能文件正确链接

## 输出示例

```markdown
🔄 ClaudeReqSys 更新

📥 拉取最新代码...
Already up to date.

🔗 重新链接技能文件...
✓ req-analysis.md
✓ req-brainstorm.md
✓ req-design.md
✓ req-quality.md
✓ req-priority.md
✓ req-test-plan.md
✓ req-unify.md

✅ 更新完成!

ClaudeReqSys 已更新到最新版本
```

## 错误处理

如果更新失败，系统将显示：

```markdown
❌ 更新失败: <错误信息>
```

常见错误：

- **不在 git 仓库中**: 请在 ClaudeReqSys 项目目录中运行
- **网络问题**: 检查网络连接
- **权限问题**: 确保有执行脚本的权限
- **合并冲突**: 需要手动解决冲突后再次运行

## 重要说明

**DO:**

- ✅ 定期运行此命令以获取最新功能和修复
- ✅ 在运行前提交本地更改
- ✅ 检查更新日志了解新功能

**DON'T:**

- ❌ 在有未提交更改时运行（可能导致冲突）
- ❌ 在非项目目录中运行
- ❌ 忽略更新失败错误

## 技术实现

此命令调用以下脚本：

- **主脚本**: `bin/claude-req-update.js`
- **Git 操作**: 使用 `execSync` 执行 `git pull`
- **技能链接**: 调用 `scripts/link-skills.sh`

## 相关命令

- `/req` - 创建和管理需求
- `/req:init` - 初始化项目
- `/metrics` - 查看项目度量

## 版本历史

v0.6.0 - 初始版本

- ✅ Git 代码更新
- ✅ 技能文件自动重新链接
- ✅ 错误处理和提示
