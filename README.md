# MCP Agent 使用指南

## 代码说明

### 核心组件

- **服务器参数 (StdioServerParameters)**: 指定了如何启动 server.py（通过 python server.py 命令）
- **客户端会话 (ClientSession)**: 管理与服务器的连接，并提供方法来列出提示、资源和工具，以及调用它们

### 交互示例

1. **获取提示**: 调用 greet_user 并传入"Alice"
2. **读取资源**: 请求 greeting://Bob
3. **调用工具**: 使用 add 计算 3 + 5
4. **输出**: 客户端将打印服务器的响应，展示交互结果

## 如何使用

### 准备工作

1. 将服务器代码保存为 server.py
2. 将客户端代码保存为 client.py
3. 确保已安装 MCP（见"安装 MCP"部分）
4. 将两个文件放在同一目录下

### 运行步骤

新建终端，运行服务端：

```bash
python server.py
```

运行客户端：

```bash
python client.py
```
