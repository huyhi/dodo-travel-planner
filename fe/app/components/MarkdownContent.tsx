import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

interface MarkdownContentProps {
  content: string
  height?: string | number
}

export default ({ content, height }: MarkdownContentProps) => {
  const containerHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <>
      <div className="markdown-wrapper markdown-content-enhanced" style={{ height: containerHeight }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // 现代化自定义样式
            h1: ({ children }) => (
              <h1 className="md-h1">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="md-h2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="md-h3">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="md-p">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="md-ul">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="md-ol">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="md-li">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="md-blockquote">
                {children}
              </blockquote>
            ),
            code: ({ children, className }) => {
              const isInline = !className
              return isInline ? (
                <code className="md-inline-code">
                  {children}
                </code>
              ) : (
                <code className={className}>
                  {children}
                </code>
              )
            },
            pre: ({ children }) => (
              <pre className="md-pre">
                {children}
              </pre>
            ),
            table: ({ children }) => (
              <table className="md-table">
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th className="md-th">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="md-td">
                {children}
              </td>
            ),
            strong: ({ children }) => (
              <strong className="md-strong">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="md-em">
                {children}
              </em>
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <style jsx>{`
        .markdown-scroll-container {
          overflow-y: auto;
          overflow-x: hidden;
          border: 1px solid var(--border-color, #e0e0e0);
          border-radius: 12px;
          background: var(--card-background, #ffffff);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .markdown-scroll-container::-webkit-scrollbar {
          width: 8px;
        }

        .markdown-scroll-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }

        .markdown-scroll-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, var(--primary-color, #667eea), var(--secondary-color, #764ba2));
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .markdown-scroll-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, var(--secondary-color, #764ba2), var(--primary-color, #667eea));
          transform: scale(1.1);
        }

        .markdown-wrapper {
          font-family: var(--font-family-base);
          line-height: 1.7;
          color: var(--foreground);
          padding: 24px;
        }
        
        :global(.markdown-content-enhanced) {
          font-size: 16px;
        }
        
        :global(.md-h1) {
          color: var(--primary-color);
          border-bottom: 3px solid var(--primary-color);
          padding-bottom: 12px;
          margin: 32px 0 24px 0;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.3;
          position: relative;
        }
        
        :global(.md-h1):first-child {
          margin-top: 0;
        }
        
        :global(.md-h1)::before {
          content: '📍';
          margin-right: 12px;
          font-size: 24px;
        }
        
        :global(.md-h2) {
          color: var(--accent-color);
          border-left: 4px solid var(--accent-color);
          padding-left: 16px;
          margin: 28px 0 20px 0;
          font-size: 22px;
          font-weight: 600;
          line-height: 1.4;
          background: rgba(82, 196, 26, 0.05);
          padding: 12px 16px;
          border-radius: 8px;
        }
        
        :global(.md-h2)::before {
          content: '🎯';
          margin-right: 8px;
        }
        
        :global(.md-h3) {
          color: var(--warning-color);
          margin: 24px 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
          position: relative;
          padding-left: 24px;
        }
        
        :global(.md-h3)::before {
          content: '✨';
          position: absolute;
          left: 0;
          top: 0;
        }
        
        :global(.md-p) {
          margin-bottom: 16px;
          font-size: 16px;
          line-height: 1.7;
          color: var(--foreground);
        }
        
        :global(.md-ul),
        :global(.md-ol) {
          margin-bottom: 20px;
          padding-left: 32px;
        }
        
        :global(.md-li) {
          margin-bottom: 8px;
          font-size: 16px;
          line-height: 1.6;
          position: relative;
        }
        
        :global(.md-ul .md-li)::marker {
          content: '🔸';
        }
        
        :global(.md-blockquote) {
          border-left: 4px solid var(--primary-color);
          padding: 16px 20px;
          margin: 20px 0;
          background: linear-gradient(135deg, 
            rgba(102, 126, 234, 0.05) 0%, 
            rgba(118, 75, 162, 0.05) 100%);
          border-radius: 8px;
          font-style: italic;
          position: relative;
        }
        
        :global(.md-blockquote)::before {
          content: '💡';
          position: absolute;
          top: 16px;
          left: -12px;
          background: var(--card-background);
          padding: 4px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        :global(.md-blockquote p) {
          margin: 0;
          color: var(--primary-color);
          font-weight: 500;
        }
        
        :global(.md-inline-code) {
          background: rgba(102, 126, 234, 0.1);
          color: var(--primary-color);
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 14px;
          font-family: var(--font-family-mono);
          font-weight: 500;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        :global(.md-pre) {
          background: var(--card-background);
          border: 1px solid var(--border-color);
          padding: 20px;
          border-radius: 12px;
          overflow: auto;
          margin: 20px 0;
          font-size: 14px;
          font-family: var(--font-family-mono);
          line-height: 1.5;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }
        
        :global(.md-table) {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
          font-size: 15px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        :global(.md-th) {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          padding: 12px 16px;
          font-weight: 600;
          text-align: left;
          border: none;
        }
        
        :global(.md-td) {
          border: 1px solid var(--border-color);
          padding: 12px 16px;
          background: var(--card-background);
        }
        
        :global(.md-table tr:nth-child(even) .md-td) {
          background: rgba(102, 126, 234, 0.02);
        }
        
        :global(.md-strong) {
          color: var(--primary-color);
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        :global(.md-em) {
          color: var(--accent-color);
          font-style: italic;
          font-weight: 500;
        }
        
        /* Code highlighting improvements */
        :global(.md-pre code) {
          background: transparent !important;
          color: var(--foreground) !important;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .markdown-scroll-container {
            border-radius: 8px;
          }

          .markdown-wrapper {
            padding: 16px;
          }

          :global(.md-h1) {
            font-size: 24px;
            margin: 24px 0 20px 0;
          }
          
          :global(.md-h2) {
            font-size: 20px;
            margin: 20px 0 16px 0;
            padding: 10px 12px;
          }
          
          :global(.md-h3) {
            font-size: 17px;
            margin: 20px 0 12px 0;
          }
          
          :global(.md-ul),
          :global(.md-ol) {
            padding-left: 24px;
          }
          
          :global(.md-blockquote) {
            padding: 12px 16px;
            margin: 16px 0;
          }
          
          :global(.md-pre) {
            padding: 16px;
            font-size: 13px;
          }
          
          :global(.md-table) {
            font-size: 14px;
          }
          
          :global(.md-th),
          :global(.md-td) {
            padding: 8px 12px;
          }
        }
      `}</style>
    </>
  )
}