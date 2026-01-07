FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ ./src/

# Expose port for health checks (optional)
EXPOSE 8080

# Run agent
CMD ["python", "-m", "livekit.agents.cli", "start", "src.agent"]
