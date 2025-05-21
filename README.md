# 🗒️ COFO Note Manager API

A NestJS-based note manager backend powered by MongoDB, Swagger, and protected with an API Key guard.

---

## ⚙️ Setup & Run

```bash
# Install dependencies
npm install

# Start MongoDB (requires Docker)
npm run start:db

# Start development server
npm run start:dev

# Run tests (uses .env.test)
npm run test


🔐 Note: All API requests must include a valid API key in the x-api-key header. Unauthorized requests will be rejected.
```
