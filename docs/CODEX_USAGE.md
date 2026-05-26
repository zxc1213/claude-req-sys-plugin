# CRS 插件双平台使用指南

## Claude Code 使用方式

### 基本命令

```bash
# 创建新需求
/req 添加用户登录功能

# 快速创建
/req --quick 修复登录样式

# Bug报告
/req --bug 登录页面崩溃

# 查看仪表板
/req --dashboard
```

### 可用命令

- `/req` - 需求管理主入口
- `/req:brainstorm` - 深度需求分析
- `/req:priority` - 优先级评估
- `/req:quality` - 质量检查
- `/req:test-plan` - 测试计划
- `/req:init` - 项目初始化
- `/req:change` - 需求变更

## Codex 使用方式

### 核心差异

Codex **不使用**斜杠命令（`/req`），而是通过**自然语言对话**来触发插件功能。

### 使用方法

**方式1：直接描述需求（推荐）**

```
我想使用CRS插件创建一个新需求：添加用户登录功能
```

或者更简单：
```
创建需求：实现用户登录功能
```

**方式2：明确指定skill**

```
请使用 req-manager skill 来处理用户登录功能需求
```

**方式3：分步骤执行**

```
1. 首先使用 req-init 初始化需求系统
2. 然后使用 req-brainstorm 分析用户登录功能
3. 最后使用 req-priority 评估优先级
```

### 插件状态确认

插件已正确安装和启用：
- ✅ 插件名称：`claude-req-sys-plugin@crs`
- ✅ 状态：enabled
- ✅ Hooks：已配置并受信任

### 快速测试

在Codex中尝试以下对话：

**测试1：创建需求**
```
使用CRS插件帮我创建一个需求：添加用户头像上传功能
```

**测试2：查看需求**
```
使用CRS插件查看所有需求列表
```

**测试3：分析需求**
```
使用 req-brainstorm skill 深度分析用户认证需求
```

## 技术说明

### Claude Code
- 使用 `/` 开头的命令系统
- commands/ 目录中的 `.md` 文件定义命令
- 自动集成到命令补全系统

### Codex
- 使用 skills 系统
- skills/ 目录中的 `SKILL.md` 文件定义技能
- 通过自然语言对话触发
- AI自动选择合适的skill

### 共享组件
- ✅ Skills：两边共享相同的skills定义
- ✅ Hooks：自动化hooks在两边都工作
- ✅ 核心逻辑：处理逻辑完全一致

## 常见问题

### Q: 为什么Codex中 `/req` 不工作？
A: Codex使用不同的命令系统。使用自然语言描述需求即可。

### Q: 如何确认插件在Codex中正常工作？
A: 检查插件状态：
```bash
codex plugin list | findstr "claude-req-sys-plugin"
```

### Q: 两边的功能完全一样吗？
A: 核心功能完全一致，只是调用方式不同：
- Claude Code：命令式（`/req`）
- Codex：对话式（自然语言）

## 最佳实践

### Claude Code
适合：日常开发、快速操作、熟悉命令行
```bash
/req 添加XXX功能
/req --dashboard
```

### Codex
适合：复杂分析、深度思考、需要AI协助
```
我想深入分析一下用户认证架构的设计方案
使用 req-brainstorm 进行全面分析
```

### 跨平台工作流
1. 在Codex中深度分析和规划
2. 在Claude Code中快速执行和跟踪
3. 两边数据完全同步（`.requirements/` 目录）
