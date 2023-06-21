import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

// OpenAI APIのクライアントを作成します。
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

// 重要！runtimeをedgeに設定します。
export const runtime = 'edge'

export async function POST(req: Request) {
  // リクエストの本文から`messages`を抽出します。
  const { messages } = await req.json()

// プロンプトを指定してOpenAIにストリーミングチャット補完を要求します。
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages
  })
  // 応答をフレンドリーなテキストストリームに変換します。
  const stream = OpenAIStream(response)
  // ストリームで応答します。
  return new StreamingTextResponse(stream)
}