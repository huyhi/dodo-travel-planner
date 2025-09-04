'use client'

import React from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Space,
  Typography,
  Row,
  Col,
} from 'antd'
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SendOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { TravelRequest } from '../models/http-model'

const { Title } = Typography
const { TextArea } = Input
const { RangePicker } = DatePicker

interface FormData {
  startLocation: string
  destination: string
  dateRange: any[]
  numberOfPeople: number
  specialRequirements: string
}

interface TravelFormProps {
  onFinish: (values: FormData) => void
}

export default function TravelForm({ onFinish }: TravelFormProps) {
  const [form] = Form.useForm()

  const handleFinish = async (values: FormData) => {
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

    // 调用父组件传入的 onFinish 回调
    onFinish(values)
  }

  return (
    <div className="travel-form-container">
      <Card
        className="travel-form-card"
        styles={{ body: { padding: '48px' } }}
      >
        <div className="form-header">
          <Title level={2} className="form-title">
            开始规划您的旅程
          </Title>
          <p className="form-description">
            填写下方信息，我们将为您生成个性化的旅行计划
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
          className="travel-form"
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="form-label">🏠 出发地点</span>}
                name="startLocation"
                rules={[{ required: true, message: '请输入出发地点' }]}
                className="form-item"
              >
                <Input
                  prefix={<EnvironmentOutlined style={{ color: '#667eea' }} />}
                  placeholder="例如：北京"
                  size="large"
                  className="form-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="form-label">🎯 目的地</span>}
                name="destination"
                rules={[{ required: true, message: '请输入目的地' }]}
                className="form-item"
              >
                <Input
                  prefix={<EnvironmentOutlined style={{ color: '#667eea' }} />}
                  placeholder="例如：京都"
                  size="large"
                  className="form-input"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="form-label">📅 出行日期</span>}
                name="dateRange"
                rules={[{ required: true, message: '请选择出行日期' }]}
                className="form-item"
              >
                <RangePicker
                  placeholder={['出发日期', '返回日期']}
                  size="large"
                  style={{ width: '100%' }}
                  className="form-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="form-label">👥 出行人数</span>}
                name="numberOfPeople"
                rules={[{ required: true, message: '请输入出行人数' }]}
                className="form-item"
              >
                <InputNumber
                  placeholder="出行人数"
                  min={1}
                  max={20}
                  size="large"
                  style={{ width: '100%' }}
                  className="form-input"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span className="form-label">💭 特殊需求及偏好</span>}
            name="specialRequirements"
            className="form-item"
          >
            <TextArea
              placeholder="请描述您的特殊需求，如：预算范围、兴趣爱好、饮食要求、住宿偏好等..."
              rows={4}
              size="large"
              className="form-textarea"
            />
          </Form.Item>

          <Form.Item className="form-submit">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              size="large"
              className="submit-button"
            >
              🚀 开始规划我的旅程
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <style jsx>{`
        .travel-form-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .travel-form-card {
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.08) !important;
          border: 1px solid rgba(102, 126, 234, 0.1) !important;
          background: var(--card-background) !important;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .travel-form-card:hover {
          box-shadow: 0 12px 48px rgba(102, 126, 234, 0.12) !important;
          transform: translateY(-2px);
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }
        
        .form-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-size: 24px;
          margin-bottom: 16px;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
        
        .form-title {
          margin: 0 !important;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700 !important;
        }
        
        .form-description {
          color: #666;
          font-size: 16px;
          margin: 16px 0 0 0;
          line-height: 1.6;
        }
        
        :global(.travel-form .form-item) {
          margin-bottom: 24px !important;
        }
        
        :global(.travel-form .form-label) {
          font-weight: 600;
          font-size: 16px;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        :global(.travel-form .form-input) {
          border-radius: 8px !important;
          border: 2px solid #e1e5e9 !important;
          transition: all 0.3s ease !important;
        }
        
        :global(.travel-form .form-input:hover) {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
        }
        
        :global(.travel-form .form-input:focus),
        :global(.travel-form .form-input.ant-input-focused) {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15) !important;
        }
        
        :global(.travel-form .form-textarea) {
          border-radius: 8px !important;
          border: 2px solid #e1e5e9 !important;
          transition: all 0.3s ease !important;
        }
        
        :global(.travel-form .form-textarea:hover) {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
        }
        
        :global(.travel-form .form-textarea:focus),
        :global(.travel-form .form-textarea.ant-input-focused) {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15) !important;
        }
        
        :global(.travel-form .ant-picker) {
          border-radius: 8px !important;
          border: 2px solid #e1e5e9 !important;
          transition: all 0.3s ease !important;
        }
        
        :global(.travel-form .ant-picker:hover) {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
        }
        
        :global(.travel-form .ant-picker.ant-picker-focused) {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15) !important;
        }
        
        :global(.travel-form .ant-input-number) {
          border-radius: 8px !important;
          border: 2px solid #e1e5e9 !important;
          transition: all 0.3s ease !important;
        }
        
        :global(.travel-form .ant-input-number:hover) {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
        }
        
        :global(.travel-form .ant-input-number.ant-input-number-focused) {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15) !important;
        }
        
        .form-submit {
          text-align: center !important;
          margin-top: 40px !important;
        }
        
        :global(.submit-button) {
          background: linear-gradient(135deg, #667eea, #764ba2) !important;
          border: none !important;
          border-radius: 12px !important;
          height: 48px !important;
          padding: 0 32px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          min-width: 200px !important;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3) !important;
          transition: all 0.3s ease !important;
        }
        
        :global(.submit-button:hover) {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4) !important;
          background: linear-gradient(135deg, #5a6fd8, #6b4190) !important;
        }
        
        :global(.submit-button:active) {
          transform: translateY(0) !important;
        }
        
        @media (max-width: 768px) {
          .travel-form-container {
            padding: 0 16px;
          }
          
          .form-header {
            margin-bottom: 32px;
          }
          
          .form-icon {
            width: 56px;
            height: 56px;
            font-size: 20px;
          }
          
          :global(.submit-button) {
            width: 100% !important;
            min-width: auto !important;
          }
        }
      `}</style>
    </div>
  )
}
