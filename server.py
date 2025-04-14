from mcp.server.fastmcp import FastMCP

# 创建一个MCP服务器实例，命名为"Demo"
mcp = FastMCP("Demo")

# 定义一个工具：加法计算
@mcp.tool()
def add(a: int, b: int) -> int:
    """将两个数字相加"""
    return a + b

# 定义一个动态资源：个性化问候
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """获取个性化问候语"""
    return f"你好，{name}！"

# 定义一个提示：用户问候模板
@mcp.prompt()
def greet_user(name: str) -> str:
    """生成一个问候用户的提示模板"""
    return f"你好，{name}！今天我能如何帮助你？"

# 运行服务器
if __name__ == "__main__":
    mcp.run()