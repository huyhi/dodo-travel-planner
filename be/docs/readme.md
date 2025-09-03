# 🦤 Dudu 旅行规划

## Backend Setup

### A. 安装 UV 工具

[uv link](https://github.com/astral-sh/uv)

### B. 初始化 config 
```bash
# 🐍 进入后端目录
cd be

# 拷贝配置文件
cp aiq_workflow.example.yml aiq_workflow.yml

cp .env.example .env
```

执行以上两条 cp 命令后会得到两个文件，分别是 `aiq_workflow.yml` 和 `.env`

请分别修改 `aiq_workflow.yml` 中的阿里百炼 LLM API KEY 和 `.env` 文件中的 TAVILY_API_KEY

### C. 运行启动脚本 
(第一次执行会初始化虚拟环境和安装依赖 🏗️，可能会较慢)

```bash
chmod +x ./run.sh

# 🚀 启动服务
./run.sh 
```

### D. 打开浏览器访问

[http://localhost:8000/health](http://localhost:8000/health)

如果显示 "service up" 则代表后端 service 准备就绪  
