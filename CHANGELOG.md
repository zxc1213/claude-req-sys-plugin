# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2026-05-23

### Added

#### Superpowers 技能集成系统

- 完整的技能接口抽象层 (`skill-interface.js`)
- 5个技能适配器 (brainstorming, debugging, research, code-explorer, planning)
- 技能版本管理 (`skill-versions.json`)
- 技能健康检查 CLI (`claude-req-skill-health`)
- 降级策略支持 (template/manual/simulation/error)
- 集成测试套件 (36个测试用例)

#### 改进

- 调度器集成技能接口和适配器
- 路由器支持降级模式配置
- 技能状态缓存机制 (60秒 TTL)

### Technical Details

- 技能创建速度: < 100ms
- 计划生成速度: < 50ms
- 测试通过率: 100% (36/36)

## [Unreleased]

### Added

#### Superpowers 技能集成完成 (2026-05-22)

- **skill-interface.js**: 新增技能接口抽象层
  - `SkillInterface` 类 - 统一技能调用接口
  - `callSkill(skillName, params, options)` - 调用技能并处理降级
  - `checkSkillHealth(skillName)` - 检查单个技能健康状态
  - `getAllSkillsHealth()` - 获取所有技能健康状态
  - `handleFallback()` - 处理降级策略
  - 支持四种降级模式: template, manual, simulation, error
  - 技能状态缓存机制（60秒 TTL）

- **skill-adapters/**: 新增技能适配器系统
  - `base.js` - `BaseSkillAdapter` 基类
  - `brainstorming.js` - `BrainstormingAdapter` 头脑风暴适配器
  - `debugging.js` - `DebuggingAdapter` 系统化调试适配器
  - `research.js` - `ResearchAdapter` 信息收集适配器
  - `code-explorer.js` - `CodeExplorerAdapter` 代码探索适配器
  - `planning.js` - `PlanningAdapter` 实施规划适配器
  - `index.js` - `AdapterFactory` 工厂和索引
  - 适配器功能: 参数验证、预处理、模板生成、结果后处理

- **skill-versions.json**: 新增技能版本管理配置
  - 记录5个核心技能的版本要求
  - Claude Code 和 Superpowers 版本依赖
  - 技能兼容性状态追踪

- **tests/integration/skill-adapters.test.js**: 新增集成测试
  - 36个测试用例全部通过
  - 覆盖适配器、接口、路由、调度器集成
  - 测试性能指标: 适配器创建 <100ms, 计划生成 <50ms

### Changed

#### Superpowers 技能集成 (2026-05-22)

- **scheduler.js**: 集成 SkillInterface 和适配器系统
  - 添加 `initializeSkillInterface()` - 初始化技能接口和适配器
  - 添加 `executeSkill(skillName, params)` - 通过适配器执行技能
  - 添加 `getHealthSummary()` - 获取技能健康摘要
  - 添加 `checkSkillsHealth(skillChain)` - 检查技能链健康状态
  - 添加 `setFallbackMode(mode)` - 设置降级模式
  - 添加 `setFallbackEnabled(enabled)` - 启用/禁用降级
  - 添加 `clearSkillCache()` - 清除状态缓存
  - 修改为支持 baseDir 参数的延迟初始化单例模式

- **router.js**: 添加降级模式配置支持
  - 添加 `FALLBACK_MODES` 枚举
  - 为每个路由添加 `fallback` 配置
  - 添加 `getFallbackConfig(type)` - 获取降级配置
  - 添加 `getSkillFallbackMode(type, skillName)` - 获取技能降级模式
  - 添加 `isFallbackEnabled(type)` - 检查降级是否启用
  - 添加 `setFallbackMode(type, mode)` - 设置降级模式
  - 添加 `setSkillFallbackMode(type, skillName, mode)` - 设置技能降级模式

### Added

#### 技能健康检查系统 (2026-05-22)

- **skills-health.js**: 新增技能健康检查模块
  - `SkillsHealthChecker` 类 - 检查 Superpowers 技能的可用性和版本
  - `checkAllSkills()` - 检查所有依赖技能
  - `checkSkill(skill)` - 检查单个技能
  - `getSkillVersion(name)` - 获取技能版本号
  - `displayReport(results)` - 生成格式化的健康报告
  - `generateJsonReport(results)` - 生成 JSON 格式报告
  - 支持的技能: brainstorming, systematic-debugging, research, code-explorer, writing-plans

- **claude-req-skill-health**: 新增 CLI 命令
  - `--quiet, -q` - 仅显示摘要信息
  - `--json, -j` - 以 JSON 格式输出
  - `--help, -h` - 显示帮助信息
  - 自动检测项目基础目录
  - 按技能类别分组显示结果

- **package.json**: 添加新的 bin 命令入口
  - `claude-req-skill-health`: 技能健康检查命令

#### 需求文档跟踪 (2026-05-22)

- **document-tracker.js**: 新增文档跟踪模块
  - `scanDocuments(reqPath)` - 扫描需求目录中的文档
  - `trackDocuments(baseDir, reqPath)` - 自动更新元数据
  - `addDocument(baseDir, reqPath, docName, content)` - 添加文档并更新
  - `getDocumentSummary(reqPath)` - 获取文档变化摘要
  - 自动检测新文档并更新 meta.yaml
  - 新文档自动将状态从 open 更新为 in_progress

- **claude-req-track**: 新增 CLI 命令
  - 手动触发文档跟踪和元数据更新
  - 支持指定需求 ID 或当前目录

### Changed

#### ID 生成器重构 (2026-05-22)

- **id-generator.js**: 完全重构 ID 生成机制
  - 从序号格式改为日期格式: `PREFIX-YYYYMMDD-XXX`
  - 新增持久化存储: `.requirements/counters.json`
  - 每日独立计数器，避免跨天冲突
  - 支持 6 种需求类型: feature, bug, question, adjustment, refactor, tech-debt
  - 异步生成函数: `generate(type)` 返回 Promise

#### 存储路径修正 (2026-05-22)

- **storage.js**: 修正目录路径
  - 所有路径从 `requirements` 改为 `.requirements`
  - `createRequirementDir()` - 创建正确的隐藏目录
  - `readMeta()` / `writeMeta()` - 读写元数据到正确位置

- **processor.js**: 修正处理器路径配置
  - `requirementsDir` 使用 `.requirements` 而非 `requirements`
  - 添加 `await` 关键字调用异步 ID 生成器
  - 新增 `trackDocuments()` 方法 - 自动跟踪文档变化
  - 新增 `.claude-context.md` 创建 - 引导 Superpowers 技能文档保存

### Fixed

#### Bug 修复 (2026-05-22)

- **ID 重复生成问题**: 修复需求创建时重复生成 -0001 ID 的问题
  - 原因: 内存计数器无持久化
  - 解决: 使用 JSON 文件持久化每日计数器

- **文档路径错误**: 修复文档未保存到 .requirements 目录的问题
  - 原因: storage.js 使用错误的目录名
  - 解决: 统一使用 `.requirements` 隐藏目录

- **Superpowers 集成缺失**: 修复技能文档未按 req 规则保存的问题
  - 原因: 缺少技能文档保存指引
  - 解决: 创建 `.claude-context.md` 引导文档保存位置

- **元数据未实时更新**: 修复添加文档后 meta.yaml 未更新的问题
  - 原因: 缺少文档跟踪机制
  - 解决: 实现自动文档扫描和元数据更新

### Technical Notes

#### 架构改进

- 新增技能健康检查层，为技能抽象层做准备
- 文档跟踪系统支持 Superpowers 技能集成
- ID 生成器支持跨会话持久化

#### 依赖更新

- 新增依赖: `cli-table3` - 用于表格化输出

#### 文件变更

**新增文件**:

- `scripts/requirement-manager/utils/skills-health.js`
- `scripts/requirement-manager/utils/document-tracker.js`
- `bin/claude-req-skill-health.js`
- `bin/claude-req-track.js`
- `.requirements/counters.json`

**修改文件**:

- `scripts/requirement-manager/utils/id-generator.js` (完全重构)
- `scripts/requirement-manager/utils/storage.js` (路径修正)
- `scripts/requirement-manager/core/processor.js` (集成新功能)
- `package.json` (添加 bin 命令)

**需求文档**:

- `.requirements/features/FEAT-20260522-002/analysis.md`
- `.requirements/features/FEAT-20260522-002/plan.md`
- `.requirements/features/FEAT-20260522-003/design.md`
- `.requirements/features/FEAT-20260522-003/plan.md`
- `.requirements/features/FEAT-20260522-004/design.md`

---

## [0.6.0] - 2026-05-14

### Added

- 初始版本发布
- 需求管理系统核心功能
- 知识图谱集成
- Hooks 自动化
- CLI 命令工具集

---

## Links

- **GitHub Repository**: https://github.com/zxc1213/claude-req-sys
- **Issue Tracker**: https://github.com/zxc1213/claude-req-sys/issues
- **Documentation**: [README.md](README.md)

---

_本 CHANGELOG 遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 规范_
