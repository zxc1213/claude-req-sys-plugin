# 需求管理系统 - 用户指南

**版本**: v0.6.0  
**更新日期**: 2026-05-13

---

## 目录

- [快速开始](#快速开始)
- [基本概念](#基本概念)
- [核心功能](#核心功能)
- [工作流程](#工作流程)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)

---

## 快速开始

### 安装

详细的安装说明请参考 [安装指南](../../INSTALL.md)。

**快速安装**：

```bash
# npm 全局安装（推荐）
npm install -g github:zxc1213/claude-req-sys

# 克隆安装
git clone https://github.com/zxc1213/claude-req-sys.git claude-req-sys
cd claude-req-sys
npm install -g .
```

### 创建第一个需求

```bash
# 智能推断（推荐）
/req 添加用户登录功能

# 系统会自动：
# 1. 智能意图识别（创建新功能）
# 2. 深度需求分析（req-brainstorm）
# 3. 优先级评估（req-priority）
# 4. 质量检查（req-quality）
# 5. 生成统一文档（spec.md）
```

---

## 基本概念

### 需求类型

系统支持五种需求类型：

| 类型         | 前缀   | 说明       | 自动推断关键词           |
| ------------ | ------ | ---------- | ------------------------ |
| **新功能**   | `REQ-` | 新功能开发 | "添加"、"实现"、"新增"   |
| **Bug 修复** | `BUG-` | Bug 修复   | "修复"、"bug"、"错误"    |
| **技术问题** | `QST-` | 技术咨询   | "如何"、"怎么"、"为什么" |
| **需求调整** | `ADJ-` | 需求变更   | "修改"、"调整"、"改变"   |
| **重构**     | `REF-` | 代码重构   | "重构"、"优化"、"改进"   |

### 需求状态

| 状态          | 说明   |
| ------------- | ------ |
| `pending`     | 待处理 |
| `planning`    | 规划中 |
| `designing`   | 设计中 |
| `in_progress` | 进行中 |
| `testing`     | 测试中 |
| `completed`   | 已完成 |

### 优先级等级

| 等级   | 分数范围 | 说明     | 响应时间 |
| ------ | -------- | -------- | -------- |
| **P0** | 90-100   | 立即处理 | 立即     |
| **P1** | 75-89    | 高优先级 | 24小时内 |
| **P2** | 60-74    | 中优先级 | 本周内   |
| **P3** | 45-59    | 低优先级 | 有空时   |
| **P4** | 0-44     | 可选     | 暂不处理 |

### 执行模式

| 模式          | 说明     | 适用场景             |
| ------------- | -------- | -------------------- |
| **quick**     | 快速通道 | 简单需求（<5分钟）   |
| **deep**      | 深度分析 | 复杂需求（完整流程） |
| **semi_auto** | 半自动   | 默认模式             |

---

## 核心功能

### 1. 统一入口（req-manager）

**功能**：智能路由到最优处理流程

**使用方式**：

```bash
/req 添加用户登录功能          # 自动推断为 feature + deep
/req 修复登录bug              # 自动推断为 bug + quick
/req 如何实现OAuth?           # 自动推断为 question + semi_auto
```

**智能推断规则**：

- 关键词识别 → 需求类型
- 复杂度分析 → 执行模式
- 上下文感知 → 处理流程

### 2. 优先级评估（req-priority）

**功能**：5维度科学评估优先级

**评估维度**：

- 业务价值（40%）：对业务的贡献程度
- 紧急程度（30%）：时间敏感性
- 依赖关系（15%）：前置依赖影响
- 实现成本（10%）：工作量和技术难度
- 风险评估（5%）：技术风险和不确定性

**使用方式**：

```bash
# 查看优先级排序
/req:priority --list

# 评估单个需求
/req:priority REQ-20260513-001

# 比较两个需求
/req:priority --compare REQ-001 REQ-002
```

### 3. 质量门禁（req-quality）

**功能**：4个关键阶段自动检查

**检查点**：

- **Gate 1**: 设计完成（无占位符、无矛盾、决策理由完整）
- **Gate 2**: 测试策略完成（测试类型覆盖、关键路径测试）
- **Gate 3**: 实施计划完成（任务可执行、依赖清晰）
- **Gate 4**: 变更完成（影响评估、文档更新）

**使用方式**：

```bash
# 检查特定门禁
/req:quality REQ-20260513-001 --gate 1

# 检查所有门禁
/req:quality REQ-20260513-001

# 验证检查
/req:verify REQ-20260513-001
```

### 4. 文档统一（req-unify）

**功能**：5个文件简化为2个文件

**优化**：

- **旧格式**（5个文件）：design.md, test-plan.md, plan.md, analysis-report.md, CHANGELOG.md
- **新格式**（2个文件）：
  - `spec.md` - 统一主文档
  - `test-cases.md` - 可选详细用例

**优势**：

- 维护成本降低 70%
- 消除信息冗余
- 单一信息源

**使用方式**：

```bash
# 统一现有需求
/req-unify REQ-20260513-001

# 批量统一
/req-unify --all
```

### 5. 文档迁移（req-migrate）

**功能**：将旧格式迁移到新格式

**使用方式**：

```bash
# 单个需求迁移
/req-migrate REQ-20260513-001

# 批量迁移
/req-migrate --all

# 预览迁移
/req-migrate REQ-20260513-001 --dry-run

# 交互式迁移
/req-migrate --all --interactive

# 查看迁移状态
/req-migrate --status
```

**安全特性**：

- 自动备份
- 验证检查
- 回滚机制
- 交互确认

### 6. 验证检查清单（req-verify）

**功能**：20+验证项确保质量

**检查点**：

- **Checkpoint 1**: 设计验证（技术可行性、架构完整性、安全风险）
- **Checkpoint 2**: 实现验证（代码质量、测试覆盖、性能验证）
- **Checkpoint 3**: 部署验证（部署准备、上线验证）

**使用方式**：

```bash
# 设计验证
/req-verify --design REQ-20260513-001

# 实现验证
/req-verify --implementation REQ-20260513-001

# 部署验证
/req-verify --deployment REQ-20260513-001

# 全部验证
/req-verify --all REQ-20260513-001
```

### 7. 度量体系（metrics）

**功能**：4维度16指标，持续优化

**度量维度**：

- **效率**：交付周期、创建时间、实现时间、流程效率
- **质量**：返工率、质量门禁通过率、Bug密度、验证通过率
- **变更**：变更频率、重大变更占比、变更响应时间、影响评估准确率
- **价值**：完成率、优先级准确率、ROI达成率、用户满意度

**使用方式**：

```bash
# 查看所有指标
/req-metrics

# 查看特定维度
/req-metrics --efficiency
/req-metrics --quality
/req-metrics --changes
/req-metrics --value

# 查看趋势
/req-metrics --trend cycle_time
/req-metrics --trend rework_rate

# 生成报告
/req-metrics --report week
/req-metrics --report month

# 导出数据
/req-metrics --export json
/req-metrics --export csv
/req-metrics --export markdown

# 手动收集数据
/req-metrics --collect
```

---

## 工作流程

### 标准工作流（v0.3.0）

```
1. 创建需求
   /req 添加用户头像上传功能
   ↓
   [req-manager] 智能意图识别
   ↓
   [req-brainstorm] 深度需求分析
   ├─ 问题探索（Brainstorming）
   ├─ 方案审查（Grill-me）
   ├─ 设计展示
   └─ 最终审查
   ↓
   [req-priority] 优先级评估
   ├─ 5维度评估
   ├─ ROI 计算
   └─ 优先级等级（P0-P4）
   ↓
   [req-quality Gate 1] 设计质量检查
   ├─ 矛盾检测
   ├─ 决策完整性检查
   └─ 架构完整性检查
   ↓
   [req-test-plan] 生成测试策略
   ↓
   [req-quality Gate 2] 测试质量检查
   ↓
   [writing-plans] 生成实施计划
   ↓
   [req-quality Gate 3] 计划质量检查
   ↓
   创建需求文件
   ├─ meta.yaml（含优先级）
   ├─ spec.md（统一文档）
   └─ test-cases.md（可选）
   ↓
2. 执行计划
   [executing-plans]
   ↓
3. 处理变更（如需要）
   [用户提出变更]
   ↓
   [req-change] 变更处理
   ├─ 变更分类
   ├─ 影响评估
   └─ 调整执行
   ↓
   [req-quality Gate 4] 变更质量检查
   ↓
4. 完成开发
   [finishing-a-development-branch]
```

### 执行中变更处理

**原则**：

- 小调整：直接执行并记录
- 中等变更：Grill-me 快速审查
- 重大变更：完整 req-brainstorm

**示例**：

```bash
# 场景1：文案修改
用户: "把'登录'改成'登录系统'"
AI: [直接修改] ✓ 已记录到 CHANGELOG.md

# 场景2：添加功能点
用户: "再加一个忘记密码功能"
AI: [暂停] [Grill-me快速审查] [调整计划] [继续执行]

# 场景3：架构变更
用户: "我想要实时协作而不是表单"
AI: [暂停] [完整req-brainstorm] [创建新需求] [重新规划]
```

---

## 使用示例

### 示例1：创建新功能

```bash
# 1. 创建需求（智能推断）
/req 添加用户评论功能

# 系统响应：
# ✓ 意图识别：创建新功能
# ✓ 类型推断：feature
# ✓ 模式选择：deep（复杂需求）
#
# [启动 req-brainstorm]
# - 问题探索：用户评论的典型场景
# - 方案审查：存储方案、审核机制
# - 设计展示：评论组件设计
# - 最终审查：确认设计方案
#
# [启动 req-priority]
# - 业务价值：85/100（高）
# - 紧急程度：70/100（中）
# - 依赖关系：无
# - 实现成本：中等
# - 风险评估：低风险
# ✓ 优先级：P1（75分）
#
# [启动 req-quality Gate 1]
# ✓ 设计质量检查通过
#
# [启动 req-test-plan]
# ✓ 测试策略已生成
#
# [启动 req-quality Gate 2]
# ✓ 测试质量检查通过
#
# [启动 writing-plans]
# ✓ 实施计划已生成
#
# [启动 req-quality Gate 3]
# ✓ 计划质量检查通过
#
# ✓ 需求已创建：.requirements/features/REQ-20260513-001/
#   - meta.yaml（含优先级 P1）
#   - spec.md（统一文档）
#   - test-cases.md（详细用例）
```

### 示例2：查看优先级排序

```bash
/req:priority --list

# 系统响应：
# 📊 优先级排序报告
#
# P0（立即处理）：
#   • REQ-20260513-001: 支付功能异常 (95分)
#     - 业务价值: 95 (紧急)
#     - 紧急程度: 95 (影响收入)
#     - ROI: 9.5
#
# P1（高优先级）：
#   • REQ-20260513-002: 用户评论功能 (75分)
#   • REQ-20260513-003: 数据导出功能 (78分)
#
# P2（中优先级）：
#   • REQ-20260513-004: 界面优化 (65分)
#
# 建议：
# - 优先处理 P0 的支付功能异常
# - P1 的两个需求可以并行开发
# - P2 的界面优化可以安排到下周
```

### 示例3：质量检查

```bash
/req:quality check-all REQ-20260513-001

# 系统响应：
# 📋 质量检查报告 - REQ-20260513-001
#
# ✅ Gate 1: 设计完成
#   - 无占位符 ✓
#   - 无矛盾 ✓
#   - 决策理由完整 ✓
#   - 架构完整 ✓
#
# ✅ Gate 2: 测试策略完成
#   - 测试类型覆盖: 5种 ✓
#   - 关键路径测试: ✓
#   - 性能指标定义: ✓
#   - 安全测试计划: ✓
#
# ✅ Gate 3: 实施计划完成
#   - 任务可执行: ✓
#   - 依赖清晰: ✓
#   - 时间估算合理: ✓
#   - 风险预案: ✓
#
# 📊 总体评估
# - 通过率: 100% (12/12)
# - 状态: ✅ 全部通过
# - 建议：可以开始实施
```

### 示例4：查看度量指标

```bash
/req-metrics --efficiency

# 系统响应：
# 📊 效率指标
#
# 需求交付周期: 2.3天 ⬇️ 30% (目标: 2.0天)
# 平均创建时间: 8.5分钟 ⬇️ 40%
# 平均实现时间: 1.8天 ⬇️ 25%
# 流程效率: 88% ⬆️ 15%
#
# 趋势：
# Week 1:  ████████████████████ 3.3天
# Week 2:  ██████████████████ 2.8天
# Week 3:  █████████████████ 2.3天
# 目标:   ████████ 2.0天
#
# 建议：
# - 交付周期持续改善，已接近目标
# - 保持当前流程，继续优化
```

### 示例5：迁移旧文档

```bash
/req-migrate REQ-20260507-001

# 系统响应：
# 📦 开始迁移：REQ-20260507-001
#
# ✓ 检查需求目录
# ✓ 创建备份: .backup/before-migration-2026-05-13-11-30-00
#
# 找到 5 个文件:
#   - design.md
#   - test-plan.md
#   - plan.md
#   - analysis-report.md
#   - CHANGELOG.md
#
# ✓ 提取内容
# ✓ 生成 spec.md
# ✓ 生成 test-cases.md
#
# ✓ 验证文档完整性
#   - 所有必需章节存在 ✓
#   - 元数据完整 ✓
#
# ✓ 迁移完成！
#
# 旧文件保留在: .backup/before-migration-2026-05-13-11-30-00
# 是否删除旧文件？(y/n): _
```

---

## 最佳实践

### 需求描述

**好的描述**：

```bash
# 清晰、完整、有上下文
/req 实现基于邮箱和密码的用户登录功能，
支持记住我状态和密码重置，
需要符合安全最佳实践
```

**不好的描述**：

```bash
# 太简单、缺少上下文
/req 登录
```

### 优先级管理

1. **优先处理 P0 需求**
   - 影响收入的紧急问题
   - 安全漏洞
   - 数据丢失风险

2. **合理规划 P1-P2 需求**
   - 按业务价值排序
   - 考虑依赖关系
   - 平衡资源分配

3. **P3-P4 需求暂缓**
   - 有价值但不紧急
   - 等待合适时机

### 质量控制

1. **严格执行质量门禁**
   - 不跳过任何检查点
   - 修复所有问题后再继续
   - 重大问题需要例外申请

2. **使用验证检查清单**
   - 设计完成后验证
   - 实现完成后验证
   - 部署前验证

3. **定期查看度量指标**
   - 每周查看周报
   - 每月查看月报
   - 及时发现异常

### 文档管理

1. **新需求使用新格式**
   - 自动生成 spec.md
   - 按需生成 test-cases.md

2. **逐步迁移旧需求**
   - 活跃需求优先迁移
   - 历史需求归档时迁移
   - 始终保留备份

3. **保持文档更新**
   - 变更后及时更新 CHANGELOG.md
   - 重新通过质量门禁

### 团队协作

1. **使用统一入口**
   - 让团队成员使用 `/req` 命令
   - 系统自动推断最优流程

2. **共享度量报告**
   - 定期分享周报/月报
   - 基于数据做决策

3. **遵循最佳实践**
   - 清晰的需求描述
   - 及时更新状态
   - 完成后总结经验

---

## 故障排除

### 常见问题

#### Q: 需求创建失败？

**A**: 检查以下几点：

- 是否包含敏感信息
- 描述是否清晰
- 文件系统权限是否正常
- 磁盘空间是否充足

#### Q: 质量门禁不通过？

**A**: 根据检查报告修复：

- 查看具体失败项
- 修复相关问题
- 重新运行检查

#### Q: 优先级评估不合理？

**A**: 可以手动调整：

- 编辑 meta.yaml 中的 priority 字段
- 重新评估业务价值或紧急程度
- 记录调整原因

#### Q: 文档迁移失败？

**A**: 检查以下几点：

- 旧文件是否存在
- 文件格式是否正确
- 使用 `--dry-run` 预览
- 查看备份目录

#### Q: 度量数据不准确？

**A**: 检查数据收集：

- 运行 `/req-metrics --collect` 手动收集
- 检查 .requirements/req-metrics/data.yaml
- 确认需求元数据完整

### 错误码

| 错误码                      | 说明         | 解决方案             |
| --------------------------- | ------------ | -------------------- |
| `security_check_failed`     | 敏感信息检测 | 移除敏感信息后重试   |
| `similar_requirement_found` | 发现相似需求 | 确认是否继续         |
| `quality_gate_failed`       | 质量检查失败 | 修复问题后重试       |
| `migration_failed`          | 文档迁移失败 | 检查旧文件，使用回滚 |
| `metric_collection_error`   | 数据收集失败 | 检查需求元数据       |

### 获取帮助

```bash
# 查看命令帮助
/req --help
/req:priority --help
/req:quality --help
/req-metrics --help
/req-migrate --help

# 查看系统状态
/req --dashboard

# 运行系统诊断
/req --evaluate
```

---

## 附录

### 目录结构

```
.requirements/
├── features/           # 新功能
│   └── REQ-YYYYMMDD-XXX/
│       ├── meta.yaml
│       ├── spec.md           # 新格式：统一文档
│       ├── test-cases.md     # 新格式：详细用例（可选）
│       ├── .backup/          # 迁移备份
│       └── CHANGELOG.md
├── bugs/              # Bug 修复
├── questions/         # 技术问题
├── adjustments/       # 需求调整
├── refactorings/      # 重构任务
└── req-metrics/           # 度量数据 ⭐ 新增
    ├── config.json       # 配置文件
    ├── data.yaml         # 度量数据
    ├── reports/          # 报告目录
    ├── exports/          # 导出文件
    └── trends/           # 趋势图表
```

### 环境变量

| 变量               | 说明     | 默认值 |
| ------------------ | -------- | ------ |
| `CLAUDE_BASE_DIR`  | 基础目录 | `.`    |
| `CLAUDE_LOG_LEVEL` | 日志级别 | `info` |

### 配置文件

**`.requirements/req-metrics/config.json`**

```json
{
  "req-metrics": {
    "collection": {
      "enabled": true,
      "interval": "daily",
      "retentionDays": 90
    },
    "targets": {
      "cycle_time": 2.0,
      "rework_rate": 0.15,
      "quality_gate_pass_rate": 0.9,
      "user_satisfaction": 4.0,
      "completion_rate": 0.9
    },
    "alerts": {
      "enabled": true,
      "thresholds": {
        "cycle_time": { "warning": 2.5, "critical": 3.0 },
        "rework_rate": { "warning": 0.15, "critical": 0.2 }
      }
    },
    "reporting": {
      "frequency": "weekly",
      "autoGenerate": false,
      "includeCharts": false
    }
  }
}
```

---

**获取帮助**：运行 `/req --help` 或查看 [设计文档](../specs/2026-05-07-design.md) | [版本历史](../../README.md#版本)
