## AI Customer Support Agent

### BCT Agentic AI Program – College Project

**Version:** 1.0

**Project Type:** Agentic AI Demonstration

**Duration:** 2 Days

**Team Size:** 5 Members

---

# Project Overview

AI Customer Support Agent is an Agentic AI application that acts as a virtual customer support executive. Unlike a traditional chatbot, the AI agent can understand user requests, retrieve information from a company knowledge base, use backend tools to perform actions, remember previous conversations, and assist users in resolving common customer support issues.

The primary objective is to demonstrate how an AI agent can reason, make decisions, use tools, and complete tasks autonomously.

---

# Problem Statement

Customer support often involves repetitive queries such as:

* Where is my order?
* How do I return a product?
* I want to create a complaint.
* What is your refund policy?

Traditional chatbots respond using predefined rules and cannot perform actions. This project demonstrates an AI agent capable of both answering questions and executing tasks.

---

# Objectives

The project aims to demonstrate:

* Large Language Model integration
* Retrieval-Augmented Generation (RAG)
* Tool Calling
* AI Memory
* API Integration
* Agentic Workflow

---

# Target Users

### Customer

Can:

* Chat with AI
* Ask product questions
* Check order status
* Create support tickets
* View previous conversations

### Admin

Can:

* View customer tickets
* Update ticket status
* Manage FAQs (optional)

---

# Core Features

### AI Chat

Natural language conversation using Gemini API.

---

### Knowledge Base (RAG)

The AI retrieves information from company FAQs and policy documents before answering.

Example questions:

* Refund policy
* Shipping policy
* Warranty
* Return process

---

### Tool Calling

The AI can invoke backend tools such as:

* Check Order
* Create Ticket
* Product Lookup
* Appointment Booking

---

### Conversation Memory

The AI remembers previous messages and uses them to provide context-aware responses.

---

### Support Ticket System

Customers can create support tickets, and the AI generates a ticket ID.

---

# Agentic AI Workflow

```text
Customer Question
        │
        ▼
Understand Intent
        │
        ▼
Plan Required Action
        │
 ┌──────────────┐
 │Need RAG?     │
 └──────┬───────┘
        │
Retrieve Knowledge
        │
        ▼
Need Tool?
        │
        ▼
Execute Backend Tool
        │
        ▼
Generate Final Response
        │
        ▼
Customer
```

---

# Functional Requirements

### Authentication

* Simple Login (Optional)

### AI Chat

* Chat Interface
* Chat History

### RAG

* Search FAQs
* Search company documents

### Tool Calling

* Check Order
* Create Ticket
* Product Information

### Memory

* Remember previous conversation

### Admin Dashboard

* View tickets
* Update ticket status

---

# Technology Stack

### Frontend

* React + Vite
* Tailwind CSS

### Backend

* FastAPI
* Python

### AI

* Gemini API
* LangChain (optional)
* FAISS
* Sentence Transformers

### Database

* SQLite

---

# Folder Structure

```text
frontend/

backend/
    app/
    api/
    agent/
    rag/
    tools/
    database/
    models/
    services/

knowledge_base/

vector_store/

# Expected Demonstration

During the project demo, the AI should be able to:

1. Answer questions using the knowledge base.
2. Check a mock order status.
3. Create a support ticket.
4. Remember previous conversation context.
5. Use backend tools to complete tasks.
6. Explain its actions to the user.

---

# Future Scope

* Voice interaction
* WhatsApp integration
* CRM integration
* Multi-agent customer support
* Live human agent handoff
* Sentiment analysis
