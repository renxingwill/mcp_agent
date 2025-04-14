from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

# 定义服务器参数
server_params = StdioServerParameters(
    command="python",
    args=["server.py"],
)

# 异步运行客户端
async def run_client():
    # 使用stdio_client连接到服务器
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 初始化连接
            await session.initialize()

            # 列出可用提示
            prompts = await session.list_prompts()
            print("可用提示：", prompts)

            # 获取一个提示
            prompt = await session.get_prompt("greet_user", arguments={"name": "Alice"})
            print("提示响应：", prompt)

            # 列出可用资源
            resources = await session.list_resources()
            print("可用资源：", resources)

            # 读取一个资源
            content, mime_type = await session.read_resource("greeting://Bob")
            print("资源内容：", content, "MIME类型：", mime_type)

            # 列出可用工具
            tools = await session.list_tools()
            print("可用工具：", tools)

            # 调用一个工具
            result = await session.call_tool("add", arguments={"a": 3, "b": 5})
            print("工具结果：", result)

# 主程序入口
if __name__ == "__main__":
    asyncio.run(run_client())