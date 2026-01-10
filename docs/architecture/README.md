# Architecture Documentation

This directory contains architectural documentation for the AtLiTeG Map project.

## Documents

### System Architecture
- **[system-architecture.md](./system-architecture.md)** - Overall system architecture and technology stack
- **[requirements.md](./requirements.md)** - System requirements and specifications
- **[performance.md](./performance.md)** - Performance analysis and optimization strategies

### Data & Security 🆕
- **[data-security-analysis.md](./data-security-analysis.md)** - **Comprehensive analysis** of how the application uses CSV/JSON data files and detailed proposals for protecting them from external access (37 KB, 1181 lines)
- **[RIEPILOGO-SICUREZZA-DATI.md](./RIEPILOGO-SICUREZZA-DATI.md)** - **Quick reference summary** (Italian) with comparison table and FAQ (6 KB)

### Data Specifications
- **[dataset-specification.md](./dataset-specification.md)** - Dataset structure and specifications

### UI/UX Architecture
- **[motion-system.md](./motion-system.md)** - Animation and motion design system
- **[dynamic-graphics.md](./dynamic-graphics.md)** - Dynamic graphics and visualization architecture

---

## Recent Additions (2026-01-10)

### Data Security Analysis 🔒

Two new documents analyze how the application uses data files in `/data` and `/lemmario-dashboard/public/data`, and propose solutions to make these files inaccessible from outside:

#### Key Findings:
- ✅ **CSV files already protected** via Nginx configuration (HTTP 403)
- ⚠️ **JSON files publicly accessible** (necessary for SPA client-side functionality)
- 📊 **5 solutions proposed** with detailed implementation guides

#### Recommended Solution:
**Backend API with Authentication** - Best balance of security, cost, and flexibility

#### Quick Start:
1. Read [RIEPILOGO-SICUREZZA-DATI.md](./RIEPILOGO-SICUREZZA-DATI.md) for quick overview
2. Review [data-security-analysis.md](./data-security-analysis.md) for detailed implementation
3. Decide on solution based on data sensitivity and budget

---

## Contributing

When adding new architecture documents:
1. Place files in this directory (`docs/architecture/`)
2. Update this README with a brief description
3. Link from main project documentation if relevant
4. Use clear, descriptive filenames
5. Include diagrams where helpful (ASCII art or images in `docs/`)

---

Last updated: 2026-01-10
