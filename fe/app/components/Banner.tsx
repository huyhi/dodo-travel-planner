import { Typography } from 'antd'
import { RocketOutlined } from '@ant-design/icons'

const { Title } = Typography

export default () => {
  return (
    <>
      {/* Banner部分 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <RocketOutlined style={{ fontSize: '48px', marginBottom: '20px' }} />
        <Title level={1} style={{ color: 'white', margin: '0 0 16px 0' }}>
          🦤 Dodo Bird 旅行规划助手 🦤
        </Title>
      </div>
    </>
  )
}