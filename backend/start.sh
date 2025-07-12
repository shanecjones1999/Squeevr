#!/bin/bash

# Just run the backend in the foreground
uvicorn server:app --host 0.0.0.0 --port 8000
