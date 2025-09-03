'use client'

import React, { useRef } from 'react'
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
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
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
  const resultRef = useRef<HTMLDivElement>(null)
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

    // 立即滚动到结果显示区域
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)

    // 发送请求
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
        {(streamContent || streaming || loading) && (
          <Card
            ref={resultRef}
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
                lineHeight: '1.6'
              }}
            >
              {streamContent ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    // 自定义样式
                    h1: ({ children }) => (
                      <h1 style={{
                        color: '#1890ff',
                        borderBottom: '2px solid #1890ff',
                        paddingBottom: '8px',
                        marginBottom: '16px',
                        fontSize: '24px'
                      }}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 style={{
                        color: '#52c41a',
                        marginTop: '24px',
                        marginBottom: '12px',
                        fontSize: '20px'
                      }}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 style={{
                        color: '#fa8c16',
                        marginTop: '20px',
                        marginBottom: '10px',
                        fontSize: '18px'
                      }}>
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p style={{ marginBottom: '12px', fontSize: '16px' }}>
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li style={{ marginBottom: '6px', fontSize: '16px' }}>
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote style={{
                        borderLeft: '4px solid #1890ff',
                        paddingLeft: '16px',
                        margin: '16px 0',
                        backgroundColor: '#f0f8ff',
                        padding: '12px 16px',
                        borderRadius: '4px'
                      }}>
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className
                      return isInline ? (
                        <code style={{
                          backgroundColor: '#f5f5f5',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '14px',
                          fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                        }}>
                          {children}
                        </code>
                      ) : (
                        <code className={className}>
                          {children}
                        </code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre style={{
                        backgroundColor: '#f5f5f5',
                        padding: '16px',
                        borderRadius: '6px',
                        overflow: 'auto',
                        margin: '16px 0',
                        fontSize: '14px',
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                      }}>
                        {children}
                      </pre>
                    ),
                    table: ({ children }) => (
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '16px 0',
                        fontSize: '14px'
                      }}>
                        {children}
                      </table>
                    ),
                    th: ({ children }) => (
                      <th style={{
                        border: '1px solid #d9d9d9',
                        padding: '8px 12px',
                        backgroundColor: '#fafafa',
                        fontWeight: 'bold',
                        textAlign: 'left'
                      }}>
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td style={{
                        border: '1px solid #d9d9d9',
                        padding: '8px 12px'
                      }}>
                        {children}
                      </td>
                    ),
                    strong: ({ children }) => (
                      <strong style={{ color: '#1890ff', fontWeight: 'bold' }}>
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em style={{ color: '#52c41a', fontStyle: 'italic' }}>
                        {children}
                      </em>
                    )
                  }}
                >
                  {streamContent}
                </ReactMarkdown>
              ) : (
                <div style={{ fontSize: '16px', color: '#666' }}>
                  正在生成旅行计划...
                </div>
              )}
              {streaming && (
                <span style={{
                  animation: 'blink 1s infinite',
                  color: '#1890ff',
                  fontSize: '16px',
                  marginLeft: '4px'
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
