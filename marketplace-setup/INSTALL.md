# CRS Plugin - Marketplace 安装指南

## 快速安装

### 1. 添加 Marketplace

```bash
/plugin marketplace add zxc1213/crs-marketplace
```

### 2. 安装插件

```bash
/plugin install crs/crs
```

## 验证安装

安装完成后，你应该能看到以下命令：

```bash
/req          # 需求管理主命令
/req-init     # 初始化需求系统
```

## 配置文件位置

插件安装后会在你的项目目录中创建：

```
your-project/
├── .requirements/          # 需求数据存储
├── .claude/
│   └── settings.json      # Claude Code 配置（可能需要手动配置 hooks）
```

## 可选：启用自动化 Hooks

编辑项目的 `.claude/settings.json`，添加以下配置以启用自动化功能：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "claude-req-update --auto"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "claude-req-summary"
          }
        ]
      }
    ]
  }
}
```

## 故障排除

### 安装失败

如果遇到 "unsupported source type" 错误：

1. 确保使用的是最新版本的 Claude Code
2. 尝试更新 marketplace：
   ```bash
   /plugin marketplace update crs
   ```

### 插件未生效

1. 检查插件是否已启用：
   ```bash
   /plugin list
   ```

2. 如果显示已禁用，启用它：
   ```bash
   /plugin enable crs@crs
   ```

## 更多信息

- [项目主页](https://github.com/zxc1213/crs-plugin)
- [完整文档](https://github.com/zxc1213/crs-plugin/blob/main/README.md)
