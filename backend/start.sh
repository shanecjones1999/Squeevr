#!/bin/bash

# Start backend in the background
uvicorn server:app --host 0.0.0.0 --port 8000 &

# Build and serve frontend
cd ../frontend
npm install
npm run build
npx serve -s build -l 3000