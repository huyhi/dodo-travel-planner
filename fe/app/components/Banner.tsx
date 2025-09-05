import { Typography } from 'antd'
import { RocketOutlined, GlobalOutlined, CompassOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default () => {
  return (
    <div className="banner-container">
      <div className="banner-background">
        <div className="banner-content">

          <Title level={1} className="banner-title">
            🦤 Dodo Bird 旅行规划助手🦤
          </Title>

          <div className="banner-features">
            <div className="feature-item">
              <CompassOutlined />
              <span>智能路线规划</span>
            </div>
            <div className="feature-item">
              <GlobalOutlined />
              <span>全球目的地</span>
            </div>
            <div className="feature-item">
              <RocketOutlined />
              <span>快速生成</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .banner-container {
          position: relative;
          overflow: hidden;
        }
        
        .banner-background {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
          padding: 60px 20px;
          text-align: center;
          color: white;
          position: relative;
        }
        
        .banner-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .banner-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .banner-icon-group {
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        
        .banner-icon {
          font-size: 32px;
          opacity: 0.9;
          animation: float 3s ease-in-out infinite;
        }
        
        .banner-icon.primary {
          animation-delay: 0s;
        }
        
        .banner-icon.secondary {
          animation-delay: 1s;
        }
        
        .banner-icon.tertiary {
          animation-delay: 2s;
        }
        
        .banner-title {
          color: white !important;
          margin: 0 0 16px 0 !important;
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
          animation: titleGlow 2s ease-in-out infinite alternate;
        }
        
        .banner-subtitle {
          color: rgba(255,255,255,0.9) !important;
          font-size: 1.1rem !important;
          margin-bottom: 32px !important;
          display: block;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        
        .banner-features {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 32px;
          flex-wrap: wrap;
        }
        
        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          font-weight: 500;
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        .feature-item:hover {
          opacity: 1;
          transform: translateY(-2px);
        }
        
        .feature-item :global(.anticon) {
          font-size: 20px;
          margin-bottom: 4px;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes titleGlow {
          0% { text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
          100% { text-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.1); }
        }
        
        @media (max-width: 768px) {
          .banner-background {
            padding: 40px 20px;
          }
          
          .banner-title {
            font-size: 2rem !important;
          }
          
          .banner-subtitle {
            font-size: 1rem !important;
          }
          
          .banner-features {
            gap: 24px;
          }
          
          .banner-icon-group {
            gap: 16px;
          }
          
          .banner-icon {
            font-size: 28px;
          }
        }
        
        @media (max-width: 480px) {
          .banner-features {
            flex-direction: column;
            gap: 16px;
          }
          
          .feature-item {
            flex-direction: row;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  )
}