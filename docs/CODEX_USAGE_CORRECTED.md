# CRS 插件 - Codex 使用说明

## ⚠️ 重要限制

**Codex 不支持 `/req` 等命令！**

Codex插件架构与Claude Code不同：
- ❌ **不支持**：`commands/` 目录、`/req` 命令
- ✅ **支持**：`skills/` 系统、自然语言对话

## 🎯 Codex 正确使用方式

### 方式1：使用 req skill（推荐，最完整）

**完整5阶段工作流**：
```
使用 req skill 创建一个新功能需求：添加用户登录功能
```

**指定模式**：
```
使用 req skill 的深度模式分析用户认证架构
使用 req skill 的快速模式修复登录bug
```

**查询需求**：
```
使用 req skill 查看所有需求列表
使用 req skill 显示需求仪表板
使用 req skill 查看活跃需求
```

### 方式2：直接描述需求（简单）

```
创建需求：添加用户登录功能
```

```
报告Bug：登录页面崩溃
```

```
查看所有需求
```

### 方式2：明确指定Skill

```
使用 req-manager skill 处理用户登录需求
```

```
使用 req-brainstorm skill 深度分析认证架构
```

```
使用 req-priority skill 评估需求优先级
```

### 方式3：多步骤流程

```
1. 使用 req-init 初始化需求系统
2. 使用 req-brainstorm 分析需求
3. 使用 req-priority 评估优先级
4. 使用 req-quality 质量检查
```

## 📋 可用Skills列表

### 核心Skills
- `req` - **需求管理命令系统**（完整5阶段工作流，替代Claude Code的`/req`命令）
- `req-manager` - 需求管理统一入口
- `req-init` - 项目初始化
- `req-brainstorm` - 深度需求分析

### 分析Skills
- `req-priority` - 优先级评估
- `req-metrics` - 度量分析

### 质量Skills
- `req-quality` - 质量门禁检查
- `req-test-plan` - 测试计划生成
- `req-verify` - 验证检查清单

### 文档Skills
- `req-unify` - 文档格式统一
- `req-migrate` - 文档迁移

### 变更Skills
- `req-change` - 需求变更处理

## 💡 使用建议

### 最佳实践

**简单需求：**
```
帮我创建一个用户登录功能的需求
```

**复杂分析：**
```
使用 req-brainstorm 深度分析用户认证架构的设计方案
```

**明确操作：**
```
使用 req-priority 重新评估 FEAT-001 的优先级
```

### 与Claude Code的差异

| 特性 | Claude Code | Codex |
|------|-------------|-------|
| 命令系统 | ✅ `/req` | ✅ `req skill`（功能等效） |
| Skills系统 | ✅ 支持 | ✅ 支持 |
| 调用方式 | 命令式 | 对话式 |
| Hooks | ✅ | ✅ |
| 5阶段工作流 | ✅ | ✅ |

## 🔍 快速验证

在Codex中测试：

**测试1：使用 req skill（推荐）**
```
使用 req skill 创建需求：实现用户头像上传
```

**测试2：深度分析**
```
使用 req skill 的深度模式分析用户登录功能
```

**测试3：查询需求**
```
使用 req skill 显示需求仪表板
```

**测试4：质量检查**
```
使用 req-quality 检查 FEAT-001 的质量
```

## 🚫 不要这样做

❌ `/req 添加功能` - Codex不识别斜杠命令
❌ `/req:brainstorm` - 命令格式不支持

## ✅ 推荐做法

✅ "使用 req skill 创建需求：添加用户登录" - 完整工作流
✅ "使用 req-brainstorm 分析" - 明确指定skill
✅ "使用 req-manager 处理需求" - 智能路由
✅ "CRS插件，帮我..." - 让AI自动选择合适skill

## 📊 技术原因

Codex的设计哲学：
- **对话优先**：通过自然语言交互，而非命令
- **AI驱动**：AI根据上下文选择合适的skill
- **简化学习**：用户不需要记忆命令语法

这与Claude Code的命令式设计不同，是架构选择，非功能缺失。
