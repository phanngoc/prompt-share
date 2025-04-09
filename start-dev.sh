#!/bin/bash

# Chạy backend
cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Backend đang chạy với PID: $BACKEND_PID"
echo "Backend URL: http://localhost:8000/api/v1"

# Đợi backend khởi động
sleep 3

# Chạy frontend
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "Frontend đang chạy với PID: $FRONTEND_PID"
echo "Frontend URL: http://localhost:3000"

# Xử lý khi nhận tín hiệu tắt (Ctrl+C)
function cleanup {
  echo "Đang dừng các processes..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

trap cleanup SIGINT

# Giữ script chạy
wait 