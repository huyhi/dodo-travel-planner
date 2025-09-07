'use client'

import React from 'react'
import { GithubOutlined, MailOutlined } from '@ant-design/icons'

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-info">
          <div className="footer-title">
            🦤 Dodo Travel Planner
          </div>
          <div className="footer-description">
            智能旅行规划助手 - 让每一次旅行都充满惊喜
          </div>
        </div>

        <div className="footer-links">
          <a
            href="https://github.com/huyhi/dodo-travel-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <GithubOutlined className="footer-icon" />
            <span>GitHub</span>
          </a>

          <a
            href="mailto:annhuny@gmail.com"
            className="footer-link"
          >
            <MailOutlined className="footer-icon" />
            <span>联系我们</span>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          © 2025 Dodo Travel Planner
        </div>
      </div>

      <style jsx>{`
        .app-footer {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 0 20px 0;
          margin-top: 60px;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 40px;
        }
        
        .footer-info {
          flex: 1;
        }
        
        .footer-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          color: white;
        }
        
        .footer-description {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          max-width: 400px;
        }
        
        .footer-links {
          display: flex;
          gap: 24px;
          align-items: center;
        }
        
        .footer-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .footer-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .footer-icon {
          font-size: 18px;
        }
        
        .footer-bottom {
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }
        
        .footer-copyright {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        @media (max-width: 768px) {
          .app-footer {
            padding: 32px 0 16px 0;
            margin-top: 40px;
          }
          
          .footer-content {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }
          
          .footer-info {
            text-align: center;
          }
          
          .footer-title {
            font-size: 20px;
          }
          
          .footer-description {
            font-size: 14px;
            max-width: none;
          }
          
          .footer-links {
            justify-content: center;
            flex-wrap: wrap;
            gap: 16px;
          }
          
          .footer-link {
            padding: 10px 14px;
            font-size: 14px;
          }
          
          .footer-icon {
            font-size: 16px;
          }
          
          .footer-bottom {
            margin-top: 24px;
            padding-top: 16px;
          }
          
          .footer-copyright {
            font-size: 12px;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
