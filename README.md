# SpeakFlow — AI 英语口语陪练

## 在线演示

- **Demo 视频**：待补充
- **在线体验**：待补充

## 项目简介

SpeakFlow 是一款基于 Web 的 AI 英语口语陪练应用。用户可以通过文字或语音与 AI 进行英语对话练习，AI 会以简单清晰的英语回复，并在需要时给出更自然的表达建议。

## 功能列表

- [x] 聊天界面（首页入口、对话页、消息气泡）
- [x] AI 英语对话（ModelScope 推理 API）
- [ ] 语音识别输入（Web Speech API）
- [ ] 语音朗读 AI 回复
- [x] 多场景练习（日常 / 面试 / 旅行）

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js 16 + React 19 | App Router，TypeScript |
| 样式 | Tailwind CSS 4 | 响应式 UI |
| AI 对话 | [ModelScope 推理 API](https://modelscope.cn/docs/model-service/API-Inference/intro) | Qwen 系列模型，OpenAI 兼容接口 |
| 语音 | Web Speech API | 浏览器原生语音识别与合成 |

## 第三方依赖说明

- **ModelScope（魔搭社区）**：用于 AI 对话推理，通过官方 API 调用。
- **Next.js / React / Tailwind**：开源前端框架，业务逻辑与 UI 为原创实现。
- **Web Speech API**：浏览器内置能力，用于语音输入与朗读。

## 本地运行

### 环境要求

- Node.js 18+
- npm 9+

### 步骤

```bash
git clone https://github.com/Ooo-Q/speakflow.git
cd speakflow
npm install
cp .env.example .env.local
# 编辑 .env.local，填入 ModelScope 访问令牌
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

令牌获取：[ModelScope 访问令牌](https://modelscope.cn/my/myaccesstoken)

## 项目结构

```
speakflow/
├── src/
│   ├── app/           # 页面与 API 路由（含 /api/chat）
│   ├── components/    # UI 组件
│   └── lib/           # ModelScope 调用与 Prompt
├── public/        # 静态资源
├── .env.example   # 环境变量模板
└── README.md
```

## License

MIT
