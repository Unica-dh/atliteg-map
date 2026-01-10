# Production image with pre-built files
FROM nginx:alpine

# Copia configurazione Nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file build da Next.js (pre-built locally)
COPY out /usr/share/nginx/html

# Esponi porta 9000
EXPOSE 9000

CMD ["nginx", "-g", "daemon off;"]
