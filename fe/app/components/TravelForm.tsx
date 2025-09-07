'use client'

import React from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Typography,
  Row,
  Col,
} from 'antd'
import {
  EnvironmentOutlined,
  SendOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { TravelRequest } from '../models/http-model'
import styles from '../styling/TravelForm.module.css'

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
    <div className={styles.container}>
      <Card
        className={styles.card}
        styles={{ body: { padding: '48px' } }}
      >
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            开始规划您的旅程
          </Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
          className={styles.form}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={styles.label}>🏠 出发地点</span>}
                name="startLocation"
                rules={[{ required: true, message: '请输入出发地点' }]}
                className={styles.formItem}
              >
                <Input
                  prefix={<EnvironmentOutlined style={{ color: 'var(--primary-color)' }} />}
                  placeholder="例如：北京"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={styles.label}>🎯 目的地</span>}
                name="destination"
                rules={[{ required: true, message: '请输入目的地' }]}
                className={styles.formItem}
              >
                <Input
                  prefix={<EnvironmentOutlined style={{ color: 'var(--primary-color)' }} />}
                  placeholder="例如：京都"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={styles.label}>📅 出行日期</span>}
                name="dateRange"
                rules={[{ required: true, message: '请选择出行日期' }]}
                className={styles.formItem}
              >
                <RangePicker
                  placeholder={['出发日期', '返回日期']}
                  size="large"
                  style={{ width: '100%' }}
                  className={styles.datePicker}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className={styles.label}>👥 出行人数</span>}
                name="numberOfPeople"
                rules={[{ required: true, message: '请输入出行人数' }]}
                className={styles.formItem}
              >
                <InputNumber
                  placeholder="出行人数"
                  min={1}
                  max={20}
                  size="large"
                  style={{ width: '100%' }}
                  className={styles.numberInput}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span className={styles.label}>💭 需求及偏好</span>}
            name="specialRequirements"
            className={styles.formItem}
          >
            <TextArea
              placeholder="请描述您的特殊需求，如：预算范围、兴趣爱好、饮食要求、住宿偏好等..."
              rows={3}
              size="large"
              className={styles.textarea}
            />
          </Form.Item>

          <Form.Item className={styles.submitContainer}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              size="large"
              className={styles.submitButton}
            >
              🚀 开始规划我的旅程
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
