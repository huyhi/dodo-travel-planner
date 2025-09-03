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
  Spin,
  Divider,
} from 'antd'
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SendOutlined,
  LoadingOutlined,
  StopOutlined,
} from '@ant-design/icons'
import Banner from './components/Banner'
import { useTravelApi } from './hooks/useTravelApi'
import { TravelRequest } from './services/apiService'
import dayjs from 'dayjs'

const { Title, Paragraph } = Typography
const { TextArea } = Input
const { RangePicker } = DatePicker

interface FormData {
  startLocation: string
  destination: string
  dateRange: any[]
  numberOfPeople: number
  specialRequirements: string
}

export default () => {
  const [form] = Form.useForm()
  const {
    loading,
    streaming,
    streamContent,
    isCompleted,
    sendTravelRequest,
    stopStreaming,
    resetPlan
  } = useTravelApi()

  const onFinish = async (values: FormData) => {
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

    await sendTravelRequest(requestData)
  }

  const handleResetPlan = () => {
    resetPlan()
    form.resetFields()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>

      <Banner />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 输入表单部分 */}
        <Card
          style={{ marginBottom: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          styles={{ body: { padding: '40px' } }}
        >
          <Title level={3} style={{ textAlign: 'center', marginBottom: '30px' }}>
            <EnvironmentOutlined /> 开始规划您的旅程
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="出发地点"
                  name="startLocation"
                  rules={[{ required: true, message: '请输入出发地点' }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="例如：北京"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="目的地"
                  name="destination"
                  rules={[{ required: true, message: '请输入目的地' }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="例如：京都"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="出行日期"
                  name="dateRange"
                  rules={[{ required: true, message: '请选择出行日期' }]}
                >
                  <RangePicker
                    prefix={<CalendarOutlined />}
                    placeholder={['出发日期', '返回日期']}
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="出行人数"
                  name="numberOfPeople"
                  rules={[{ required: true, message: '请输入出行人数' }]}
                >
                  <InputNumber
                    prefix={<UserOutlined />}
                    placeholder="出行人数"
                    min={1}
                    max={20}
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="特殊需求及偏好"
              name="specialRequirements"
            >
              <TextArea
                placeholder="请描述您的特殊需求，如：预算范围、兴趣爱好、饮食要求、住宿偏好等..."
                rows={4}
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center', marginTop: '30px' }}>
              <Space size="middle">
                {!streaming ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                    size="large"
                    style={{ minWidth: '120px' }}
                  >
                    {loading ? '连接中...' : '开始规划'}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={stopStreaming}
                    icon={<StopOutlined />}
                    size="large"
                    style={{ minWidth: '120px' }}
                    danger
                  >
                    停止生成
                  </Button>
                )}
                {(streamContent || isCompleted) && (
                  <Button
                    onClick={handleResetPlan}
                    size="large"
                  >
                    重新规划
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* 结果显示部分 */}
        {(streamContent || streaming) && (
          <Card
            style={{ marginTop: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            styles={{ body: { padding: '40px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Title level={3} style={{ margin: 0, flex: 1 }}>
                🤖 AI 旅行规划结果
              </Title>
              {streaming && (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />}
                  style={{ marginLeft: '10px' }}
                />
              )}
            </div>

            <Divider />

            <div
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e9ecef',
                minHeight: '200px',
                fontFamily: 'inherit',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}
            >
              {streamContent || '正在生成旅行计划...'}
              {streaming && (
                <span style={{
                  animation: 'blink 1s infinite',
                  color: '#1890ff',
                  fontSize: '16px'
                }}>
                  ▋
                </span>
              )}
            </div>

            {isCompleted && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Paragraph style={{ color: '#52c41a', margin: 0 }}>
                  ✅ 旅行规划已完成！
                </Paragraph>
              </div>
            )}
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
