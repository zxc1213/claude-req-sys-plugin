import { ContentFormatter } from '../../../scripts/conversation-logger/core/formatter.js';
import { describe, test, expect } from 'vitest';

describe('ContentFormatter', () => {
  test('应该格式化单个事件为 Markdown', () => {
    const formatter = new ContentFormatter();
    const event = {
      type: 'user_message',
      timestamp: '2026-05-22T14:30:15Z',
      content: '新增功能',
    };

    const markdown = formatter.formatEvent(event);

    expect(markdown).toContain('[14:30:15]');
    expect(markdown).toContain('新增功能');
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

    expect(markdown).toContain('`Read: {"filepath":"package.json"}`');
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

    expect(doc).toContain('# 对话记录');
    expect(doc).toContain('sess-20260522-143000');
    expect(doc).toContain('测试');
    expect(doc).toContain('好的');
  });
});
