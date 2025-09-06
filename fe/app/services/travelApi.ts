import { TravelRequest, FlightSearchResponse } from '../models/http-model'

export class TravelApiService {
  private baseUrl = 'http://localhost:8000/api/v1'

  async streamTravelPlan(
    request: TravelRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/travel/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('Response body is not readable')
      }

      // 使用更标准的 SSE 处理方式
      await this.processSSEStream(response.body, onChunk, onComplete, onError)

    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error occurred'))
    }
  }

  private async processSSEStream(
    body: ReadableStream<Uint8Array>,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const reader = body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          // 处理剩余的buffer
          if (buffer.trim()) {
            this.processSSeLines(buffer, onChunk, onComplete, onError)
          }
          onComplete()
          break
        }

        // 解码数据并添加到buffer
        buffer += decoder.decode(value, { stream: true })

        // 按行处理SSE数据
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // 保留最后不完整的行

        for (const line of lines) {
          const processed = this.processSSeLines(line, onChunk, onComplete, onError)
          if (processed === 'done') {
            return // 收到完成信号，提前结束
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  private processSSeLines(
    line: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): 'done' | 'continue' {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      return 'continue' // 空行，继续处理
    }

    // 处理 SSE 格式的数据
    if (trimmedLine.startsWith('data: ')) {
      const data = trimmedLine.substring(6).trim()

      if (data === '[DONE]') {
        console.log('✅ Received DONE signal, completing stream')
        onComplete()
        return 'done'
      } else if (data.startsWith('[ERROR]')) {
        const errorMessage = data.substring(7).trim()
        console.error('❌ Received error signal:', errorMessage)
        onError(new Error(errorMessage))
        return 'done'
      } else if (data) {
        console.log('📝 Processing SSE data chunk:', data)
        onChunk(data)
      }
    } else if (trimmedLine.startsWith('event:') || trimmedLine.startsWith('id:') || trimmedLine.startsWith('retry:')) {
      // 忽略其他 SSE 字段
      console.log('ℹ️ SSE metadata:', trimmedLine)
    } else {
      // 处理非标准格式的数据（兼容性）
      console.log('📄 Processing raw data:', trimmedLine)
      onChunk(trimmedLine)
    }

    return 'continue'
  }

  async searchFlights(request: TravelRequest): Promise<FlightSearchResponse> {
    try {
      const params = new URLSearchParams({
        from_place: request.from_place,
        to_place: request.to_place,
        from_date: request.from_date,
        to_date: request.to_date,
        people_num: request.people_num.toString(),
        others: request.others
      })

      const response = await fetch(`${this.baseUrl}/travel/flight-search/?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: FlightSearchResponse = await response.json()
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

export const travelApiService = new TravelApiService()
