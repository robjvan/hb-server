# 📝 HaikuBot Backend

The backend service that powers **HaikuBot** — an AI-driven haiku generator with geolocation analytics, centralized logging, and automated deployments.  

---

## ✨ Description

HaikuBot Backend is a **NestJS-based API** that integrates with the **OpenAI API** to generate unique haikus on demand.  
It enriches each request with geolocation context, persists results in a PostgreSQL database, and captures logs for observability.  

Built for reliability, scalability, and ease of deployment, it’s fully automated to rebuild and redeploy when changes land on the main branch.

👉 Try the **interactive API demo with Swagger UI** here:  
[https://hb-server.robjvan.ca/api](https://hb-server.robjvan.ca/api)
---

## 🚀 Features

- **AI-Generated Haikus** → Uses OpenAI API for creativity on demand.  
- **Interactive API Docs** → Swagger UI available for real-time exploration & testing
- **Automated Deployments** → Integrated with GitHub + Coolify webhooks for zero-touch CI/CD.  
- **Geolocation Analytics** → Detects user country from IP for demographic insights.  
- **Structured Logging** → Centralized logging service with database persistence for observability.  

---

## 🛠 Tech Stack

- **Runtime** → Node.js v22, npm v10  
- **Framework** → NestJS v11  
- **Database** → PostgreSQL with TypeORM ORM  
- **AI Integration** → OpenAI API for natural language generation  
- **Infrastructure** → Docker + Coolify for automated deployments  
- **Networking** → Cloudflare & Nginx Proxy Manager for secure public access  
- **Architecture** → Reactive async/await patterns for clean concurrency  
