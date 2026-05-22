---
name: req-init
description: ClaudeReqSys 初始化配置 - 一次性设置，配置问题追踪系统、标签体系和文档存储位置
---

# ClaudeReqSys 初始化配置

欢迎使用 ClaudeReqSys 智能需求管理系统！

本技能将引导你完成一次性初始化配置，确保系统与你的工作流程完美集成。

## 配置步骤

### 1. 问题追踪系统选择

请选择你使用的问题追踪系统：

**选项 A：GitHub Issues**

- 适合：开源项目、团队协作项目
- 需要：GitHub 仓库、Personal Access Token

**选项 B：本地文件系统**

- 适合：个人项目、快速原型、本地开发
- 优点：无需外部依赖，完全本地化

**选项 C：Linear**

- 适合：使用 Linear 的专业团队
- 需要：Linear API Key

> 请告诉我你的选择，我会相应配置系统。

### 2. 需求标签体系

配置需求分类标签，用于 `/triage` 和优先级排序：

**推荐标签**：

- `feature` - 新功能
- `bug` - 缺陷修复
- `enhancement` - 功能增强
- `refactor` - 代码重构
- `docs` - 文档更新
- `test` - 测试相关
- `performance` - 性能优化

**优先级标签**（可选）：

- `priority:critical` - 紧急重要
- `priority:high` - 重要不紧急
- `priority:medium` - 一般
- `priority:low` - 可选

> 你可以使用推荐标签，或自定义你的标签体系。

### 3. 文档存储位置

配置项目文档的存储路径：

**默认配置**：

- 需求规格：`.requirements/features/`
- 缺陷跟踪：`.requirements/bugs/`
- 问题记录：`.requirements/questions/`
- 需求变更：`.requirements/adjustments/`
- 分析报告：`docs/analysis/`
- 用户指南：`docs/guides/`

> 你可以接受默认配置，或指定自定义路径。

### 4. 自动化 Hooks（可选）

配置自动化功能，需要在每次会话结束后自动：

- **需求记录更新**：跟踪需求变更历史
- **执行总结生成**：生成工作总结报告
- **度量数据收集**：更新项目指标

> 这些功能需要在 `.claude/settings.json` 中配置 hooks。

## 配置完成

完成配置后，系统将：

1. ✅ 创建必要的目录结构
2. ✅ 生成配置文件（如需要）
3. ✅ 链接所有技能到 `.claude/skills/`
4. ✅ 初始化度量系统

## 开始使用

配置完成后，你可以：

- `/req` - 添加你的第一个需求
- `/priority --list` - 查看优先级排序
- `/metrics` - 查看项目指标
- `/req --dashboard` - 查看仪表板

## 需要帮助？

- 用户指南：`docs/guides/user-guide.md`
- 系统架构：`docs/analysis/optimization-report.md`
