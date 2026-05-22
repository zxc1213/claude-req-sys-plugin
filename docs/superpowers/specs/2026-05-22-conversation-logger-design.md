# 对话记录功能设计文档

**需求ID**: FEAT-0001
**创建时间**: 2026-05-22
**状态**: 设计阶段
**优先级**: P1 (7.2分)

---

## 1. 需求概述

### 1.1 功能描述

新增对话记录功能，自动记录所有 Claude Code 对话过程，保存为文档备查。支持审计追踪、问题调试、文档生成和检索复用。

### 1.2 核心特性

- **混合记录模式**：默认自动记录 + 手动标记重要
- **完整记录**：保存所有消息（用户、AI、工具调用、系统提醒）
- **分层存储**：元数据（JSON）+ 内容（Markdown）
- **多维度访问**：文件系统 + CLI 命令 + 可视化界面
- **系统集成**：与现有需求管理系统无缝集成

### 1.3 技术方案

采用**方案 A：基于 Hooks 的自动记录系统**

---

## 2. 系统架构

### 2.1 整体架构

```
Claude Code 会话
    ↓
[Hook Layer] 拦截所有事件
    ├─ SessionStartHook    → 会话开始
    ├─ PostToolUseHook     → 每次工具调用后
    └─ StopHook            → 会话结束
    ↓
[Conversation Logger] 处理和格式化
    ├─ Event Capturer      → 捕获事件
    ├─ Content Formatter   → 格式化为 Markdown
    └─ Metadata Builder    → 构建元数据
    ↓
[Storage Layer] 持久化存储
    ├─ File System Writer  → 写入文件
    ├─ Index Manager       → 更新索引
    └─ Backup Manager      → 备份管理
    ↓
[Query Layer] 查询和访问
    ├─ CLI Commands        → 命令行查询
    ├─ Search Engine       → 搜索功能
    └─ Web UI (可选)       → 可视化界面
```

### 2.2 技术栈

- **运行时**: Node.js >= 18.0.0
- **存储**: 文件系统（Markdown + JSON）
- **搜索**: Fuse.js（模糊搜索）
- **Hooks**: Claude Code Hooks API
- **测试**: Mocha + Chai

---

## 3. 核心组件

### 3.1 Conversation Logger（核心记录器）

**职责**：

- 捕获所有会话事件
- 过滤和格式化内容
- 管理记录状态

**接口定义**：

```javascript
class ConversationLogger {
  startSession(sessionId, metadata)
  captureEvent(eventType, data)
  markImportant(reason)
  endSession(summary)
  getSessionId()
  getStatus()
  getEvents()
  getMetadata()
}
```

### 3.2 Content Formatter（内容格式化器）

**职责**：

- 将事件转换为 Markdown
- 生成结构化摘要
- 处理代码块和工具调用

**输出格式**：

```markdown
# 对话记录 - 2026-05-22 14:30

## 元数据

- **会话ID**: sess-20260522-143000
- **类型**: 需求创建
- **标签**: #feature #conversation-logger
- **重要**: ⭐

## 对话内容

### 用户消息

[14:30:15] 新增功能，记录对话过程...

### AI 响应

[14:30:20] 我来帮你通过头脑风暴...

### 工具调用

- [14:30:25] `Read: package.json`
- [14:30:28] `Skill: brainstorming`

## 总结

- 创建需求：FEAT-0001
- 下一步：深度分析
```

### 3.3 Index Manager（索引管理器）

**职责**：

- 维护全局索引
- 支持快速搜索
- 生成统计信息

**索引结构**：

```json
{
  "conversations": [
    {
      "id": "sess-20260522-143000",
      "timestamp": "2026-05-22T14:30:00Z",
      "title": "对话记录功能设计",
      "type": "feature",
      "tags": ["#feature", "#conversation-logger"],
      "important": true,
      "summary": "创建需求 FEAT-0001"
    }
  ],
  "stats": {
    "total": 42,
    "important": 8,
    "by_type": { "feature": 15, "bug": 12, "question": 10, "refactor": 5 }
  }
}
```

---

## 4. 数据流设计

### 4.1 会话生命周期

```
1. 会话开始
   SessionStartHook 触发
   ↓
   创建会话目录：.conversations/2026/05/22/
   生成会话ID：sess-20260522-143000
   初始化元数据

2. 对话进行中
   每次工具调用后
   ↓
   PostToolUseHook 触发
   ↓
   捕获事件内容
   追加到临时缓冲区
   （可选）用户标记重要

3. 会话结束
   StopHook 触发
   ↓
   生成最终 Markdown 文档
   更新全局索引
   创建备份（可选）
   输出摘要信息
```

### 4.2 文件结构

```
.conversations/
├── index.json                    # 全局索引
├── config.json                   # 配置文件
├── 2026/
│   ├── 05/
│   │   ├── 22/
│   │   │   ├── sess-20260522-143000.md      # 完整对话
│   │   │   ├── sess-20260522-143000.meta.json # 元数据
│   │   │   └── sess-20260522-150000.md
│   │   └── 23/
│   └── 06/
└── search-index/                 # 搜索索引
    └── fuse-index.json
```

---

## 5. 接口定义

### 5.1 Hooks 接口

**SessionStartHook**:

```javascript
// hooks/conversation-logger/session-start.js
export async function sessionStart(context) {
  const sessionId = generateSessionId();
  const logger = new ConversationLogger(sessionId);

  await logger.startSession({
    timestamp: new Date().toISOString(),
    workingDir: context.workingDirectory,
    branch: context.gitBranch,
    user: context.user,
  });

  return { continue: true, sessionId };
}
```

**PostToolUseHook**:

```javascript
// hooks/conversation-logger/post-tool-use.js
export async function postToolUse(context, result) {
  const logger = getConversationLogger();

  await logger.captureEvent('tool_use', {
    tool: result.tool,
    timestamp: new Date().toISOString(),
    success: result.success,
    duration: result.duration,
  });

  return { continue: true };
}
```

**StopHook**:

```javascript
// hooks/conversation-logger/stop.js
export async function stop(context) {
  const logger = getConversationLogger();

  const summary = await logger.endSession({
    endTime: new Date().toISOString(),
    messageCount: logger.getMessageCount(),
    toolCallCount: logger.getToolCallCount(),
  });

  console.log(`📝 对话已保存: ${summary.filepath}`);
  console.log(`   时长: ${summary.duration}`);
  console.log(`   消息数: ${summary.messageCount}`);

  return { continue: true };
}
```

### 5.2 CLI 命令接口

```bash
# 查看对话列表
/req-conv:list                    # 最近 10 条
/req-conv:list --today           # 今天的对话
/req-conv:list --important        # 重要对话

# 搜索对话
/req-conv:search "需求管理"        # 关键词搜索
/req-conv:search --tag #feature   # 标签搜索

# 查看特定对话
/req-conv:view sess-20260522-143000

# 标记重要
/req-conv:mark sess-20260522-143000 --important "关键决策"

# 统计信息
/req-conv:stats                  # 全局统计

# 配置管理
/req-conv:config --set auto-record=true
/req-conv:config --get retention-days
```

---

## 6. 错误处理

### 6.1 错误场景和处理

**场景 1：文件写入失败**

```javascript
try {
  await fs.writeFile(filepath, content);
} catch (error) {
  // 降级到临时目录
  const tempPath = path.join(os.tmpdir(), 'conversations', sessionId);
  await fs.ensureDir(tempPath);
  await fs.writeFile(tempPath, content);

  logger.warn(`写入失败，已保存到临时目录: ${tempPath}`);
  // 记录到失败队列，稍后重试
}
```

**场景 2：索引损坏**

```javascript
async function safeUpdateIndex(data) {
  const backupPath = indexPath + '.backup';

  try {
    // 先备份
    await fs.copy(indexPath, backupPath);

    // 更新索引
    await fs.writeJSON(indexPath, data);

    // 验证 JSON 有效性
    JSON.parse(await fs.readFile(indexPath));
  } catch (error) {
    // 恢复备份
    await fs.copy(backupPath, indexPath);
    throw new Error('索引更新失败，已恢复备份');
  }
}
```

**场景 3：Hook 失败不影响主流程**

```javascript
export async function postToolUse(context, result) {
  try {
    await logger.captureEvent('tool_use', result);
  } catch (error) {
    // 静默失败，不影响用户操作
    console.error('Conversation logger error:', error.message);
    // 记录到错误日志，但不抛出异常
  }

  return { continue: true }; // 总是继续
}
```

### 6.2 数据完整性保障

```javascript
// 写入前验证
async function validateConversation(data) {
  if (!data.sessionId) throw new Error('缺少 sessionId');
  if (!data.messages || data.messages.length === 0) {
    throw new Error('没有消息内容');
  }

  // 验证 JSON 结构
  const schema = {
    sessionId: 'string',
    timestamp: 'string',
    messages: 'array',
    metadata: 'object',
  };

  // ... 验证逻辑
}

// 定期健康检查
async function healthCheck() {
  const index = await loadIndex();
  const files = await glob('.conversations/**/*.md');

  // 检查孤儿文件（索引中没有的）
  const orphans = files.filter((f) => !index.conversations.find((c) => c.file === f));
  if (orphans.length > 0) {
    logger.warn(`发现 ${orphans.length} 个孤儿文件，尝试重建索引`);
    await rebuildIndex();
  }
}
```

---

## 7. 测试策略

### 7.1 单元测试

```javascript
// tests/conversation-logger/logger.test.js
describe('ConversationLogger', () => {
  test('应该创建新会话', async () => {
    const logger = new ConversationLogger('test-session');
    await logger.startSession({ timestamp: '2026-05-22T14:30:00Z' });

    expect(logger.getSessionId()).toBe('test-session');
    expect(logger.getStatus()).toBe('active');
  });

  test('应该捕获事件', async () => {
    const logger = new ConversationLogger('test-session');
    await logger.captureEvent('tool_use', { tool: 'Read' });

    const events = await logger.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].tool).toBe('Read');
  });

  test('应该标记重要对话', async () => {
    const logger = new ConversationLogger('test-session');
    await logger.markImportant('关键架构决策');

    const metadata = await logger.getMetadata();
    expect(metadata.important).toBe(true);
    expect(metadata.reason).toBe('关键架构决策');
  });
});
```

### 7.2 集成测试

```javascript
// tests/integration/hooks.test.js
describe('Hooks Integration', () => {
  test('SessionStartHook 应该初始化记录器', async () => {
    const context = mockContext();
    const result = await sessionStart(context);

    expect(result.continue).toBe(true);
    expect(result.sessionId).toBeDefined();

    const logFile = `.conversations/${result.sessionId}.md`;
    expect(fs.existsSync(logFile)).toBe(true);
  });

  test('PostToolUseHook 应该记录工具调用', async () => {
    const logger = getConversationLogger();
    const result = { tool: 'Read', success: true };

    await postToolUse({}, result);

    const events = await logger.getEvents();
    expect(events.some((e) => e.tool === 'Read')).toBe(true);
  });
});
```

### 7.3 端到端测试

```javascript
// tests/e2e/conversation-flow.test.js
describe('E2E: 完整对话流程', () => {
  test('应该记录完整会话并生成文档', async () => {
    // 1. 开始会话
    await sessionStart(mockContext());

    // 2. 模拟对话
    await captureMessage('user', '创建对话记录功能');
    await captureMessage('assistant', '好的，让我设计一下');
    await captureToolUse('Read', 'package.json');
    await captureToolUse('Skill', 'brainstorming');

    // 3. 结束会话
    const summary = await stop(mockContext());

    // 4. 验证
    expect(summary.filepath).toBeDefined();
    expect(summary.messageCount).toBe(2);
    expect(summary.toolCallCount).toBe(2);

    const content = await fs.readFile(summary.filepath, 'utf8');
    expect(content).toContain('创建对话记录功能');
    expect(content).toContain('tool_use');
  });
});
```

---

## 8. 实施计划

### 8.1 任务依赖关系

```
【可以并行的任务组】

组 A: 核心功能（串行）
1. Logger 基础 → Formatter → Session Manager
   ↓
组 B: 存储层（依赖组 A）
2. Index Manager ← File Writer ← Backup Manager
   ↓
组 C: Hooks 集成（依赖组 A、B）
3. SessionStart → PostToolUse → Stop
   ↓
组 D: CLI 命令（依赖组 C，可内部并行）
4. list & stats ← search ← view & mark
   ↓
组 E: 搜索引擎（独立，可与 D 并行）
5. Fuse.js 集成 ← 索引生成
   ↓
组 F: Web UI（完全独立，可与 B-E 并行）
6. 后端 API ← 前端界面 ← 可视化
   ↓
组 G: 集成和优化（依赖 C、D、E）
7. 系统集成 ← 性能优化 ← 文档
```

### 8.2 并行开发策略

**Phase 1: 基础设施（必须串行）**

- `Logger → Formatter → Session Manager`
- 建立核心数据模型和接口

**Phase 2: 并行开发**

- **线程 1**：存储层（Index Manager, File Writer）
- **线程 2**：Hooks 集成（SessionStart, PostToolUse, Stop）
- **线程 3**：搜索引擎（Fuse.js 集成）

**Phase 3: 命令层（可并行）**

- **线程 1**：`list` 和 `stats` 命令
- **线程 2**：`search` 命令
- **线程 3**：`view` 和 `mark` 命令

**Phase 4: 可选功能（完全并行）**

- **线程 1**：Web UI 开发
- **线程 2**：高级分析功能
- **线程 3**：集成测试完善

### 8.3 关键路径

```
关键路径（决定整体进度）：
Logger → Hooks → CLI 基础命令 → 系统集成

非关键路径（可延后）：
Web UI（可在任何时候并行开发）
高级搜索（可在基础功能完成后添加）
```

### 8.4 文件结构

```
scripts/conversation-logger/
├── core/
│   ├── logger.js              # ConversationLogger 类
│   ├── formatter.js           # Content Formatter
│   └── session-manager.js     # 会话管理
├── storage/
│   ├── index-manager.js       # 索引管理
│   ├── file-writer.js         # 文件写入
│   └── backup-manager.js      # 备份管理
├── hooks/
│   ├── session-start.js       # SessionStart Hook
│   ├── post-tool-use.js       # PostToolUse Hook
│   └── stop.js                # Stop Hook
├── commands/
│   ├── list.js                # /req-conv:list
│   ├── search.js              # /req-conv:search
│   ├── view.js                # /req-conv:view
│   ├── mark.js                # /req-conv:mark
│   └── stats.js               # /req-conv:stats
├── search/
│   └── fuse-search.js         # Fuse.js 搜索引擎
└── config/
    └── default.json           # 默认配置
```

### 8.5 配置示例

```json
// .conversations/config.json
{
  "autoRecord": true,
  "retentionDays": 90,
  "importantRetentionDays": 365,
  "format": "markdown",
  "includeToolCalls": true,
  "includeSystemMessages": false,
  "compression": false,
  "backup": {
    "enabled": true,
    "schedule": "daily",
    "keepDays": 30
  },
  "search": {
    "enabled": true,
    "threshold": 0.3
  }
}
```

---

## 9. 安全考虑

### 9.1 敏感信息过滤

```javascript
// 自动脱敏
const SENSITIVE_PATTERNS = [
  { pattern: /sk-[a-zA-Z0-9]{32,}/g, replacement: 'sk-***' }, // API Keys
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '***@***.***' }, // Email
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '***-**-****' }, // SSN
  { pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, replacement: 'Bearer ***' }, // Bearer tokens
];

function sanitizeContent(content) {
  let sanitized = content;
  for (const { pattern, replacement } of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, replacement);
  }
  return sanitized;
}
```

### 9.2 访问控制

```javascript
// 配置文件
{
  "accessControl": {
    "enabled": true,
    "defaultPermission": "read",
    "importantConversations": "owner",
    "retention": {
      "autoDeleteDays": 90,
      "importantRetentionDays": 365
    }
  }
}
```

### 9.3 数据加密（可选）

```javascript
// 敏感对话加密
import crypto from 'crypto';

function encryptConversation(content, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return { encrypted, iv: iv.toString('hex') };
}
```

---

## 10. 决策记录

| 决策            | 理由                           |
| --------------- | ------------------------------ |
| 使用 Hooks 方案 | 与现有系统集成最佳，完全自动化 |
| 分层存储结构    | 平衡可读性和机器可处理性       |
| Fuse.js 搜索    | 轻量级，无需外部依赖，性能良好 |
| 混合记录模式    | 灵活性与便利性的平衡           |
| Markdown 格式   | 人类可读，易于版本控制         |

---

## 11. 验收标准

### 11.1 功能验收

- ✅ 自动记录所有对话（用户、AI、工具调用）
- ✅ 支持手动标记重要对话
- ✅ CLI 命令完整可用（list、search、view、mark、stats）
- ✅ 搜索功能正常工作
- ✅ 索引自动维护
- ✅ 错误处理不影响主流程

### 11.2 性能验收

- ✅ 单个对话记录时间 < 100ms
- ✅ 搜索响应时间 < 500ms
- ✅ 索引更新时间 < 200ms
- ✅ 内存占用 < 50MB

### 11.3 质量验收

- ✅ 单元测试覆盖率 > 80%
- ✅ 所有集成测试通过
- ✅ 无安全漏洞
- ✅ 文档完整

---

## 附录

### A. 相关需求

无

### B. 参考文档

- [Claude Code Hooks 文档](https://github.com/anthropics/claude-code)
- [Fuse.js 文档](https://fusejs.io/)
- 项目 CLAUDE.md

### C. 变更历史

| 日期       | 变更内容     | 影响分析 |
| ---------- | ------------ | -------- |
| 2026-05-22 | 创建设计文档 | 新功能   |
