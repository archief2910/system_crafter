# Scriptly 📝

A real-time collaborative document editor with advanced version control, built with modern web technologies.

![Scriptly Banner](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.2-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 🚀 Features

### ✨ Core Functionality
- **Real-Time Collaboration**: Multiple users can edit documents simultaneously with live cursor tracking
- **Rich Text Editor**: Powered by Quill.js with comprehensive formatting options
- **Version Control**: Automatic document versioning with restore capabilities
- **Live Chat**: In-document messaging for seamless team communication
- **User Authentication**: Secure JWT-based authentication system
- **Document Sharing**: Granular permission system (read/write/admin) with public/private options

### 🔧 Technical Features
- **Auto-Save**: Automatic document saving every 2 seconds
- **Typing Indicators**: Real-time typing status for all collaborators
- **Document Permissions**: Owner/collaborator management with role-based access
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Error Handling**: Comprehensive error management and user feedback

## 🏗️ Architecture

### Backend (Node.js)
- **Express.js** REST API server
- **Socket.IO** for real-time WebSocket connections
- **MongoDB** with Mongoose ODM for data persistence
- **JWT Authentication** for secure user sessions
- **CORS** configuration for cross-origin requests

### Frontend (React)
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Socket.IO Client** for real-time communication
- **Quill.js** for rich text editing
- **Tailwind CSS** for responsive styling

---

## Core Implementation Examples

### Socket.IO Real-time Collaboration (`backend/src/server.js`)
Handling concurrent users, document rooms, real-time deltas, versioning, and chat broadcasts using WebSockets.

```javascript
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

// ... Setup Express and Database ...

const ioServer = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://scriptly-tbcj.vercel.app/'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    }
});

ioServer.on('connection', (socket) => {
    socket.on('get-document', async (documentId, title) => {
        try {
            // Find or create document
            const document = await findOrCreateDocument(documentId, title, socket.user);
            socket.join(documentId);
            socket.emit('load-document', document);

            // Broadcast text editor changes (deltas)
            socket.on('send-changes', (delta) => {
                socket.broadcast.to(documentId).emit('receive-changes', delta);
            });

            // Handle periodic auto-saves
            socket.on('save-document', async (data) => {
                await saveDocument(documentId, data.data, data.title, socket.user);
                socket.emit('document-saved', { success: true });
            });

            // Live chat functionality
            socket.on('send-chat-message', (messageData) => {
                const message = {
                    id: `${socket.user.id}-${Date.now()}`,
                    text: messageData.text,
                    userId: socket.user.id,
                    username: socket.user.username,
                    timestamp: new Date().toISOString()
                };
                
                socket.emit('receive-chat-message', message);
                socket.broadcast.to(documentId).emit('receive-chat-message', message);
            });

            // Collaborative Typing Indicators
            socket.on('user-typing', (isTyping) => {
                socket.broadcast.to(documentId).emit('user-typing-status', {
                    userId: socket.user.id,
                    username: socket.user.username,
                    isTyping: isTyping
                });
            });

            // ... Version Control Events ...
        } catch (error) {
            socket.emit('error', { message: 'Error loading document' });
        }
    });
});
```

### Collaborative Share Modal (`frontend/src/components/sharing/ShareModal.tsx`)
Managing granular Role-Based Access Control (RBAC) across collaborators.

```tsx
const shareWithUser = async (user: User, permission: 'read' | 'write' | 'admin' = 'write') => {
  try {
    setLoading(true);
    await axios.post(
      `${API_URL}/api/documents/${documentId}/share`,
      {
        email: user.email,
        permission
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    toast.success(`Document shared with ${user.username}`);
    fetchCollaborators();
  } catch (error) {
    toast.error('Failed to share document');
  } finally {
    setLoading(false);
  }
};
```

### MongoDB Document Schema (`backend/src/models/document.model.js`)
Storing Rich Text JSON Deltas and collaborator permissions.

```javascript
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, default: 'Untitled Document' },
    data: { 
        type: mongoose.Schema.Types.Mixed, // Handles Quill.js Delta objects
        default: {}
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        permission: { type: String, enum: ['view', 'edit', 'admin'], default: 'edit' },
        addedAt: { type: Date, default: Date.now }
    }],
    isPublic: { type: Boolean, default: false },
}, { timestamps: true, minimize: false });

export default mongoose.model('Document', documentSchema);
```
