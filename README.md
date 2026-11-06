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

### Architecture Diagram

Prism has two separate frontend routes: one for customers and another for administrators.

                         PRISM
                           |
                  React + Vite Frontend
                           |
              +------------+------------+
              |                         |
        CUSTOMER ROUTES             ADMIN ROUTES
              |                         |
        Customer Chat               Admin Login
        Ask Questions               Admin Dashboard
        Receive AI Answers          Knowledge Base
        View Conversations          Conversation Management
                                    Analytics
              |                         |
              +------------+------------+
                           |
                  Node.js + Express API
                           |
              +------------+------------+
              |                         |
        CUSTOMER SERVICES          ADMIN SERVICES
              |                         |
        Chat Service               Authentication
        RAG Service                Knowledge Base
        Conversations              Analytics
              |                         |
              +------------+------------+
                           |
                     MongoDB Atlas
                           |
                       Gemini API
                  Embeddings and AI Responses

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

## Admin Feature Testing Guide

The following steps explain how to test the administrator features.

### 1. Test Admin Login

1. Open Prism in your browser.

2. Click Sign In.

3. Enter the administrator credentials given.

4. Verify that you are redirected to the Admin Dashboard.

5. Try logging in with incorrect credentials to verify that access is rejected.

### 2. Test Knowledge Base Management

1. Open the Knowledge Base section from the Admin Dashboard.

2. Add an FAQ by entering a question and its answer.

3. Switch to the Policy tab and add a policy.

4. Switch to the Product tab and add product information.

5. Test document uploades.

6. Verify that saved entries appear in the knowledge base.

### 3. Test AI Customer Support and Human Handoff

1. Open the customer chat interface.

2. Ask a question related to an FAQ, policy, or product you added.

3. Check whether Prism retrieves relevant information and generates an appropriate answer.

4. Ask a question that is not covered by the knowledge base to test how Prism handles unanswered questions.

5. Open Prism in another tab and sign in as Admin.

6. navigate to conversation history and locate the unanswered question.

7. Reply to the question using the reply feature.
   
8. Check if the answer appeared in the customer chat.  


### 4. Test Analytics

1. Open the Analytics section.

2. Ask the chatbot several questions, including repeated and unrelated questions.

3. Check whether repeated or semantically similar questions appear under Common Questions in overview section.

4. Ask questions that the knowledge base cannot answer.

5. Check whether those queries appear under Unanswered Questions.


