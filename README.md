# CRS - 智能需求管理系统

智能需求管理与自动化执行系统，为 Claude Code 提供从需求到测试的全流程管理能力。

## ⚡ 快速开始

### Marketplace 安装（推荐）⭐

```bash
# 1. 添加 Marketplace
/plugin marketplace add zxc1213/crs-marketplace

# 2. 安装插件
/plugin install crs/crs

# 3. 开始使用
/r 添加新功能
```

**优势**：

- ✅ 集中管理，易于更新
- ✅ 支持版本控制
- ✅ 自动检查更新
- ✅ 符合 Claude Code 官方标准

**详细文档**：[Marketplace 安装指南](marketplace-setup/INSTALL.md)

### 直接安装（备选）

```bash
# 从 GitHub 直接安装
/plugin install https://github.com/zxc1213/crs-plugin
```

- 📋 **多类型支持**：新功能、Bug 修复、技术问题、需求调整、重构
- 🤖 **智能自动化**：集成 brainstorming、systematic-debugging 等 skills
- 🧭 **统一入口**⭐：智能路由到最优流程，无需手动选择
- 🎯 **科学优先级**⭐：多维度评估优先级，优化资源分配
- ✅ **质量门禁**⭐：4个关键阶段自动检查，确保交付质量
- 📄 **统一文档**⭐：5个文件简化为2个，维护成本降低70%
- 🔍 **向量知识图谱**⭐：语义搜索相似需求，智能推荐相关功能
- 📊 **可视化仪表板**：实时查看项目状态和进度
- 🔗 **关系图谱**：管理需求间的依赖和关联
- 🧠 **智能去重**：自动检测相似需求，避免重复工作
- 🔒 **安全过滤**：自动检测和脱敏敏感信息
- 🌳 **Git 集成**：自动创建分支、生成 commit message
- 📈 **持续升级**：自我评价和优化系统性能
- 👥 **团队协作**：支持多人协作和权限管理
- 💰 **成本优化**：智能控制 Token 使用
- ⚠️ **智能配置合并**：自动合并 settings.json，不覆盖现有配置

## 🔄 更新插件

```bash
/plugin update crs@crs
```

## 📝 卸载插件

```bash
/plugin remove crs@crs
```

## 使用

### 主命令（简短形式）⭐

```bash
/r 添加用户登录功能           # 创建新功能
/r --bug 登录页面异常        # Bug 报告
/r --question 性能优化       # 技术问题
/r --dashboard               # 查看仪表板
/r --list                    # 列出所有需求
```

### 原命令（仍然支持）

```bash
/req 添加用户登录功能        # 完整命令名
```

### 新增功能 ⭐

**向量知识图谱**：

```bash
kg-search "用户登录" 10      # 搜索相似需求（返回前10个）
kg-stats                     # 查看知识图谱统计信息
kg-connections REQ-001       # 查看需求的知识关联
kg-recommend                 # 智能推荐相关需求
kg-rebuild                   # 重建知识图谱索引
```

**优先级管理**：

```bash
/req:priority --list               # 查看所有需求的优先级排序
/req:priority REQ-001              # 评估单个需求的优先级
/req:priority --compare REQ-001 REQ-002  # 比较两个需求
```

**质量检查**：

```bash
/req:quality REQ-001              # 质量门禁检查（自动推断检查点）
/req:quality REQ-001 --gate 1     # 指定检查点（1-4）
/req:verify REQ-001               # 验证检查清单
```

**文档管理**：

```bash
/req:unify REQ-001          # 统一文档格式
/req:migrate REQ-001        # 文档迁移（带备份）
/req:test-plan REQ-001      # 生成测试计划
```

### 工作流程 ⭐ 更新

```bash
# 1. 创建需求（自动触发完整流程）
/req 添加用户头像上传功能
  → req-manager 智能路由
  → req-brainstorm 深度分析
  → req-priority 优先级评估
  → req-quality 质量检查
  → 生成 spec.md 统一文档

# 2. 查看需求
/req --list                    # 列出所有需求
/req --active                  # 当前活跃需求

# 3. 查看优先级
/req:priority --list               # 按优先级排序

# 4. 开始实现
# 自动进入 executing-plans

# 5. 需要修改？
# 在执行中提出变更，自动触发 req-change
```

## 📁 项目结构

```
crs/
├── .claude-plugin/             # 插件清单
│   └── plugin.json             # 插件配置文件
├── skills/                     # Skills（12个）
│   ├── core/                   # 核心需求管理
│   ├── quality/                # 质量保证
│   ├── analysis/               # 分析评估
│   ├── change/                 # 变更处理
│   └── utils/                  # 辅助工具
├── commands/                   # Commands（13个）
├── hooks/                      # Hooks 配置
│   └── hooks.json
├── scripts/                    # 核心脚本
│   ├── requirement-manager/    # 需求管理器
│   ├── knowledge-graph/        # 向量知识图谱
│   ├── hooks/                  # 自动化钩子
│   └── metrics/                # 度量收集
├── bin/                        # CLI 工具
├── tests/                      # 测试文件
├── README_PLUGIN.md            # 插件版本文档
├── INSTALL.md                  # 安装指南
└── package.json
```

### 项目本地目录（通用）

```
your-project/
├── .requirements/              # 需求数据（项目本地）
│   ├── features/               # 新功能
│   ├── bugs/                   # Bug 修复
│   ├── questions/              # 技术问题
│   ├── adjustments/            # 需求调整
│   └── refactorings/           # 重构任务
└── docs/                       # 项目文档（可选）
```

## 📚 文档

- [README_PLUGIN.md](README_PLUGIN.md) - 插件完整文档
- [INSTALL.md](INSTALL.md) - 插件安装指南
- [CLAUDE.md](CLAUDE.md) - Claude Code 项目指导
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - 项目结构说明

## 📋 版本

### 当前版本

**v0.7.1** - `main` 分支

### 最新特性

- ✅ **一键安装**：`/plugin install` 自动配置
- ✅ **自动生效**：无需手动操作
- ✅ **版本管理**：支持插件更新和版本控制
- ✅ **完整功能**：需求管理、知识图谱、质量门禁等

### 版本历史

**v0.7.1 - Marketplace 发布**
- ✅ 修复 hooks 配置变量格式
- ✅ 统一版本号为 0.7.1
- ✅ 添加 /r 简短命令别名

**v0.7.0 - 计划同步优化**

- ✅ 精简进度区块，移除冗余状态信息
- ✅ 验收标准章节自动同步功能
- ✅ 文档结构优化，消除重复

**v0.6.0 - 向量知识图谱**

- ✅ 向量知识图谱：基于 Fuse.js 实现语义搜索
- ✅ 智能相似度检测：自动发现相似需求
- ✅ 知识关联遍历：BFS 算法遍历需求关系网络
- ✅ CLI 工具集：kg-search、kg-stats、kg-connections、kg-recommend、kg-rebuild

详细版本历史请查看 [CHANGELOG.md](CHANGELOG.md)。

## 开发指南

### 快速开始

```bash
git clone https://github.com/zxc1213/crs-plugin.git
cd crs-plugin
npm install
```

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

````

### 代码规范

项目使用 **ESLint** 和 **Prettier** 确保代码质量：

```bash
# 检查代码规范
npm run lint

# 自动修复问题
npm run lint:fix

# 格式化代码
npm run format

# 检查格式
npm run format:check
````

### Git Hooks

项目配置了 **husky** 自动化Git钩子：

- **pre-commit**: 自动运行lint和测试
- **commit-msg**: 检查commit message格式

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### Commit Message 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` Bug修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构（既不是新功能也不是修复）
- `perf:` 性能优化
- `test:` 添加测试
- `chore:` 构建过程或辅助工具的变动

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- GitHub: [zxc1213/crs-plugin](https://github.com/zxc1213/crs-plugin)
- Issues: [GitHub Issues](https://github.com/zxc1213/crs-plugin/issues)

---

**享受使用 Claude Code 需求管理系统！** 🚀
