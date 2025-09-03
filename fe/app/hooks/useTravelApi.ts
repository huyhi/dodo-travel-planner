import { useState, useRef, useCallback } from 'react'
import { message } from 'antd'
import ApiService, { TravelRequest } from '../services/apiService'

export interface UseTravelApiReturn {
  loading: boolean
  streaming: boolean
  streamContent: string
  isCompleted: boolean
  sendTravelRequest: (requestData: TravelRequest) => Promise<void>
  stopStreaming: () => void
  resetPlan: () => void
}

/**
 * 自定义 Hook 用于管理旅行 API 请求
 */
export const useTravelApi = (): UseTravelApiReturn => {
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [streamContent, setStreamContent] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * 发送旅行请求
   */
  const sendTravelRequest = useCallback(async (requestData: TravelRequest) => {
    try {
      setLoading(true)
      setStreamContent('')
      setIsCompleted(false)

      // 创建新的 AbortController
      abortControllerRef.current = ApiService.createAbortController()

      // 验证请求数据
      const validationErrors = ApiService.validateRequestData(requestData)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }

      // 发送请求
      await ApiService.sendTravelRequest(
        requestData,
        // onChunk - 处理每个数据块
        (chunk: string) => {
          setStreamContent(prev => prev + chunk)
          setStreaming(true)
        },
        // onComplete - 完成时
        () => {
          setIsCompleted(true)
          setStreaming(false)
        },
        // onError - 错误处理
        (error: Error) => {
          console.error('Stream error:', error)
          message.error('请求失败: ' + error.message)
          setStreaming(false)
        },
        // signal - 取消信号
        abortControllerRef.current.signal
      )

    } catch (error: any) {
      if (error.name === 'AbortError') {
        message.info('请求已取消')
      } else {
        console.error('Request error:', error)
        message.error('请求失败: ' + error.message)
      }
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }, [])

  /**
   * 停止流式响应
   */
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setStreaming(false)
      setLoading(false)
    }
  }, [])

  /**
   * 重置计划
   */
  const resetPlan = useCallback(() => {
    setStreamContent('')
    setIsCompleted(false)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    loading,
    streaming,
    streamContent,
    isCompleted,
    sendTravelRequest,
    stopStreaming,
    resetPlan
  }
}
