# Prism – AI E-Commerce Customer Support Chatbot

Prism is an AI-powered customer support chatbot designed for e-commerce stores. It allows customers to ask questions about products, shipping, returns, and store policies. Store administrators can manage the knowledge base, review customer conversations, and respond to customers when human support is needed.

The chatbot uses Retrieval-Augmented Generation (RAG) to provide answers based on information stored in the store's knowledge base.

## Features

### Customer Support
- Interactive customer chat widget.
- AI-generated answers based on the store's knowledge base.
- Retrieval-Augmented Generation (RAG) with source references.
- Conversation history stored in the database.
- Human support handoff when additional assistance is needed.

### Admin Dashboard
- Secure administrator login.
- Manage FAQ, policy, and product information.
- Upload documents to the knowledge base.
- Store knowledge base entries in MongoDB Atlas.
- View customer conversations and respond to customers.
- View analytics, including common customer questions and unanswered queries.

## Technologies Used

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API
- **RAG:** Text chunking, embeddings, and vector search


## RAG Workflow

1. The administrator adds FAQs, policies, product information, or documents to the knowledge base.
2. The backend processes the content and divides it into smaller text chunks.
3. Gemini generates embeddings for the text chunks.
4. The embeddings are stored in MongoDB Atlas and retrieved using vector search.
5. When a customer asks a question, Prism retrieves relevant knowledge base content.
6. The AI uses the retrieved information to generate an answer and provide source references.


