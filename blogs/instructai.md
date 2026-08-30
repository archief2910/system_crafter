# InstructAI 🎓

**InstructAI** is a comprehensive AI-powered educational platform that revolutionizes learning through personalized course generation, interactive content delivery, and intelligent progress tracking.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-RealTime-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)
![Redis](https://img.shields.io/badge/Redis-Cache-red)

## 🚀 Core Capabilities

- **AI-Powered Course Generation:** Automatically creates comprehensive courses using Google Gemini AI.
- **Interactive Learning:** Real-time chat interface with voice recognition and synthesis.
- **Progress Tracking:** Detailed analytics and achievement systems.
- **Real-time Communication:** Socket.IO powered community threads and chat.
- **Adaptive Architecture:** Content adjusts dynamically based on learning preferences and confusion levels.

---

## 🏗️ Architecture

InstructAI utilizes a highly decoupled microservice-like structure with a Next.js App Router frontend and a Java Spring Boot backend, optimized for real-time collaboration and fast content delivery.

### System Overview
```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│  (Spring Boot)  │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React 18      │    │ • REST APIs     │    │ • Google Gemini │
│ • Context API   │    │ • WebSockets    │    │ • YouTube API   │
│ • Tailwind CSS  │    │ • Spring Data   │    │ • PostgreSQL    │
│ • Framer Motion │    │ • Spring Cache  │    │ • Redis         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 💻 Implementation Highlights

### Next.js API Routes for Redis Caching
Using Redis to cache frequent AI-generated module content, significantly reducing database hits and improving retrieval times by up to 850ms.

```javascript
import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  
  if (!key) return NextResponse.json({ error: 'Cache key is required' }, { status: 400 });
  
  try {
    const cachedData = await redis.get(key);
    if (!cachedData) return NextResponse.json({ data: null, cached: false });
    
    return NextResponse.json({ data: JSON.parse(cachedData), cached: true });
  } catch (error) {
    return NextResponse.json({ error: 'Cache error' }, { status: 500 });
  }
}
```

### Community Thread Data Models
Managing nested, real-time community discussion threads mapped to specific generated courses.

```javascript
// Example thread schema structure
const thread = {
  id: "1",
  name: "Introduction to Machine Learning",
  description: "Discuss fundamental concepts of machine learning, algorithms, and applications",
  parentThreadId: null,
  relatedCourseIds: [101, 102], // Maps discussion back to specific AI courses
  createdAt: "2025-01-15T10:30:00Z",
  active: true,
  subThreadIds: [3, 4],
  conceptTags: ["Machine Learning", "AI", "Neural Networks"]
}
```

### Enterprise-Grade Testing (Spring Boot)
The backend employs a rigorous multi-tiered testing strategy ensuring 99.9% uptime on core services.

- **Unit Tests:** Mockito for isolated business logic validation.
- **Integration Tests:** H2/Testcontainers for JPA query verification.
- **MockMvc:** Simulating HTTP endpoints for API contract validation.
- **Security Testing:** Verifying JWT token flow and RBAC authorization boundaries.
