'use client'

import React from 'react'
import { Card, Typography, Spin, Alert, Empty, Tag, Divider } from 'antd'
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { FlightOption } from '../models/http-model'
import dayjs from 'dayjs'

const { Title, Text } = Typography

interface FlightInfoProps {
  flights: FlightOption[]
  loading: boolean
  error: string | null
}

export default function FlightInfo({ flights, loading, error }: FlightInfoProps) {
  const formatTime = (timeStr: string) => {
    return dayjs(timeStr).format('HH:mm')
  }

  const formatDate = (timeStr: string) => {
    return dayjs(timeStr).format('MM月DD日')
  }

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    return `${hours}小时${minutes}分钟`
  }

  const formatPrice = (price: number) => {
    return `¥${price.toFixed(0)}`
  }

  if (loading) {
    return (
      <Card className="flight-info-card">
        <div className="loading-container">
          <Spin size="large" />
          <div className="loading-text">正在搜索航班信息...</div>
        </div>
        <style jsx>{`
          .flight-info-card {
            height: 100%;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.08) !important;
            border: 1px solid rgba(102, 126, 234, 0.1) !important;
          }
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
          }
          .loading-text {
            margin-top: 16px;
            color: #666;
            font-size: 16px;
          }
        `}</style>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="flight-info-card">
        <Alert
          message="航班搜索失败"
          description={error}
          type="error"
          showIcon
        />
        <style jsx>{`
          .flight-info-card {
            height: 100%;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.08) !important;
            border: 1px solid rgba(102, 126, 234, 0.1) !important;
          }
        `}</style>
      </Card>
    )
  }

  if (!flights || flights.length === 0) {
    return (
      <Card className="flight-info-card">
        <Empty
          description="暂无航班信息"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <style jsx>{`
          .flight-info-card {
            height: 100%;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.08) !important;
            border: 1px solid rgba(102, 126, 234, 0.1) !important;
          }
        `}</style>
      </Card>
    )
  }

  return (
    <Card
      className="flight-info-card"
      title={
        <div className="flight-header">
          <span className="flight-icon">✈️</span>
          <Title level={4} style={{ margin: 0, color: '#667eea' }}>
            航班推荐
          </Title>
        </div>
      }
    >
      <div className="flights-list">
        {flights.map((flight, index) => (
          <div key={index} className="flight-item">
            <div className="flight-content">
              {/* 去程航班 */}
              <div className="flight-segment">
                <div className="segment-header">
                  <Tag color="blue">去程</Tag>
                  <div className="airline-info">
                    <img
                      src={flight.airline.logo}
                      alt={flight.airline.name}
                      className="airline-logo"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <Text className="flight-number">{flight.airline.code}{flight.airline.flight_no}</Text>
                    <Text className="airline-name">{flight.airline.name}</Text>
                  </div>
                  <Text className="segment-date">
                    {formatDate(flight.outbound.departure_time)}
                  </Text>
                </div>
                <div className="flight-route">
                  <div className="airport-info">
                    <div className="airport-code">{flight.outbound.departure_airport.code}</div>
                    <div className="airport-name">{flight.outbound.departure_airport.name}</div>
                    <div className="flight-time">{formatTime(flight.outbound.departure_time)}</div>
                  </div>
                  <div className="flight-path">
                    <div className="duration-info">
                      <ClockCircleOutlined />
                      <span>{formatDuration(flight.outbound.duration)}</span>
                    </div>
                    <div className="flight-line">
                      <div className="line"></div>
                      <EnvironmentOutlined className="plane-icon" />
                    </div>
                    {flight.stops === 0 && <Tag color="green">直飞</Tag>}
                  </div>
                  <div className="airport-info">
                    <div className="airport-code">{flight.outbound.arrival_airport.code}</div>
                    <div className="airport-name">{flight.outbound.arrival_airport.name}</div>
                    <div className="flight-time">{formatTime(flight.outbound.arrival_time)}</div>
                  </div>
                </div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              {/* 返程航班 */}
              <div className="flight-segment">
                <div className="segment-header">
                  <Tag color="orange">返程</Tag>
                  <div className="airline-info">
                    <img
                      src={flight.airline.logo}
                      alt={flight.airline.name}
                      className="airline-logo"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <Text className="flight-number">{flight.airline.code}{flight.airline.flight_no}</Text>
                    <Text className="airline-name">{flight.airline.name}</Text>
                  </div>
                  <Text className="segment-date">
                    {formatDate(flight.return.departure_time)}
                  </Text>
                </div>
                <div className="flight-route">
                  <div className="airport-info">
                    <div className="airport-code">{flight.return.departure_airport.code}</div>
                    <div className="airport-name">{flight.return.departure_airport.name}</div>
                    <div className="flight-time">{formatTime(flight.return.departure_time)}</div>
                  </div>
                  <div className="flight-path">
                    <div className="duration-info">
                      <ClockCircleOutlined />
                      <span>{formatDuration(flight.return.duration)}</span>
                    </div>
                    <div className="flight-line">
                      <div className="line"></div>
                      <EnvironmentOutlined className="plane-icon" />
                    </div>
                    {flight.stops === 0 && <Tag color="green">直飞</Tag>}
                  </div>
                  <div className="airport-info">
                    <div className="airport-code">{flight.return.arrival_airport.code}</div>
                    <div className="airport-name">{flight.return.arrival_airport.name}</div>
                    <div className="flight-time">{formatTime(flight.return.arrival_time)}</div>
                  </div>
                </div>
              </div>

              {/* 价格信息 */}
              <div className="price-section">
                <div className="price-main">
                  <span className="price-label">总价</span>
                  <span className="price-value">{formatPrice(flight.price.total)}</span>
                </div>
                <div className="price-details">
                  <Text type="secondary">
                    基础票价: {formatPrice(flight.price.base_fare)} + 税费: {formatPrice(flight.price.tax)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .flight-info-card {
          height: 100%;
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.08) !important;
          border: 1px solid rgba(102, 126, 234, 0.1) !important;
        }

        .flight-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .flight-icon {
          font-size: 20px;
        }

        .flights-list {
          max-height: 600px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .flights-list::-webkit-scrollbar {
          width: 6px;
        }

        .flights-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .flights-list::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .flights-list::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .flight-item {
          margin-bottom: 24px;
          padding: 20px;
          background: #fafbff;
          border-radius: 12px;
          border: 1px solid #e6f0ff;
          transition: all 0.3s ease;
        }

        .flight-item:hover {
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
          border-color: #667eea;
        }

        .flight-item:last-child {
          margin-bottom: 0;
        }

        .flight-segment {
          margin-bottom: 16px;
        }

        .segment-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .airline-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .airline-logo {
          width: 24px;
          height: 24px;
          object-fit: contain;
          border-radius: 4px;
        }

        .flight-number {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .airline-name {
          color: #666;
          font-size: 12px;
        }

        .segment-date {
          color: #666;
          font-size: 14px;
          margin-left: auto;
        }

        .flight-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .airport-info {
          flex: 1;
          text-align: center;
        }

        .airport-code {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 4px;
        }

        .airport-name {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          line-height: 1.2;
        }

        .flight-time {
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
        }

        .flight-path {
          flex: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .duration-info {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #666;
        }

        .flight-line {
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;
        }

        .line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 1px;
        }

        .plane-icon {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 2px;
          color: #667eea;
          font-size: 16px;
        }

        .price-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e6f0ff;
          text-align: center;
        }

        .price-main {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .price-label {
          font-size: 14px;
          color: #666;
        }

        .price-value {
          font-size: 24px;
          font-weight: bold;
          color: #f56565;
        }

        .price-details {
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .flight-route {
            flex-direction: column;
            gap: 12px;
          }

          .flight-path {
            order: -1;
            flex-direction: row;
            width: 100%;
          }

          .airport-info {
            flex: none;
          }

          .flights-list {
            max-height: 500px;
          }

          .flight-item {
            padding: 16px;
          }

          .segment-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .airline-info {
            width: 100%;
          }

          .segment-date {
            margin-left: 0;
            align-self: flex-end;
          }
        }
      `}</style>
    </Card>
  )
}
