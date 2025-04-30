FROM python:3.11-slim

# Set workdir în container
WORKDIR /app

# Copiază și instalează dependințele
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiază restul codului
COPY app/ ./app

# Expune portul intern Flask
EXPOSE 5000

# Rulează aplicația Flask
ENV PYTHONPATH=/app
CMD ["python", "-m", "app"]
