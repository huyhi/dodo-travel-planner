import { TravelRequest } from '../models/http-model'
import { processSseDataChunk } from '../utils/textUtils'
import { SSEDataType } from '../models/constant'

/**
 * 纯 EventSource 实现的 SSE 服务
 * 注意：这需要后端支持 GET 请求的 SSE 端点
 */
export class SSEService {
  private baseUrl = 'http://localhost:8000/api/v1'
  private eventSource: EventSource | null = null

  /**
   * 使用 EventSource 进行 SSE 连接
   * 类似于你提供的示例代码
   */
  streamTravelPlanWithEventSource(
    request: TravelRequest,
    onChunk: (chunk: { text: string; sseDataType: SSEDataType }) => void,
    onChatComplete: () => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): void {
    try {
      // 构建查询参数
      const params = new URLSearchParams({
        from_place: request.from_place,
        to_place: request.to_place,
        from_date: request.from_date,
        to_date: request.to_date,
        people_num: request.people_num.toString(),
        others: request.others || ''
      })

      const url = `${this.baseUrl}/travel/chat?${params.toString()}`

      // 创建 EventSource 连接
      this.eventSource = new EventSource(url)

      // 监听消息事件 - 类似你的示例
      this.eventSource.onmessage = (event) => {
        console.log('📨 Received SSE message:', event.data)

        if (event.data === '[DONE]') {
          console.log('✅ Stream completed')
          this.closeConnection()
          onComplete()
        } else if (event.data.startsWith('[CHAT_DONE]')) {
          console.log('✅ Chat completed')
          onChatComplete()
        } else if (event.data.startsWith('[ERROR]')) {
          console.error('❌ Stream error:', event.data)
          this.closeConnection()
          onError(new Error(event.data.substring(7).trim()))
        } else {
          // 使用工具函数处理 SSE 数据块
          const processedData = processSseDataChunk(event.data) as { text: string; sseDataType: SSEDataType }
          onChunk(processedData)
        }
      }

      // 监听连接打开
      this.eventSource.onopen = (event) => {
        console.log('🔗 SSE connection opened')
      }

      // 监听连接错误
      this.eventSource.onerror = (event) => {
        console.error('💥 SSE connection error:', event)
        this.closeConnection()
        onError(new Error('SSE connection failed'))
      }

    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error occurred'))
    }
  }

  /**
   * 关闭 EventSource 连接
   */
  closeConnection(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      console.log('🔚 SSE connection closed')
    }
  }

  /**
   * 检查连接状态
   */
  getConnectionState(): number | null {
    return this.eventSource?.readyState || null
  }
}


export const sseService = new SSEService()
