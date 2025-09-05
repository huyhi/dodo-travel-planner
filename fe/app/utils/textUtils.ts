/**
 * 文本处理工具函数
 * 用于处理 SSE 流中的文本格式化问题
 */

/**
 * SSE chunk 数据结构
 */
interface SSEChunkData {
  text: string
  [key: string]: any // 允许其他可选字段
}

/**
 * 处理 SSE 数据块
 * 包含换行符处理和其他可能的文本清理
 */
export function processSseDataChunk(chunk: string): string {
  try {
    // 解析 JSON 字符串
    const parsedData: SSEChunkData = JSON.parse(chunk)

    // 验证是否包含 text 字段
    if (typeof parsedData !== 'object' || parsedData === null) {
      console.warn('Invalid chunk format: not an object', chunk)
      return ''
    }

    if (!('text' in parsedData)) {
      console.warn('Invalid chunk format: missing text field', chunk)
      return ''
    }

    return parsedData.text
  } catch (error) {
    console.error('Failed to parse SSE chunk as JSON:', error, 'Raw chunk:', chunk)
    // 如果 JSON 解析失败，返回原始字符串（去掉可能的前缀）
    return chunk.replace(/^data:\s*/, '').trim()
  }
}
