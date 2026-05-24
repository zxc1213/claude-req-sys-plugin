# 创建 Marketplace 仓库指南

## 步骤

### 1. 创建新的 GitHub 仓库

创建名为 `crs-marketplace` 的新仓库。

### 2. 创建目录结构

```bash
mkdir crs-marketplace
cd crs-marketplace
mkdir .claude-plugin
```

### 3. 复制配置文件

将 `marketplace-setup/` 目录下的文件复制到新仓库：

```bash
# 复制 marketplace.json
cp marketplace-setup/marketplace.json .claude-plugin/

# 复制 README.md
cp marketplace-setup/README.md ./
```

### 4. 初始化并推送

```bash
git init
git add .
git commit -m "feat: initial marketplace setup for crs"

# 添加远程仓库
git remote add origin https://github.com/zxc1213/crs-marketplace.git

# 推送到 GitHub
git push -u origin main
```

## 使用

### 用户安装

```bash
# 添加 marketplace（两种方式都可以）
/plugin marketplace add https://github.com/zxc1213/crs-marketplace.git
# 或
/plugin marketplace add zxc1213/crs-marketplace

# 安装插件
/plugin install crs/crs
```

### 更新 marketplace

当需要添加新插件或更新配置时：

1. 编辑 `.claude-plugin/marketplace.json`
2. 提交并推送到 GitHub
3. 用户运行 `/plugin marketplace update crs`

## 注意事项

- Marketplace 仓库只包含配置文件，不包含插件代码
- 插件代码在单独的仓库中（crs-plugin）
- marketplace.json 中的 `source.repo` 指向实际的插件仓库
