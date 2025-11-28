# Multi-stage build per ottimizzare dimensioni immagine

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze
RUN npm ci --legacy-peer-deps

# Copia source code
COPY . .

# Build produzione
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copia configurazione Nginx personalizzata
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copia build artifacts da stage precedente
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia dati CSV/GeoJSON
COPY --from=builder /app/public/data /usr/share/nginx/html/data

# Esponi porta 9000
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:9000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
