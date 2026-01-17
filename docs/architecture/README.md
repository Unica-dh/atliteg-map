# Architecture Documentation

**Versione**: 2.0  
**Ultima Modifica**: 17 Gennaio 2026  
**Stato**: Aggiornato

This directory contains architectural documentation for the AtLiTeG Map project.

## Documents

### System Architecture
- **[system-architecture.md](./system-architecture.md)** - Overall system architecture and technology stack
- **[requirements.md](./requirements.md)** - System requirements and specifications (30 requisiti)
- **[performance.md](./performance.md)** - Performance analysis and optimization strategies

### Backend & API
- **[backend-api-design.md](./backend-api-design.md)** - Backend API design and implementation with Node.js/Express

### Data Specifications
- **[dataset-specification.md](./dataset-specification.md)** - Dataset structure and specifications (6236 records, 365 lemmi)

### UI/UX Architecture
- **[motion-system.md](./motion-system.md)** - Animation and motion design system (Framer Motion, accessibility)
- **[dynamic-graphics.md](./dynamic-graphics.md)** - Dynamic graphics and visualization architecture

---

## Security Documentation

Data security documentation has been moved to `/docs/security/`:
- **[DATA_SECURITY.md](../security/DATA_SECURITY.md)** - Setup protezione dati e file sensibili
- **[SECURITY_CONFIG.md](../security/SECURITY_CONFIG.md)** - Configurazione (Nginx, JWT, API keys)
- **[SECURITY_EXEC_SUMMARY.md](../security/SECURITY_EXEC_SUMMARY.md)** - Sommario esecutivo

---

## Contributing

When adding new architecture documents:
1. Place files in this directory (`docs/architecture/`)
2. Update this README with a brief description
3. Link from main project documentation if relevant
4. Use clear, descriptive filenames
5. Include diagrams where helpful (ASCII art or images in `docs/`)
6. Add standard metadata header (Versione, Ultima Modifica, Stato)

---

## Change Log

**2026-01-17**: Documentation consolidation
- ✅ Merged `BACKEND_IMPLEMENTATION_SUMMARY.md` into `backend-api-design.md`
- ✅ Moved security docs (`data-security-analysis.md`, `RIEPILOGO-SICUREZZA-DATI.md`) to `/docs/security/`
- ✅ Removed `DOCKER_DEPLOY.md` (content in `/docs/guides/deployment-guide.md`)
- ✅ Updated architecture index

**2026-01-10**: Added data security analysis documents

---

Last updated: 2026-01-17
