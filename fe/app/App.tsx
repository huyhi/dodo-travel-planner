'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Card, Spin, Alert, Row, Col } from 'antd'
import Banner from './components/Banner'
import TravelForm from './components/TravelForm'
import MarkdownContent from './components/MarkdownContent'
import FlightInfo from './components/FlightInfo'
import { TravelRequest, FlightOption } from './models/http-model'
import { sseService } from './services/sseService'
import { travelApiService } from './services/travelApi'
import dayjs from 'dayjs'
import { SSEDataType } from './models/constant'

interface FormData {
  startLocation: string
  destination: string
  dateRange: any[]
  numberOfPeople: number
  specialRequirements: string
}

export default () => {
  const resultRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [travelPlan, setTravelPlan] = useState('')
  const [mapVis, setMapVis] = useState('')

  const [error, setError] = useState<string | null>(null)

  // 航班相关状态
  const [flights, setFlights] = useState<FlightOption[]>([])
  const [flightLoading, setFlightLoading] = useState(false)
  const [flightError, setFlightError] = useState<string | null>(null)

  // 组件卸载时关闭 EventSource 连接
  useEffect(() => {
    return () => {
      sseService.closeConnection()
    }
  }, [])

  const onFinish = async (values: FormData) => {
    // 重置状态
    setIsLoading(true)
    setTravelPlan('')
    setError(null)
    setFlightLoading(true)
    setFlights([])
    setFlightError(null)

    // 先关闭之前的 EventSource 连接
    sseService.closeConnection()

    // 格式化日期
    const fromDate = values.dateRange[0] ? dayjs(values.dateRange[0]).format('YYYY-MM-DD') : ''
    const toDate = values.dateRange[1] ? dayjs(values.dateRange[1]).format('YYYY-MM-DD') : ''

    // 构建请求数据
    const requestData: TravelRequest = {
      from_place: values.startLocation,
      to_place: values.destination,
      from_date: fromDate,
      to_date: toDate,
      people_num: values.numberOfPeople,
      others: values.specialRequirements || ''
    }

    // 立即滚动到结果显示区域
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)

    // 并行执行旅行计划生成和航班搜索
    try {
      // 启动旅行计划生成
      sseService.streamTravelPlanWithEventSource(
        requestData,
        (chunk: { text: string; sseDataType: SSEDataType }) => {
          // 使用高级文本处理功能
          setTravelPlan(prev => `${prev}${chunk.text}`)
          switch (chunk.sseDataType) {
            case SSEDataType.CHAT_TEXT:
              setTravelPlan(prev => `${prev}${chunk.text}`)
              break
            case SSEDataType.MAP_VIS:
              setMapVis(prev => `${prev}${chunk.text}`)
              break
          }
        },
        () => {
          setIsLoading(false)
        },
        (error: Error) => {
          setError(error.message)
          setIsLoading(false)
        }
      )

      // 并行搜索航班
      try {
        const flightResponse = await travelApiService.searchFlights(requestData)
        if (flightResponse.code === 0) {
          setFlights(flightResponse.data)
        } else {
          setFlightError(flightResponse.message || '航班搜索失败')
        }
      } catch (flightErr) {
        setFlightError(flightErr instanceof Error ? flightErr.message : '航班搜索发生未知错误')
      } finally {
        setFlightLoading(false)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误')
      setIsLoading(false)
      setFlightLoading(false)
    }
  }


  return (
    <div className="app-container">
      <Banner />

      <main className="main-content">
        <TravelForm onFinish={onFinish} />

        {(isLoading || travelPlan || error || flightLoading || flights.length > 0 || flightError) && (
          <div ref={resultRef} className="result-section">
            <Row gutter={[24, 24]}>
              {/* 左侧：AI建议 */}
              <Col xs={24} lg={12}>
                <Card className="result-card" styles={{ body: { padding: '32px' } }}>
                  <div className="result-header">
                    <div className="result-icon">🗺️</div>
                    <div className="result-title">AI 旅行建议</div>
                  </div>

                  {error && (
                    <Alert
                      message="生成旅行计划时发生错误"
                      description={error}
                      type="error"
                      showIcon
                      className="error-alert"
                    />
                  )}

                  {isLoading && (
                    <div className="loading-container">
                      <div className="loading-animation">
                        <Spin size="large" />
                      </div>
                      <div className="loading-text">
                        正在为您生成专属旅行计划，请稍候...
                        <span className="typing-cursor">|</span>
                      </div>
                      <div className="loading-steps">
                        <div className="step active">🔍 分析您的需求</div>
                        <div className="step active">🌍 搜索最佳路线</div>
                        <div className="step active">✨ 生成个性化方案</div>
                      </div>
                    </div>
                  )}

                  {travelPlan && (
                    <div className="travel-plan-content">
                      <MarkdownContent content={travelPlan} />
                      {isLoading && (
                        <div className="streaming-cursor" />
                      )}
                    </div>
                  )}
                </Card>
              </Col>

              {/* 右侧：航班信息 */}
              <Col xs={24} lg={12}>
                <FlightInfo
                  flights={flights}
                  loading={flightLoading}
                  error={flightError}
                />
              </Col>
            </Row>
          </div>
        )}
      </main>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: var(--background);
        }
        
        .main-content {
          padding: 40px 0 80px 0;
          background: var(--background);
        }
        
        .result-section {
          max-width: 1400px;
          margin: 40px auto 0;
          padding: 0 20px;
        }
        
        .result-card {
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.08) !important;
          border: 1px solid rgba(102, 126, 234, 0.1) !important;
          background: var(--card-background) !important;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .result-card:hover {
          box-shadow: 0 12px 48px rgba(102, 126, 234, 0.12) !important;
        }
        
        .result-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .result-icon {
          font-size: 36px;
          margin-bottom: 0.5rem;
          display: inline-block;
          animation: bounce 2s ease-in-out infinite;
        }
        
        .result-title {
          margin: 0 !important;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700 !important;
          font-size: 20px;
        }
        
        .result-description {
          color: #666;
          font-size: 16px;
          margin: 1rem 0 0 0;
          line-height: 1.6;
        }
        
        .error-alert {
          border-radius: 8px !important;
          margin-bottom: 24px !important;
        }
        
        .loading-container {
          text-align: center;
          padding: 1rem 0;
        }
        
        .loading-animation {
          margin-bottom: 24px;
        }
        
        .loading-animation :global(.ant-spin-dot) {
          font-size: 32px !important;
        }
        
        .loading-animation :global(.ant-spin-dot-item) {
          background-color: #667eea !important;
        }
        
        .loading-text {
          font-size: 18px;
          color: #666;
          margin-bottom: 32px;
          font-weight: 500;
        }
        
        .loading-steps {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .step {
          padding: 12px 20px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 20px;
          color: #667eea;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid rgba(102, 126, 234, 0.2);
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        
        .step.active {
          opacity: 1;
          background: rgba(102, 126, 234, 0.15);
          transform: scale(1.05);
        }
        
        .travel-plan-content {
          background: var(--card-background);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);
          position: relative;
          max-height: 600px;
          overflow-y: auto;
        }

        .travel-plan-content::-webkit-scrollbar {
          width: 6px;
        }

        .travel-plan-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .travel-plan-content::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .travel-plan-content::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        .streaming-cursor {
          display: inline-block;
          width: 3px;
          height: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          animation: blink 1s infinite;
          margin-left: 4px;
          border-radius: 2px;
        }
        
        .typing-cursor {
          animation: blink 1s infinite;
          font-weight: bold;
          color: #667eea;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @media (max-width: 768px) {
          .main-content {
            padding: 24px 0 60px 0;
          }
          
          .result-section {
            margin-top: 24px;
            padding: 0 16px;
          }
          
          .result-icon {
            font-size: 36px;
          }
          
          .loading-container {
            padding: 1rem 0;
          }
          
          .loading-steps {
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          
          .travel-plan-content {
            padding: 24px;
          }
        }
      `}</style>
    </div >
  )
}
