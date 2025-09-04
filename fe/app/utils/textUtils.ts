/**
 * 文本处理工具函数
 * 用于处理 SSE 流中的文本格式化问题
 */

/**
 * 标准化换行符
 * 将各种换行符格式统一转换为 \n
 */
export function normalizeLineBreaks(text: string): string {
  return text
    // 处理转义的换行符 "\\n" -> "\n"
    .replace(/\\n/g, '\n')
    // 处理 Windows 换行符 "\r\n" -> "\n"
    .replace(/\r\n/g, '\n')
    // 处理 Mac 换行符 "\r" -> "\n"
    .replace(/\r/g, '\n')
}

/**
 * 处理 SSE 数据块
 * 包含换行符处理和其他可能的文本清理
 */
export function processSSEChunk(chunk: string): string {
  let processed = chunk

  // 标准化换行符
  processed = normalizeLineBreaks(processed)

  // 移除可能的控制字符（保留换行符和制表符）
  processed = processed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // 处理可能的 JSON 转义字符
  processed = processed.replace(/\\"/g, '"')
  processed = processed.replace(/\\'/g, "'")
  processed = processed.replace(/\\\\/g, '\\')

  return processed
}

/**
 * 确保 Markdown 格式正确
 * 处理常见的 Markdown 格式问题
 */
export function ensureMarkdownFormat(text: string): string {
  let formatted = text

  // 确保标题前后有适当的空行
  formatted = formatted.replace(/([^\n])(\n#{1,6}\s)/g, '$1\n$2')
  formatted = formatted.replace(/(#{1,6}[^\n]*\n)([^\n#])/g, '$1\n$2')

  // 确保列表项格式正确
  formatted = formatted.replace(/([^\n])(\n[-*+]\s)/g, '$1\n$2')

  // 确保代码块格式正确
  formatted = formatted.replace(/([^\n])(\n```)/g, '$1\n$2')
  formatted = formatted.replace(/(```[^\n]*\n)([^`])/g, '$1\n$2')

  return formatted
}

/**
 * 实时流式文本处理
 * 用于在 SSE 流式传输过程中处理文本
 */
export function processStreamingText(
  newChunk: string,
  existingText: string = ''
): string {
  // 处理新的数据块
  const processedChunk = processSSEChunk(newChunk)

  // 拼接文本
  const combinedText = existingText + processedChunk

  // 可选：对完整文本进行 Markdown 格式化
  // return ensureMarkdownFormat(combinedText)

  return combinedText
}
