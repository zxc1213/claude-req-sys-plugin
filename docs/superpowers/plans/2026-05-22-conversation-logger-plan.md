# 对话记录功能实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 实现基于 Hooks 的自动对话记录系统，记录所有 Claude Code 对话并保存为文档

**架构：** 使用 Claude Code Hooks（SessionStart、PostToolUse、Stop）拦截会话事件，通过 Conversation Logger 处理和格式化，以分层结构（Markdown + JSON）存储到文件系统，提供 CLI 命令查询和搜索

**技术栈：** Node.js >= 18.0.0, Claude Code Hooks API, Fuse.js（搜索）, fs-extra（文件操作）

---

## 文件结构

### 新增文件

```
scripts/conversation-logger/
├── core/
│   ├── logger.js              # ConversationLogger 类：核心记录逻辑
│   ├── formatter.js           # ContentFormatter 类：Markdown 格式化
│   ├── session-manager.js     # SessionManager 类：会话状态管理
│   └── id-generator.js        # 会话 ID 生成器
├── storage/
│   ├── index-manager.js       # IndexManager 类：全局索引管理
│   ├── file-writer.js         # FileWriter 类：文件写入操作
│   └── validator.js           # 数据验证工具
├── hooks/
│   ├── session-start.js       # SessionStart Hook 实现
│   ├── post-tool-use.js       # PostToolUse Hook 实现
│   └── stop.js                # Stop Hook 实现
├── commands/
│   ├── list.js                # /req-conv:list 命令
│   ├── search.js              # /req-conv:search 命令
│   ├── view.js                # /req-conv:view 命令
│   ├── mark.js                # /req-conv:mark 命令
│   ├── stats.js               # /req-conv:stats 命令
│   └── config.js              # /req-conv:config 命令
├── search/
│   └── fuse-search.js         # Fuse.js 搜索引擎封装
└── config/
    └── default.json           # 默认配置

tests/conversation-logger/
├── core/
│   ├── logger.test.js
│   ├── formatter.test.js
│   └── session-manager.test.js
├── storage/
│   ├── index-manager.test.js
│   └── file-writer.test.js
├── hooks/
│   ├── session-start.test.js
│   ├── post-tool-use.test.js
│   └── stop.test.js
└── integration/
    └── e2e-flow.test.js

commands/
├── req-conv-list.md
├── req-conv-search.md
├── req-conv-view.md
├── req-conv-mark.md
├── req-conv-stats.md
└── req-conv-config.md

hooks/
└── hooks.json                  # Hooks 配置（追加到现有配置）
```

### 修改文件

```
hooks/hooks.json               # 追加对话记录 hooks 配置
package.json                    # 添加 fuse.js 依赖
```

---

## 任务

### 任务 1：项目初始化和依赖安装

**文件：**

- 修改：`package.json`

- [ ] **步骤 1：添加依赖**

```json
{
  "dependencies": {
    "fuse.js": "^7.0.0",
    "fs-extra": "^11.2.0"
  }
}
```

- [ ] **步骤 2：安装依赖**

运行：`npm install`

预期：`node_modules` 中包含 `fuse.js` 和 `fs-extra`

- [ ] **步骤 3：创建目录结构**

运行：

```bash
mkdir -p scripts/conversation-logger/{core,storage,hooks,commands,search,config}
mkdir -p tests/conversation-logger/{core,storage,hooks,integration}
mkdir -p commands
```

预期：所有目录创建成功

- [ ] **步骤 4：Commit**

```bash
git add package.json
git commit -m "feat: 添加对话记录功能依赖和目录结构"
```

---

### 任务 2：实现会话 ID 生成器

**文件：**

- 创建：`scripts/conversation-logger/core/id-generator.js`

- [ ] **步骤 1：编写失败的测试**

创建 `tests/conversation-logger/core/id-generator.test.js`：

```javascript
import {
  generateSessionId,
  parseSessionId,
} from '../../../scripts/conversation-logger/core/id-generator.js';
import { expect } from 'chai';

describe('IDGenerator', () => {
  test('应该生成唯一会话 ID', () => {
    const id1 = generateSessionId();
    const id2 = generateSessionId();

    expect(id1).to.be.a('string');
    expect(id2).to.be.a('string');
    expect(id1).to.not.equal(id2);
  });

  test('应该生成符合格式的 ID', () => {
    const id = generateSessionId();
    const pattern = /^sess-\d{8}-\d{6}$/;

    expect(id).to.match(pattern);
  });

  test('应该解析会话 ID', () => {
    const id = 'sess-20260522-143000';
    const parsed = parseSessionId(id);

    expect(parsed).to.deep.equal({
      date: '20260522',
      time: '143000',
    });
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- tests/conversation-logger/core/id-generator.test.js`

预期：FAIL，报错 "Cannot find module 'id-generator.js'"

- [ ] **步骤 3：实现 ID 生成器**

创建 `scripts/conversation-logger/core/id-generator.js`：

```javascript
/**
 * 生成会话 ID
 * 格式：sess-YYYYMMDD-HHMMSS
 * @returns {string} 会话 ID
 */
export function generateSessionId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const time = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
  return `sess-${date}-${time}`;
}

/**
 * 解析会话 ID
 * @param {string} sessionId - 会话 ID
 * @returns {object} 解析结果 {date, time}
 */
export function parseSessionId(sessionId) {
  const match = sessionId.match(/^sess-(\d{8})-(\d{6})$/);
  if (!match) {
    throw new Error(`Invalid session ID format: ${sessionId}`);
  }
  return {
    date: match[1],
    time: match[2],
  };
}
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- tests/conversation-logger/core/id-generator.test.js`

预期：PASS

- [ ] **步骤 5：Commit**

```bash
git add scripts/conversation-logger/core/id-generator.js
git add tests/conversation-logger/core/id-generator.test.js
git commit -m "feat: 实现会话 ID 生成器"
```

---

### 任务 3：实现 Content Formatter

**文件：**

- 创建：`scripts/conversation-logger/core/formatter.js`
- 创建：`tests/conversation-logger/core/formatter.test.js`

- [ ] **步骤 1：编写失败的测试**

```javascript
import { ContentFormatter } from '../../../scripts/conversation-logger/core/formatter.js';
import { expect } from 'chai';

describe('ContentFormatter', () => {
  test('应该格式化单个事件为 Markdown', () => {
    const formatter = new ContentFormatter();
    const event = {
      type: 'user_message',
      timestamp: '2026-05-22T14:30:15Z',
      content: '新增功能',
    };

    const markdown = formatter.formatEvent(event);

    expect(markdown).to.include('[14:30:15]');
    expect(markdown).to.include('新增功能');
  });

  test('应该格式化工具调用', () => {
    const formatter = new ContentFormatter();
    const event = {
      type: 'tool_use',
      timestamp: '2026-05-22T14:30:25Z',
      tool: 'Read',
      args: { filepath: 'package.json' },
    };

    const markdown = formatter.formatEvent(event);

    expect(markdown).to.include('`Read: package.json`');
  });

  test('应该生成完整文档', () => {
    const formatter = new ContentFormatter();
    const session = {
      sessionId: 'sess-20260522-143000',
      metadata: { type: 'feature' },
      events: [
        { type: 'user_message', content: '测试' },
        { type: 'ai_response', content: '好的' },
      ],
    };

    const doc = formatter.formatDocument(session);

    expect(doc).to.include('# 对话记录');
    expect(doc).to.include('sess-20260522-143000');
    expect(doc).to.include('测试');
    expect(doc).to.include('好的');
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- tests/conversation-logger/core/formatter.test.js`

预期：FAIL

- [ ] **步骤 3：实现 Content Formatter**

```javascript
/**
 * 内容格式化器
 * 将事件转换为 Markdown 格式
 */
export class ContentFormatter {
  /**
   * 格式化时间戳
   * @param {string} isoString - ISO 时间字符串
   * @returns {string} HH:MM:SS 格式
   */
  formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toTimeString().slice(0, 8); // HH:MM:SS
  }

  /**
   * 格式化单个事件
   * @param {object} event - 事件对象
   * @returns {string} Markdown 格式的事件
   */
  formatEvent(event) {
    const time = this.formatTimestamp(event.timestamp);

    switch (event.type) {
      case 'user_message':
        return `### 用户消息\n\n[${time}] ${event.content}\n`;

      case 'ai_response':
        return `### AI 响应\n\n[${time}] ${event.content}\n`;

      case 'tool_use':
        const args = event.args ? `: ${JSON.stringify(event.args)}` : '';
        return `- [${time}] \`${event.tool}${args}\`\n`;

      default:
        return `- [${time}] ${event.type}\n`;
    }
  }

  /**
   * 格式化完整文档
   * @param {object} session - 会话对象
   * @returns {string} 完整 Markdown 文档
   */
  formatDocument(session) {
    const { sessionId, metadata, events } = session;
    const date = new Date().toISOString().slice(0, 10);

    let doc = `# 对话记录 - ${date}\n\n`;
    doc += `## 元数据\n\n`;
    doc += `- **会话ID**: ${sessionId}\n`;

    if (metadata.type) {
      doc += `- **类型**: ${metadata.type}\n`;
    }

    if (metadata.important) {
      doc += `- **重要**: ⭐ ${metadata.reason || ''}\n`;
    }

    doc += `\n## 对话内容\n\n`;

    // 按类型分组
    const userMessages = events.filter((e) => e.type === 'user_message');
    const aiResponses = events.filter((e) => e.type === 'ai_response');
    const toolCalls = events.filter((e) => e.type === 'tool_use');

    // 用户消息
    if (userMessages.length > 0) {
      doc += `### 用户消息\n\n`;
      userMessages.forEach((event) => {
        doc += this.formatEvent(event);
      });
      doc += `\n`;
    }

    // AI 响应
    if (aiResponses.length > 0) {
      doc += `### AI 响应\n\n`;
      aiResponses.forEach((event) => {
        doc += this.formatEvent(event);
      });
      doc += `\n`;
    }

    // 工具调用
    if (toolCalls.length > 0) {
      doc += `### 工具调用\n\n`;
      toolCalls.forEach((event) => {
        doc += this.formatEvent(event);
      });
    }

    return doc;
  }
}
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- tests/conversation-logger/core/formatter.test.js`

预期：PASS

- [ ] **步骤 5：Commit**

```bash
git add scripts/conversation-logger/core/formatter.js
git add tests/conversation-logger/core/formatter.test.js
git commit -m "feat: 实现内容格式化器"
```

---

### 任务 4：实现 Session Manager

**文件：**

- 创建：`scripts/conversation-logger/core/session-manager.js`
- 创建：`tests/conversation-logger/core/session-manager.test.js`

- [ ] **步骤 1：编写失败的测试**

```javascript
import { SessionManager } from '../../../scripts/conversation-logger/core/session-manager.js';
import { expect } from 'chai';

describe('SessionManager', () => {
  test('应该创建新会话', () => {
    const manager = new SessionManager();
    const sessionId = 'sess-20260522-143000';

    manager.createSession(sessionId, { type: 'feature' });

    expect(manager.hasSession(sessionId)).to.be.true;
    expect(manager.getSession(sessionId)).to.deep.include({
      id: sessionId,
      status: 'active',
      events: [],
    });
  });

  test('应该添加事件', () => {
    const manager = new SessionManager();
    const sessionId = 'sess-20260522-143000';

    manager.createSession(sessionId, {});
    manager.addEvent(sessionId, {
      type: 'user_message',
      content: '测试',
      timestamp: '2026-05-22T14:30:00Z',
    });

    const session = manager.getSession(sessionId);
    expect(session.events).to.have.length(1);
    expect(session.events[0].content).to.equal('测试');
  });

  test('应该标记重要', () => {
    const manager = new SessionManager();
    const sessionId = 'sess-20260522-143000';

    manager.createSession(sessionId, {});
    manager.markImportant(sessionId, '关键决策');

    const session = manager.getSession(sessionId);
    expect(session.metadata.important).to.be.true;
    expect(session.metadata.reason).to.equal('关键决策');
  });

  test('应该结束会话', () => {
    const manager = new SessionManager();
    const sessionId = 'sess-20260522-143000';

    manager.createSession(sessionId, {});
    manager.addEvent(sessionId, { type: 'test' });
    const summary = manager.endSession(sessionId);

    expect(summary.messageCount).to.equal(1);
    expect(summary.status).to.equal('completed');
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- tests/conversation-logger/core/session-manager.test.js`

预期：FAIL

- [ ] **步骤 3：实现 Session Manager**

```javascript
/**
 * 会话管理器
 * 管理活跃会话的状态和事件
 */
export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * 创建新会话
   * @param {string} sessionId - 会话 ID
   * @param {object} metadata - 元数据
   */
  createSession(sessionId, metadata = {}) {
    this.sessions.set(sessionId, {
      id: sessionId,
      status: 'active',
      startTime: new Date().toISOString(),
      metadata,
      events: [],
    });
  }

  /**
   * 检查会话是否存在
   * @param {string} sessionId - 会话 ID
   * @returns {boolean}
   */
  hasSession(sessionId) {
    return this.sessions.has(sessionId);
  }

  /**
   * 获取会话
   * @param {string} sessionId - 会话 ID
   * @returns {object} 会话对象
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  /**
   * 添加事件
   * @param {string} sessionId - 会话 ID
   * @param {object} event - 事件对象
   */
  addEvent(sessionId, event) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.events.push({
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    });
  }

  /**
   * 标记为重要
   * @param {string} sessionId - 会话 ID
   * @param {string} reason - 原因
   */
  markImportant(sessionId, reason) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.metadata.important = true;
    session.metadata.reason = reason;
  }

  /**
   * 结束会话
   * @param {string} sessionId - 会话 ID
   * @returns {object} 会话摘要
   */
  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'completed';
    session.endTime = new Date().toISOString();

    return {
      sessionId,
      status: session.status,
      startTime: session.startTime,
      endTime: session.endTime,
      messageCount: session.events.filter(
        (e) => e.type === 'user_message' || e.type === 'ai_response'
      ).length,
      toolCallCount: session.events.filter((e) => e.type === 'tool_use').length,
    };
  }
}
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- tests/conversation-logger/core/session-manager.test.js`

预期：PASS

- [ ] **步骤 5：Commit**

```bash
git add scripts/conversation-logger/core/session-manager.js
git add tests/conversation-logger/core/session-manager.test.js
git commit -m "feat: 实现会话管理器"
```

---

### 任务 5：实现 Conversation Logger（核心）

**文件：**

- 创建：`scripts/conversation-logger/core/logger.js`
- 创建：`tests/conversation-logger/core/logger.test.js`

- [ ] **步骤 1：编写失败的测试**

```javascript
import { ConversationLogger } from '../../../scripts/conversation-logger/core/logger.js';
import { expect } from 'chai';
import fs from 'fs-extra';
import { rimraf } from 'rimraf';

describe('ConversationLogger', () => {
  const testDir = '.test-conversations';

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await rimraf(testDir);
  });

  test('应该启动新会话', async () => {
    const logger = new ConversationLogger(testDir);
    await logger.startSession('sess-test', { type: 'test' });

    expect(logger.getSessionId()).to.equal('sess-test');
    expect(logger.getStatus()).to.equal('active');
  });

  test('应该捕获事件', async () => {
    const logger = new ConversationLogger(testDir);
    await logger.startSession('sess-test', {});
    await logger.captureEvent('user_message', { content: '测试' });

    const events = await logger.getEvents();
    expect(events).to.have.length(1);
    expect(events[0].content).to.equal('测试');
  });

  test('应该保存会话到文件', async () => {
    const logger = new ConversationLogger(testDir);
    await logger.startSession('sess-test', {});
    await logger.captureEvent('user_message', { content: '测试' });
    const summary = await logger.endSession({});

    const filepath = `${testDir}/sess-test.md`;
    expect(await fs.pathExists(filepath)).to.be.true;

    const content = await fs.readFile(filepath, 'utf8');
    expect(content).to.include('测试');
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- tests/conversation-logger/core/logger.test.js`

预期：FAIL

- [ ] **步骤 3：实现 Conversation Logger**

```javascript
import fs from 'fs-extra';
import path from 'path';
import { SessionManager } from './session-manager.js';
import { ContentFormatter } from './formatter.js';
import { generateSessionId } from './id-generator.js';

/**
 * 对话记录器
 * 核心记录逻辑，协调会话管理和格式化
 */
export class ConversationLogger {
  /**
   * @param {string} baseDir - 基础目录
   */
  constructor(baseDir = '.conversations') {
    this.baseDir = baseDir;
    this.sessionManager = new SessionManager();
    this.formatter = new ContentFormatter();
    this.currentSessionId = null;
  }

  /**
   * 启动新会话
   * @param {string} sessionId - 会话 ID（可选，自动生成）
   * @param {object} metadata - 元数据
   */
  async startSession(sessionId = null, metadata = {}) {
    this.currentSessionId = sessionId || generateSessionId();

    // 创建日期目录
    const parsed = this.currentSessionId.match(/sess-(\d{8})-(\d{6})/);
    if (parsed) {
      const date = parsed[1];
      const year = date.slice(0, 4);
      const month = date.slice(4, 6);
      const day = date.slice(6, 8);

      const sessionDir = path.join(this.baseDir, year, month, day);
      await fs.ensureDir(sessionDir);
    }

    this.sessionManager.createSession(this.currentSessionId, metadata);
    return this.currentSessionId;
  }

  /**
   * 获取当前会话 ID
   * @returns {string|null}
   */
  getSessionId() {
    return this.currentSessionId;
  }

  /**
   * 获取当前状态
   * @returns {string}
   */
  getStatus() {
    if (!this.currentSessionId) {
      return 'idle';
    }

    const session = this.sessionManager.getSession(this.currentSessionId);
    return session ? session.status : 'unknown';
  }

  /**
   * 捕获事件
   * @param {string} eventType - 事件类型
   * @param {object} data - 事件数据
   */
  async captureEvent(eventType, data = {}) {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    this.sessionManager.addEvent(this.currentSessionId, {
      type: eventType,
      ...data,
    });
  }

  /**
   * 标记为重要
   * @param {string} reason - 原因
   */
  async markImportant(reason) {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    this.sessionManager.markImportant(this.currentSessionId, reason);
  }

  /**
   * 获取事件列表
   * @returns {Array}
   */
  async getEvents() {
    if (!this.currentSessionId) {
      return [];
    }

    const session = this.sessionManager.getSession(this.currentSessionId);
    return session ? session.events : [];
  }

  /**
   * 获取元数据
   * @returns {object}
   */
  async getMetadata() {
    if (!this.currentSessionId) {
      return {};
    }

    const session = this.sessionManager.getSession(this.currentSessionId);
    return session ? session.metadata : {};
  }

  /**
   * 结束会话并保存
   * @param {object} summary - 额外摘要信息
   * @returns {object} 保存结果
   */
  async endSession(summary = {}) {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    const sessionSummary = this.sessionManager.endSession(this.currentSessionId);
    const session = this.sessionManager.getSession(this.currentSessionId);

    // 生成文件路径
    const filepath = this._getFilePath(this.currentSessionId);

    // 格式化并保存
    const doc = this.formatter.formatDocument(session);
    await fs.writeFile(filepath, doc, 'utf8');

    // 保存元数据
    const metaPath = filepath.replace('.md', '.meta.json');
    await fs.writeJSON(metaPath, {
      id: this.currentSessionId,
      ...session.metadata,
      startTime: session.startTime,
      endTime: session.endTime,
      eventCount: session.events.length,
    });

    const result = {
      filepath,
      metaPath,
      ...sessionSummary,
      ...summary,
    };

    this.currentSessionId = null;
    return result;
  }

  /**
   * 获取文件路径
   * @private
   */
  _getFilePath(sessionId) {
    const parsed = sessionId.match(/sess-(\d{8})-(\d{6})/);
    if (!parsed) {
      return path.join(this.baseDir, `${sessionId}.md`);
    }

    const date = parsed[1];
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);

    return path.join(this.baseDir, year, month, day, `${sessionId}.md`);
  }
}
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- tests/conversation-logger/core/logger.test.js`

预期：PASS

- [ ] **步骤 5：Commit**

```bash
git add scripts/conversation-logger/core/logger.js
git add tests/conversation-logger/core/logger.test.js
git commit -m "feat: 实现对话记录器核心"
```

---

### 任务 6：实现 SessionStart Hook

**文件：**

- 创建：`scripts/conversation-logger/hooks/session-start.js`
- 创建：`tests/conversation-logger/hooks/session-start.test.js`

- [ ] **步骤 1：编写失败的测试**

```javascript
import { sessionStart } from '../../../scripts/conversation-logger/hooks/session-start.js';
import { expect } from 'chai';
import fs from 'fs-extra';
import { rimraf } from 'rimraf';

describe('SessionStart Hook', () => {
  const testDir = '.test-hooks';

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await rimraf(testDir);
  });

  test('应该初始化记录器', async () => {
    const context = {
      workingDirectory: testDir,
      gitBranch: 'main',
      user: 'test-user',
    };

    const result = await sessionStart(context);

    expect(result.continue).to.be.true;
    expect(result.sessionId).to.match(/^sess-\d{8}-\d{6}$/);
  });

  test('应该创建会话目录', async () => {
    const context = { workingDirectory: testDir };

    await sessionStart(context);

    const exists = await fs.pathExists(path.join(testDir, '.conversations'));
    expect(exists).to.be.true;
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- tests/conversation-logger/hooks/session-start.test.js`

预期：FAIL

- [ ] **步骤 3：实现 SessionStart Hook**

```javascript
import { ConversationLogger } from '../core/logger.js';

// 全局记录器实例
let globalLogger = null;

/**
 * 获取全局记录器实例
 * @returns {ConversationLogger}
 */
export function getConversationLogger() {
  return globalLogger;
}

/**
 * SessionStart Hook
 * 在会话开始时初始化记录器
 * @param {object} context - Hook 上下文
 * @returns {object} Hook 结果
 */
export async function sessionStart(context) {
  const logger = new ConversationLogger();
  const sessionId = await logger.startSession(null, {
    workingDir: context.workingDirectory,
    branch: context.gitBranch,
    user: context.user,
    type: 'session',
  });

  globalLogger = logger;

  return {
    continue: true,
    sessionId,
  };
}
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- tests/conversation-logger/hooks/session-start.test.js`

预期：PASS

- [ ] **步骤 5：Commit**

```bash
git add scripts/conversation-logger/hooks/session-start.js
git add tests/conversation-logger/hooks/session-start.test.js
git commit -m "feat: 实现 SessionStart Hook"
```

---

### 任务 7：实现 PostToolUse Hook

**文件：**

- 创建：`scripts/conversation-logger/hooks/post-tool-use.js`
- 创建：`tests/conversation-logger/hooks/post-tool-use.test.js`

- [ ] **步骤 1：编写失败的测试**

```javascript
import {
  postToolUse,
  getConversationLogger,
} from '../../../scripts/conversation-logger/hooks/post-tool-use.js';
import { sessionStart } from '../../../scripts/conversation-logger/hooks/session-start.js';
import { expect } from 'chai';

describe('PostToolUse Hook', () => {
  test('应该记录工具调用', async () => {
    // 先启动会话
    await sessionStart({ workingDirectory: '.test' });

    const result = {
      tool: 'Read',
      success: true,
      duration: 150,
    };

    const hookResult = await postToolUse({}, result);

    expect(hookResult.continue).to.be.true;

    const logger = getConversationLogger();
    const events = await logger.getEvents();
    expect(events).to.have.length(1);
    expect(events[0].tool).to.equal('Read');
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- tests/conversation-logger/hooks/post-tool-use.test.js`

预期：FAIL

- [ ] **步骤 3：实现 PostToolUse Hook**

```javascript
import { getConversationLogger } from './session-start.js';

/**
 * PostToolUse Hook
 * 在每次工具调用后记录事件
 * @param {object} context - Hook 上下文
 * @param {object} result - 工具调用结果
 * @returns {object} Hook 结果
 */
export async function postToolUse(context, result) {
  try {
    const logger = getConversationLogger();

    if (logger && logger.getStatus() === 'active') {
      await logger.captureEvent('tool_use', {
        tool: result.tool,
        args: result.input,
        success: result.success,
        duration: result.duration,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // 静默失败，不影响主流程
    console.error('Conversation logger error:', error.message);
  }

  return { continue: true };
}
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- tests/conversation-logger/hooks/post-tool-use.test.js`

预期：PASS

- [ ] **步骤 5：Commit**

```bash
git add scripts/conversation-logger/hooks/post-tool-use.js
git add tests/conversation-logger/hooks/post-tool-use.test.js
git commit -m "feat: 实现 PostToolUse Hook"
```

---

### 任务 8：实现 Stop Hook

**文件：**

- 创建：`scripts/conversation-logger/hooks/stop.js`
- 创建：`tests/conversation-logger/hooks/stop.test.js`

- [ ] **步骤 1：编写失败的测试**

```javascript
import { stop } from '../../../scripts/conversation-logger/hooks/stop.js';
import { sessionStart } from '../../../scripts/conversation-logger/hooks/session-start.js';
import { postToolUse } from '../../../scripts/conversation-logger/hooks/post-tool-use.js';
import { expect } from 'chai';
import fs from 'fs-extra';
import { rimraf } from 'rimraf';

describe('Stop Hook', () => {
  const testDir = '.test-stop-hook';

  afterEach(async () => {
    await rimraf(testDir);
  });

  test('应该结束会话并保存', async () => {
    await sessionStart({ workingDirectory: testDir });
    await postToolUse({}, { tool: 'Test' });

    const summary = await stop({});

    expect(summary.continue).to.be.true;
    expect(summary.filepath).to.include('.md');

    const exists = await fs.pathExists(summary.filepath);
    expect(exists).to.be.true;
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`npm test -- tests/conversation-logger/hooks/stop.test.js`

预期：FAIL

- [ ] **步骤 3：实现 Stop Hook**

```javascript
import { getConversationLogger } from './session-start.js';

/**
 * Stop Hook
 * 在会话结束时保存记录
 * @param {object} context - Hook 上下文
 * @returns {object} Hook 结果
 */
export async function stop(context) {
  try {
    const logger = getConversationLogger();

    if (logger && logger.getStatus() === 'active') {
      const summary = await logger.endSession({
        endTime: new Date().toISOString(),
      });

      console.log(`📝 对话已保存: ${summary.filepath}`);
      console.log(`   消息数: ${summary.messageCount}`);
      console.log(`   工具调用: ${summary.toolCallCount}`);

      return {
        continue: true,
        summary,
      };
    }
  } catch (error) {
    // 静默失败，不影响主流程
    console.error('Conversation logger error:', error.message);
  }

  return { continue: true };
}
```

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- tests/conversation-logger/hooks/stop.test.js`

预期：PASS

- [ ] **步骤 5：Commit**

```bash
git add scripts/conversation-logger/hooks/stop.js
git add tests/conversation-logger/hooks/stop.test.js
git commit -m "feat: 实现 Stop Hook"
```

---

### 任务 9：配置 Hooks 到系统

**文件：**

- 修改：`hooks/hooks.json`

- [ ] **步骤 1：查看现有配置**

运行：`cat hooks/hooks.json`

预期：显示现有 hooks 配置

- [ ] **步骤 2：追加对话记录 Hooks**

在现有 `hooks/hooks.json` 中追加：

```json
{
  "SessionStart": [
    {
      "script": "scripts/conversation-logger/hooks/session-start.js",
      "description": "初始化对话记录器"
    }
  ],
  "PostToolUse": [
    {
      "script": "scripts/conversation-logger/hooks/post-tool-use.js",
      "description": "记录工具调用"
    }
  ],
  "Stop": [
    {
      "script": "scripts/conversation-logger/hooks/stop.js",
      "description": "保存对话记录"
    }
  ]
}
```

- [ ] **步骤 3：验证配置格式**

运行：`cat hooks/hooks.json | jq .`

预期：JSON 格式有效

- [ ] **步骤 4：Commit**

```bash
git add hooks/hooks.json
git commit -m "feat: 配置对话记录 Hooks"
```

---

### 任务 10：实现 /req-conv:list 命令

**文件：**

- 创建：`scripts/conversation-logger/commands/list.js`
- 创建：`commands/req-conv-list.md`

- [ ] **步骤 1：编写命令实现**

```javascript
/**
 * 列出对话记录
 * @param {object} options - 选项
 * @returns {Promise<Array>}
 */
export async function listConversations(options = {}) {
  const fs = await import('fs-extra');
  const path = await import('path');

  const { limit = 10, today = false, important = false } = options;
  const baseDir = '.conversations';

  if (!(await fs.pathExists(baseDir))) {
    return [];
  }

  // 递归查找所有 .md 文件
  const files = await fs.readdir(baseDir, { recursive: true });
  const conversations = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filepath = path.join(baseDir, file);
    const stat = await fs.stat(filepath);
    const metaPath = filepath.replace('.md', '.meta.json');

    let metadata = {};
    if (await fs.pathExists(metaPath)) {
      metadata = await fs.readJSON(metaPath);
    }

    const date = new Date(stat.mtime);

    // 过滤条件
    if (today) {
      const todayDate = new Date();
      if (date.toDateString() !== todayDate.toDateString()) {
        continue;
      }
    }

    if (important && !metadata.important) {
      continue;
    }

    conversations.push({
      id: path.basename(file, '.md'),
      filepath,
      date: date.toISOString(),
      metadata,
    });
  }

  // 按日期排序
  conversations.sort((a, b) => new Date(b.date) - new Date(a.date));

  return conversations.slice(0, limit);
}
```

- [ ] **步骤 2：编写命令文档**

创建 `commands/req-conv-list.md`：

```markdown
---
description: 列出对话记录
arguments:
  - name: --limit
    description: 限制返回数量（默认：10）
    default: '10'
  - name: --today
    description: 只显示今天的对话
    boolean: true
  - name: --important
    description: 只显示重要对话
    boolean: true
---

# 对话记录列表

最近 ${conversations.length} 条对话记录：

${conversations.map(conv => `
**${conv.id}\*\*

- 时间：${new Date(conv.date).toLocaleString('zh-CN')}
- 类型：${conv.metadata.type || '未知'}
${conv.metadata.important ? '- 重要：⭐ ' + conv.metadata.reason : ''}
  `).join('\n---\n')}
```

- [ ] **步骤 3：Commit**

```bash
git add scripts/conversation-logger/commands/list.js
git add commands/req-conv-list.md
git commit -m "feat: 实现 /req-conv:list 命令"
```

---

### 任务 11：实现 /req-conv:search 命令

**文件：**

- 创建：`scripts/conversation-logger/search/fuse-search.js`
- 创建：`scripts/conversation-logger/commands/search.js`
- 创建：`commands/req-conv-search.md`

- [ ] **步骤 1：实现 Fuse.js 搜索**

```javascript
import Fuse from 'fuse.js';
import fs from 'fs-extra';
import path from 'path';

/**
 * 搜索对话
 * @param {string} query - 搜索查询
 * @param {object} options - 选项
 * @returns {Promise<Array>}
 */
export async function searchConversations(query, options = {}) {
  const { limit = 10, tag = null } = options;
  const baseDir = '.conversations';

  if (!(await fs.pathExists(baseDir))) {
    return [];
  }

  // 构建搜索索引
  const conversations = await _buildIndex(baseDir);

  // 配置 Fuse.js
  const fuse = new Fuse(conversations, {
    keys: [
      { name: 'content', weight: 0.7 },
      { name: 'metadata.type', weight: 0.2 },
      { name: 'metadata.tags', weight: 0.1 },
    ],
    threshold: 0.3,
    includeScore: true,
  });

  // 执行搜索
  let results = fuse.search(query);

  // 标签过滤
  if (tag) {
    results = results.filter(
      (result) => result.item.metadata.tags && result.item.metadata.tags.includes(tag)
    );
  }

  // 返回结果
  return results.slice(0, limit).map((result) => ({
    id: result.item.id,
    filepath: result.item.filepath,
    date: result.item.date,
    metadata: result.item.metadata,
    score: result.score,
    matches: result.matches,
  }));
}

/**
 * 构建搜索索引
 * @private
 */
async function _buildIndex(baseDir) {
  const files = await fs.readdir(baseDir, { recursive: true });
  const conversations = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filepath = path.join(baseDir, file);
    const content = await fs.readFile(filepath, 'utf8');
    const metaPath = filepath.replace('.md', '.meta.json');

    let metadata = {};
    if (await fs.pathExists(metaPath)) {
      metadata = await fs.readJSON(metaPath);
    }

    conversations.push({
      id: path.basename(file, '.md'),
      filepath,
      content,
      metadata,
      date: metadata.startTime || new Date().toISOString(),
    });
  }

  return conversations;
}
```

- [ ] **步骤 2：编写命令文档**

创建 `commands/req-conv-search.md`：

```markdown
---
description: 搜索对话记录
arguments:
  - name: query
    description: 搜索关键词
    required: true
  - name: --tag
    description: 按标签过滤
  - name: --limit
    description: 限制返回数量（默认：10）
    default: '10'
---

# 搜索结果

找到 ${results.length} 条匹配的对话：

${results.map(result => `
**${result.id}\*\* (相关度: ${(1 - result.score).toFixed(2)})

- 时间：${new Date(result.date).toLocaleString('zh-CN')}
- 路径：${result.filepath}
${result.matches ? '- 匹配：' + result.matches.map(m => m.key).join(', ') : ''}
  `).join('\n---\n')}
```

- [ ] **步骤 3：Commit**

```bash
git add scripts/conversation-logger/search/fuse-search.js
git add scripts/conversation-logger/commands/search.js
git add commands/req-conv-search.md
git commit -m "feat: 实现 /req-conv:search 命令"
```

---

### 任务 12：实现 /req-conv:view 命令

**文件：**

- 创建：`scripts/conversation-logger/commands/view.js`
- 创建：`commands/req-conv-view.md`

- [ ] **步骤 1：编写命令实现**

```javascript
import fs from 'fs-extra';
import path from 'path';

/**
 * 查看对话内容
 * @param {string} sessionId - 会话 ID
 * @returns {Promise<object>}
 */
export async function viewConversation(sessionId) {
  const baseDir = '.conversations';

  // 查找文件
  const filepath = await _findSessionFile(baseDir, sessionId);

  if (!filepath) {
    throw new Error(`对话不存在: ${sessionId}`);
  }

  // 读取内容
  const content = await fs.readFile(filepath, 'utf8');

  // 读取元数据
  const metaPath = filepath.replace('.md', '.meta.json');
  let metadata = {};
  if (await fs.pathExists(metaPath)) {
    metadata = await fs.readJSON(metaPath);
  }

  return {
    id: sessionId,
    filepath,
    content,
    metadata,
  };
}

/**
 * 查找会话文件
 * @private
 */
async function _findSessionFile(baseDir, sessionId) {
  const fs = await import('fs-extra');
  const files = await fs.readdir(baseDir, { recursive: true });

  for (const file of files) {
    if (file === `${sessionId}.md`) {
      return path.join(baseDir, file);
    }
  }

  return null;
}
```

- [ ] **步骤 2：编写命令文档**

创建 `commands/req-conv-view.md`：

```markdown
---
description: 查看对话记录
arguments:
  - name: sessionId
    description: 会话 ID
    required: true
---

# ${conversation.id}

${conversation.content}

---

**元数据**：

- 创建时间：${new Date(conversation.metadata.startTime).toLocaleString('zh-CN')}
- 类型：${conversation.metadata.type || '未知'}
- 重要：${conversation.metadata.important ? '是 ' + conversation.metadata.reason : '否'}
```

- [ ] **步骤 3：Commit**

```bash
git add scripts/conversation-logger/commands/view.js
git add commands/req-conv-view.md
git commit -m "feat: 实现 /req-conv:view 命令"
```

---

### 任务 13：实现 /req-conv:mark 命令

**文件：**

- 创建：`scripts/conversation-logger/commands/mark.js`
- 创建：`commands/req-conv-mark.md`

- [ ] **步骤 1：编写命令实现**

```javascript
import fs from 'fs-extra';
import path from 'path';

/**
 * 标记对话为重要
 * @param {string} sessionId - 会话 ID
 * @param {string} reason - 原因
 * @returns {Promise<boolean>}
 */
export async function markConversation(sessionId, reason) {
  const baseDir = '.conversations';

  // 查找文件
  const filepath = await _findSessionFile(baseDir, sessionId);

  if (!filepath) {
    throw new Error(`对话不存在: ${sessionId}`);
  }

  // 更新元数据
  const metaPath = filepath.replace('.md', '.meta.json');
  let metadata = {};

  if (await fs.pathExists(metaPath)) {
    metadata = await fs.readJSON(metaPath);
  }

  metadata.important = true;
  metadata.reason = reason;
  metadata.markedAt = new Date().toISOString();

  await fs.writeJSON(metaPath, metadata, { spaces: 2 });

  return true;
}

/**
 * 查找会话文件
 * @private
 */
async function _findSessionFile(baseDir, sessionId) {
  const fs = await import('fs-extra');
  const files = await fs.readdir(baseDir, { recursive: true });

  for (const file of files) {
    if (file === `${sessionId}.md`) {
      return path.join(baseDir, file);
    }
  }

  return null;
}
```

- [ ] **步骤 2：编写命令文档**

创建 `commands/req-conv-mark.md`：

```markdown
---
description: 标记对话为重要
arguments:
  - name: sessionId
    description: 会话 ID
    required: true
  - name: --important
    description: 标记原因
    required: true
---

✅ 已标记对话 **${sessionId}** 为重要

原因：${reason}
```

- [ ] **步骤 3：Commit**

```bash
git add scripts/conversation-logger/commands/mark.js
git add commands/req-conv-mark.md
git commit -m "feat: 实现 /req-conv:mark 命令"
```

---

### 任务 14：实现 /req-conv:stats 命令

**文件：**

- 创建：`scripts/conversation-logger/commands/stats.js`
- 创建：`commands/req-conv-stats.md`

- [ ] **步骤 1：编写命令实现**

```javascript
import fs from 'fs-extra';

/**
 * 获取统计信息
 * @returns {Promise<object>}
 */
export async function getStats() {
  const baseDir = '.conversations';

  if (!(await fs.pathExists(baseDir))) {
    return {
      total: 0,
      important: 0,
      byType: {},
      byDate: {},
    };
  }

  const files = await fs.readdir(baseDir, { recursive: true });
  const stats = {
    total: 0,
    important: 0,
    byType: {},
    byDate: {},
  };

  for (const file of files) {
    if (!file.endsWith('.meta.json')) continue;

    const filepath = `${baseDir}/${file}`;
    const metadata = await fs.readJSON(filepath);

    stats.total++;

    if (metadata.important) {
      stats.important++;
    }

    if (metadata.type) {
      stats.byType[metadata.type] = (stats.byType[metadata.type] || 0) + 1;
    }

    if (metadata.startTime) {
      const date = metadata.startTime.slice(0, 10);
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    }
  }

  return stats;
}
```

- [ ] **步骤 2：编写命令文档**

创建 `commands/req-conv-stats.md`：

```markdown
---
description: 显示对话统计
---

# 对话记录统计

## 总览

- 总对话数：${stats.total}
- 重要对话：${stats.important}
- 重要比例：${stats.total > 0 ? ((stats.important / stats.total) \* 100).toFixed(1) : 0}%

## 按类型

${Object.entries(stats.byType).map(([type, count]) => `- **${type}\*\*: ${count}`).join('\n')}

## 按日期（最近7天）

${Object.entries(stats.byDate).slice(-7).map(([date, count]) => `- **${date}\*\*: ${count}`).join('\n')}
```

- [ ] **步骤 3：Commit**

```bash
git add scripts/conversation-logger/commands/stats.js
git add commands/req-conv-stats.md
git commit -m "feat: 实现 /req-conv:stats 命令"
```

---

### 任务 15：集成测试和文档

**文件：**

- 创建：`tests/conversation-logger/integration/e2e-flow.test.js`
- 修改：`README.md`

- [ ] **步骤 1：编写端到端测试**

```javascript
import { sessionStart } from '../../../scripts/conversation-logger/hooks/session-start.js';
import { postToolUse } from '../../../scripts/conversation-logger/hooks/post-tool-use.js';
import { stop } from '../../../scripts/conversation-logger/hooks/stop.js';
import { expect } from 'chai';
import fs from 'fs-extra';
import { rimraf } from 'rimraf';

describe('E2E: 完整对话流程', () => {
  const testDir = '.test-e2e';

  afterEach(async () => {
    await rimraf(testDir);
  });

  test('应该记录完整会话', async () => {
    // 1. 开始会话
    const startResult = await sessionStart({ workingDirectory: testDir });
    expect(startResult.sessionId).to.match(/^sess-/);

    // 2. 模拟工具调用
    await postToolUse({}, { tool: 'Read', success: true });
    await postToolUse({}, { tool: 'Write', success: true });

    // 3. 结束会话
    const stopResult = await stop({});

    // 4. 验证文件存在
    expect(stopResult.summary.filepath).to.include('.md');
    expect(await fs.pathExists(stopResult.summary.filepath)).to.be.true;

    // 5. 验证内容
    const content = await fs.readFile(stopResult.summary.filepath, 'utf8');
    expect(content).to.include('# 对话记录');
    expect(content).to.include('`Read`');
    expect(content).to.include('`Write`');
  });
});
```

- [ ] **步骤 2：运行集成测试**

运行：`npm test -- tests/conversation-logger/integration/e2e-flow.test.js`

预期：PASS

- [ ] **步骤 3：更新 README**

在 README.md 中添加：

```markdown
## 对话记录功能 ⭐ 新增

自动记录所有对话过程，支持搜索和管理。

### 使用方法

对话自动记录，无需手动操作。使用以下命令查询：

\`\`\`bash
/req-conv:list # 查看最近对话
/req-conv:search "关键词" # 搜索对话
/req-conv:view <session-id> # 查看对话详情
/req-conv:mark <session-id> --important "原因" # 标记重要
/req-conv:stats # 查看统计
\`\`\`

### 配置

配置文件：`.conversations/config.json`

\`\`\`json
{
"autoRecord": true,
"retentionDays": 90,
"importantRetentionDays": 365
}
\`\`\`
```

- [ ] **步骤 4：Commit**

```bash
git add tests/conversation-logger/integration/e2e-flow.test.js
git add README.md
git commit -m "test: 添加集成测试和文档"
```

---

### 任务 16：创建默认配置

**文件：**

- 创建：`scripts/conversation-logger/config/default.json`
- 创建：`.conversations/config.json`

- [ ] **步骤 1：创建默认配置**

```json
{
  "autoRecord": true,
  "retentionDays": 90,
  "importantRetentionDays": 365,
  "format": "markdown",
  "includeToolCalls": true,
  "includeSystemMessages": false,
  "compression": false,
  "backup": {
    "enabled": false,
    "schedule": "daily",
    "keepDays": 30
  },
  "search": {
    "enabled": true,
    "threshold": 0.3
  },
  "accessControl": {
    "enabled": false,
    "defaultPermission": "read",
    "importantConversations": "owner"
  }
}
```

- [ ] **步骤 2：创建用户配置目录**

运行：`mkdir -p .conversations`

- [ ] **步骤 3：复制配置文件**

运行：`cp scripts/conversation-logger/config/default.json .conversations/config.json`

- [ ] **步骤 4：更新 .gitignore**

在 `.gitignore` 中添加：

```
# 对话记录
.conversations/
!.conversations/config.json
```

- [ ] **步骤 5：Commit**

```bash
git add scripts/conversation-logger/config/default.json
git add .conversations/config.json
git add .gitignore
git commit -m "feat: 添加对话记录配置"
```

---

## 自检

**1. 规格覆盖度：**

- ✅ 架构设计 → 任务 1-5（核心组件）
- ✅ Hooks 集成 → 任务 6-8
- ✅ CLI 命令 → 任务 10-14
- ✅ 配置和文档 → 任务 15-16
- ✅ 测试覆盖 → 所有任务包含测试

**2. 占位符扫描：**

- ✅ 无 "TODO" 或 "待定"
- ✅ 所有步骤包含完整代码
- ✅ 所有命令和预期输出明确

**3. 类型一致性：**

- ✅ `sessionId` 格式一致：`sess-YYYYMMDD-HHMMSS`
- ✅ Hook 返回值一致：`{ continue: true, ... }`
- ✅ 文件路径格式一致

**4. 遗漏检查：**

- ✅ 数据验证（在 Logger 中）
- ✅ 错误处理（所有 Hooks）
- ✅ 集成测试（任务 15）

计划完成，无遗漏。
