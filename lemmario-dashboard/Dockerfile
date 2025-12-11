# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze
RUN npm install

# Copia il resto dei file
COPY . .

# Build dell'applicazione Next.js
RUN npm run build

# Stage 2: Production con Nginx
FROM nginx:alpine

# Copia configurazione Nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file build da Next.js
COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html

# Esponi porta 9000
EXPOSE 9000

CMD ["nginx", "-g", "daemon off;"]
