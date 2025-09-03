// API 服务组件 - 管理所有 HTTP 请求
export interface TravelRequest {
  from_place: string
  to_place: string
  from_date: string
  to_date: string
  people_num: number
  others: string
}

export interface ApiResponse {
  success: boolean
  data?: any
  error?: string
}

export class ApiService {
  private static readonly BASE_URL = 'http://localhost:8000/api/v1'
  private static readonly TRAVEL_CHAT_ENDPOINT = '/travel/chat/'

  /**
   * 发送旅行规划请求并处理流式响应
   * @param requestData 旅行请求数据
   * @param onChunk 处理每个数据块的回调函数
   * @param onComplete 完成时的回调函数
   * @param onError 错误处理回调函数
   * @param signal 用于取消请求的 AbortSignal
   */
  static async sendTravelRequest(
    requestData: TravelRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}${this.TRAVEL_CHAT_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await this.handleStreamResponse(response, onChunk, onComplete, onError)
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // 请求被取消，不调用错误回调
        return
      }
      onError(error)
    }
  }

  /**
   * 处理流式响应
   * @param response 响应对象
   * @param onChunk 处理每个数据块的回调函数
   * @param onComplete 完成时的回调函数
   * @param onError 错误处理回调函数
   */
  private static async handleStreamResponse(
    response: Response,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('无法读取响应流')
    }

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          onComplete()
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        onChunk(chunk)
      }
    } catch (error: any) {
      onError(error)
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * 创建 AbortController 用于取消请求
   */
  static createAbortController(): AbortController {
    return new AbortController()
  }

  /**
   * 验证请求数据
   * @param requestData 请求数据
   */
  static validateRequestData(requestData: Partial<TravelRequest>): string[] {
    const errors: string[] = []

    if (!requestData.from_place?.trim()) {
      errors.push('出发地点不能为空')
    }

    if (!requestData.to_place?.trim()) {
      errors.push('目的地不能为空')
    }

    if (!requestData.from_date) {
      errors.push('出发日期不能为空')
    }

    if (!requestData.to_date) {
      errors.push('返回日期不能为空')
    }

    if (!requestData.people_num || requestData.people_num < 1) {
      errors.push('出行人数必须大于0')
    }

    return errors
  }
}

// 导出默认实例
export default ApiService
