FROM node:18-slim

# Install wget for health check
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia tutto inclusi i node_modules (pre-installati localmente)
COPY . .

# Crea directory necessarie
RUN mkdir -p data uploads logs && \
    chmod 755 data uploads logs

# Esponi porta 3001
EXPOSE 3001

# Avvia server
CMD ["node", "index.js"]
