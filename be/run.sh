#!/bin/bash

export DASHSCOPE_API_KEY="sk-065440f2b80841dfaf247630120460ac"

# if .venv exists, use that env
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

echo "Syncing dependencies with uv..."

uv sync

echo "Starting FastAPI backend server..."

# Start the FastAPI server with uvicorn using uv
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

echo "Server stopped."
