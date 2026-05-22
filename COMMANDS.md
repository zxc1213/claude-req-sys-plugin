# ClaudeReqSys 命令系统说明

## 🎯 设计原则

ClaudeReqSys 采用**双重使用机制**：

- ✅ **自动流程**: Skills 之间自动调用，无需手动干预
- ✅ **手动命令**: 通过 `/req:*` 命令随时手动执行

## 📋 完整命令列表

### 核心命令

- `/req` - 需求管理主入口
- `/req:manager` - 智能路由器

### 分析命令

- `/req:brainstorm` - 深度需求分析
- `/req:priority` - 优先级评估

### 质量命令

- `/req:quality` - 质量门禁检查
- `/req:verify` - 验证检查清单
- `/req:test-plan` - 测试计划生成

### 文档命令

- `/req:unify` - 文档格式统一
- `/req:migrate` - 文档迁移

### 管理命令

- `/req:change` - 需求变更处理
- `/req:metrics` - 度量系统
- `/req:init` - 项目初始化
- `/req:update` - 系统更新

## 🔄 自动流程保障

### 不受影响的原因

1. **Commands 调用 Skills**
   - 命令文件只是手动接口
   - 底层仍然调用对应的 Skills
   - Skills 之间的自动调用链保持不变

2. **Skills 独立存在**
   - `skills/` 目录中的 Skills 文件保持不变
   - Skills 之间的引用通过 skill 名称，不依赖命令文件
   - 自动触发逻辑硬编码在 Skills 中

3. **双重入口设计**
   - 自动: Skill A → Skill B（直接调用）
   - 手动: `/req:b` → Skill B（命令调用）

### 示例：需求创建流程

#### 自动流程（原有）

```
用户输入 → /req 命令 → req-manager skill
  → req-brainstorm skill
  → req-priority skill
  → req-quality skill
```

#### 手动流程（新增）

```
用户手动执行 /req:brainstorm REQ-001
  → req-brainstorm skill
```

#### 两者可以并存

```
自动: /req 创建需求时自动调用 req-brainstorm
手动: 用户可随时执行 /req:brainstorm 重新分析
```

## ✅ 使用建议

### 正常工作流（推荐）

使用 `/req` 主命令，系统自动处理整个流程：

```bash
/req 添加用户登录功能
```

### 手动干预场景

需要手动执行特定操作时：

```bash
# 重新评估优先级
/req:priority REQ-20260514-001

# 手动质量检查
/req:quality REQ-20260514-001 --gate 2

# 生成测试计划
/req:test-plan REQ-20260514-001
```

## 🔧 技术实现

### 命令如何调用 Skills

每个命令文件包含：

1. 命令描述和用法
2. 调用对应的 Skill
3. 处理用户输入
4. 返回结果

### Skill 保持独立

Skills 之间的自动调用通过 skill 名称：

```javascript
// 在 req-quality skill 中
call('req-priority', { reqId: 'REQ-001' });
```

这种调用方式不依赖命令文件，因此自动流程不受影响。

## 📊 兼容性矩阵

| 操作       | 自动触发 | 手动命令 | 说明                 |
| ---------- | -------- | -------- | -------------------- |
| 创建需求   | ✅       | -        | 通过 /req 自动       |
| 深度分析   | ✅       | ✅       | 可手动重新分析       |
| 优先级评估 | ✅       | ✅       | 可手动重新评估       |
| 质量检查   | ✅       | ✅       | 可手动重新检查       |
| 测试计划   | ✅       | ✅       | 可手动重新生成       |
| 变更处理   | ✅       | ✅       | 执行中自动，也可手动 |
| 文档统一   | -        | ✅       | 仅手动               |
| 文档迁移   | -        | ✅       | 仅手动               |
| 度量查看   | ✅       | ✅       | 随时查看             |
| 项目初始化 | -        | ✅       | 仅手动               |
| 系统更新   | -        | ✅       | 仅手动               |

## ⚠️ 重要说明

**DO:**

- ✅ 正常工作流使用 `/req` 主命令
- ✅ 需要时手动执行特定命令
- ✅ 手动命令会覆盖自动结果
- ✅ 查看命令文档了解用法

**DON'T:**

- ❌ 担心手动命令会影响自动流程
- ❌ 在自动流程中混用手动命令（除非需要干预）
- ❌ 删除或修改 Skills 文件

## 🔍 验证方法

### 验证自动流程

```bash
# 创建一个测试需求，验证自动流程
/req 测试自动流程

# 检查是否自动调用了各个 skill
```

### 验证手动命令

```bash
# 手动执行各个命令
/req:brainstorm REQ-XXX
/req:priority REQ-XXX
/req:quality REQ-XXX --gate 1
```

## 📝 更新记录

v0.6.0 - 完整命令系统

- 新增 12 个 /req:\* 命令
- 保持自动流程不变
- 实现双重使用机制
