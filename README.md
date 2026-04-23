# Civic Accessibility Issue Tracker (CivicBot System)

## Overview
The Civic Accessibility Issue Tracker is a full-stack web application designed to help residents report, track, and manage municipal accessibility issues. It integrates AI-powered insights and a chatbot (CivicBot) to enhance issue understanding and decision-making.

## Features
- Issue Reporting (title, description, location, category, priority)
- AI Insights (summary, category suggestion, priority reasoning)
- CivicBot Chatbot (guidance, Q&A, trend explanation)
- Issue Assignment (municipal teams)
- Community Upvotes
- MongoDB + GraphQL integration

## Tech Stack
Frontend: React (Vite), TypeScript, Tailwind CSS  
Backend: Node.js, Express, GraphQL  
Database: MongoDB (Mongoose)  
AI: Google Gemini API

## Setup

### Backend
cd backend  
npm install  

Create .env:
MONGO_URI=your_mongodb_connection  
GOOGLE_API_KEY=your_gemini_api_key  

npm run dev  

### Frontend
cd frontend  
npm install  
npm run dev  

## Notes
- Gemini API has daily limits (fallback responses included)
- Ensure frontend and backend enum values match exactly

## Contributors
Rohit Budha
Thyra Barnes
Ester Dhimal
Lynn
Shercan
