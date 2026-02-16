# 基于 Discord 角色的登录系统 (GitHub Pages 版)

该项目提供了一个独立的登录页面，使用 Discord 进行身份验证，并验证用户是否在特定的 Discord 服务器中拥有特定角色。此版本已适配，可直接部署在 GitHub Pages 等静态网站托管服务上。

## 功能特性

-   **纯前端登录**: 无需后端服务器，直接通过 Discord 的 Implicit Grant 流程进行验证。
-   **角色验证**: 仅向在您的 Discord 服务器中拥有特定角色的用户授予访问权限。
-   **磨砂玻璃 UI**: 一个现代、简洁的登录界面。
-   **部署简单**: 只需将文件上传到您的 GitHub Pages 仓库即可。

## 如何部署

### 1. 创建一个 Discord 应用

1.  前往 [Discord 开发者门户](https://discord.com/developers/applications)。
2.  点击 **"New Application"** (新建应用) 并为其命名。
3.  转到 **"OAuth2" -> "General"** (常规) 选项卡。
4.  复制 **"Client ID"** (客户端 ID)。
5.  **重要**: 点击 **"Add Redirect"** (添加重定向) 并添加您的 GitHub Pages 链接: `https://yeheei.github.io/233322/`。
6.  点击 **"Save Changes"** (保存更改)。

### 2. 查找您的服务器和角色 ID

1.  **在 Discord 中启用开发者模式**:
    -   转到 **用户设置 -> 高级**。
    -   启用 **"开发者模式"**。
2.  **查找服务器 ID (Guild ID)**:
    -   在您的服务器图标上右键单击，然后点击 **"Copy Server ID"** (复制服务器 ID)。
3.  **查找角色 ID**:
    -   转到 **服务器设置 -> 角色**，在您要用于验证的角色上右键单击，然后点击 **"Copy Role ID"** (复制角色 ID)。

### 3. 配置项目

1.  打开 `config.js` 文件。
2.  将 `'YOUR_DISCORD_CLIENT_ID'` 替换为您的 Discord 应用的客户端 ID。
3.  将 `'YOUR_DISCORD_SERVER_ID'` 替换为您的服务器 ID。
4.  将 `'YOUR_DISCORD_ROLE_ID'` 替换为角色 ID。
5.  确认 `redirectUri` 是 `'https://yeheei.github.io/233322/'`。

### 4. 上传到 GitHub

1.  将以下所有文件上传到您的 `yeheei.github.io` 仓库的 `233322` 目录下:
    -   `login.html` (或将其重命名为 `index.html` 作为默认页面)
    -   `login.css`
    -   `login.js`
    -   `config.js`
    -   `main.html`
2.  等待几分钟让 GitHub Pages 更新。
3.  访问 `https://yeheei.github.io/233322/` 即可看到登录页面。

### 工作原理 (纯前端)

1.  用户点击“使用 Discord 登录”按钮。
2.  他们被重定向到 Discord 授权页面。
3.  授权后，Discord 直接将他们重定向回您的 GitHub Pages 链接，并在 URL 的哈希(#)中附带一个 `access_token`。
4.  `login.js` 脚本从 URL 中捕获这个 `access_token`。
5.  脚本使用该令牌调用 Discord API，检查用户是否拥有指定服务器中的指定角色。
6.  如果验证通过，用户将被重定向到 `main.html`。
7.  如果失败，则会显示错误消息。
