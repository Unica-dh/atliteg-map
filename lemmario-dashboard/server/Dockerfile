FROM node:20-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze (production only)
RUN npm ci --production

# Copia il resto dei file
COPY . .

# Crea directory necessarie
RUN mkdir -p data uploads logs && \
    chmod 755 data uploads logs

# Esponi porta 3001
EXPOSE 3001

# Avvia server
CMD ["node", "index.js"]
