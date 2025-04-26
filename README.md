# MCP Agent 使用指南

## 目录

- [代码说明](#代码说明)
  - [核心组件](#核心组件)
  - [交互示例](#交互示例)
- [使用指南](#使用指南)
  - [准备工作](#准备工作)
  - [运行步骤](#运行步骤)
- [Web Search 功能](#web-search-功能)
  - [环境配置](#环境配置)
  - [项目配置](#项目配置)

## 代码说明

### 核心组件

#### 服务器参数 (StdioServerParameters)

- 指定了如何启动 server.py（通过 python server.py 命令）

#### 客户端会话 (ClientSession)

- 管理与服务器的连接
- 提供方法来列出提示、资源和工具
- 支持调用相关功能

### 交互示例

1. **获取提示**
   - 调用 `greet_user` 并传入 "Alice"

2. **读取资源**
   - 请求 `greeting://Bob`

3. **调用工具**
   - 使用 `add` 计算 3 + 5

4. **输出**
   - 客户端将打印服务器的响应，展示交互结果

## 使用指南

### 准备工作

1. 将服务器代码保存为 `server.py`
2. 将客户端代码保存为 `client.py`
3. 确保已安装 MCP（见"安装 MCP"部分）
4. 将两个文件放在同一目录下

### 运行步骤

1. **启动服务端**

   ```bash
   python server.py
   ```

2. **运行客户端**

   ```bash
   python client.py
   ```

## Web Search 功能

### 环境配置

#### Node.js 安装

1. 访问 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本（18.x+）
2. 安装配置：
   - 勾选 Add to PATH
   - 选择默认安装位置（C:\Program Files\nodejs\）
3. 验证安装：
   ```bash
   node -v
   npm -v
   ```

### 项目配置

1. **创建项目**

   ```bash
   # 新建项目目录
   mkdir web-search-tool
   cd web-search-tool

   # 初始化项目（全部按回车选默认）
   npm init -y

   # 安装依赖
   npm install @modelcontextprotocol/sdk axios dotenv
   ```

2. **配置 API 密钥**

   在项目目录的 `web_search` 文件夹下新建 `.env` 文件：

   ```plaintext
   GOOGLE_API_KEY="你的 API 密钥"
   CSE_ID="你的搜索引擎 ID"
   ```

   > 注意：右键文件 → 属性 → 取消"只读
