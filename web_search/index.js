#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- 修复 1: 在 ES Module 中获取 __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// --- 修复 3: 增加文件存在性检查 ---
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  throw new Error(`❌ .env 文件未找到于路径: ${envPath}`);
}

// 加载环境变量
const result = dotenv.config({ path: envPath });

// 错误处理
if (result.error) {
  throw new Error(`
⚠️  环境变量加载失败 ⚠️
原因: ${result.error.message}
检查: 
  1. 文件路径: ${envPath}
  2. 文件内容格式 (应使用 KEY=VALUE 格式)
  3. 文件权限 (应至少 644)
`);
}

// 示例使用
console.log("✅ 环境变量加载成功");
console.log("当前环境API密钥:", process.env.GOOGLE_API_KEY);
console.log("API密钥CSE_ID:", process.env.CSE_ID);

// --- 后续其他业务代码 ---

const isValidSearchArgs = (args) =>
  typeof args === "object" &&
  args !== null &&
  typeof args.query === "string" &&
  (args.limit === undefined || typeof args.limit === "number");

class WebSearchServer {
  server;

  constructor() {
    this.server = new Server(
      {
        name: "web-search",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    this.setupToolHandlers();
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "search",
          description: "Search the web using Google API",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query",
              },
              limit: {
                type: "number",
                description: "Maximum number of results to return (default: 5)",
                minimum: 1,
                maximum: 10,
              },
            },
            required: ["query"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== "search") {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }
      if (!isValidSearchArgs(request.params.arguments)) {
        throw new McpError(ErrorCode.InvalidParams, "Invalid search arguments");
      }
      const query = request.params.arguments.query;
      const limit = Math.min(request.params.arguments.limit || 5, 10);
      try {
        const results = await this.performSearch(query, limit);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Search error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async performSearch(query, limit) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.CSE_ID;
    if (!apiKey || !cseId) {
      throw new Error("GOOGLE_API_KEY and CSE_ID must be set in .env file");
    }
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(
      query
    )}&num=${limit}`;
    const response = await axios.get(url);
    const data = response.data;
    if (data.items) {
      return data.items.map((item) => ({
        title: item.title,
        url: item.link,
        description: item.snippet,
      }));
    } else {
      return [];
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Web Search MCP server running on stdio");
  }
}

const server = new WebSearchServer();
server.run().catch(console.error);
