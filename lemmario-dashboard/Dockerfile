# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze
RUN npm install

# Copia il resto dei file
COPY . .

# Argomenti di build per variabili ambiente
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_KEY

# Imposta variabili ambiente per il build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_KEY=${NEXT_PUBLIC_API_KEY}

# Build dell'applicazione Next.js
RUN npm run build

# Stage 2: Production con Nginx
FROM nginx:alpine

# Copia configurazione Nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file build da Next.js
COPY --from=builder /app/out /usr/share/nginx/html

# Esponi porta 9000
EXPOSE 9000

CMD ["nginx", "-g", "daemon off;"]
