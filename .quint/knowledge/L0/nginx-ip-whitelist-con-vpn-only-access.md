---
scope: VPN-protected servers, progetti dove utenti legittimi sono sempre dietro VPN, richiede conoscenza network topology
kind: system
content_hash: 62abfc7c36ee10f15f0a1fe34bb95540
---

# Hypothesis: Nginx IP Whitelist con VPN-Only Access

Sfrutta il fatto che il server è dietro VPN - configura Nginx per servire /data/ solo a client connessi alla VPN:

1. **Nginx Geo-based ACL**:
   ```nginx
   # Definisci IP ranges della VPN
   geo $vpn_access {
       default 0;
       10.0.0.0/8 1;        # VPN internal network
       192.168.0.0/16 1;    # Private network
       172.16.0.0/12 1;     # Docker network
   }
   
   location /data/ {
       if ($vpn_access = 0) {
           return 403;
       }
       try_files $uri =404;
   }
   ```

2. **Data Update Process**: Rimane identico al corrente (manuale o via script SSH)

3. **Security Layer**: I file JSON sono tecnicamente fetchable ma solo da:
   - Client connessi alla VPN aziendale/universitaria
   - Localhost (per debugging)
   - Docker internal network

4. **Public Access**: Utenti esterni ricevono 403 Forbidden su /data/*

**Variante avanzata**: Combina con HTTP Referer check per consentire fetch solo se Referer è la dashboard stessa:
```nginx
if ($http_referer !~* "^https?://yourdomain.com") {
    return 403;
}
```

**Nota**: Referer check è bypassabile ma aggiunge un layer di defense-in-depth.

## Rationale
{"anomaly": "Public HTTP access to data files conflicts with security requirement, but VPN infrastructure is already in place", "approach": "Leverage existing VPN network boundary as security perimeter - data is HTTP-accessible but network-restricted", "alternatives_rejected": ["Public access with CORS (insufficient security)", "No restrictions (violates requirement)"]}