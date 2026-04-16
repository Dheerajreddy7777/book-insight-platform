# Book Insight Platform

An AI-powered full-stack web application that scrapes book data and provides intelligent insights using RAG and LLM integration.

## Screenshots
### Dashboard
![Dashboard]("<img width="1724" height="949" alt="Image" src="https://github.com/user-attachments/assets/59cfe365-5966-43cd-a6d6-a597f4b547c6" />")

### Book Detail with AI Insights
![Book Detail](<"img width="1286" height="960" alt="Image" src="https://github.com/user-attachments/assets/ba2f62e6-fdf7-408a-aa0a-2b81446dcd62" />")

### Q&A Interface
![QA]("<img width="1487" height="960" alt="Image" src="https://github.com/user-attachments/assets/4da3d188-d180-4f9c-b4d4-7bd20da0bb5b" />")

## Tech Stack
- **Backend**: Django REST Framework, Python
- **Database**: MySQL
- **Frontend**: Next.js with Tailwind CSS
- **AI**: LM Studio (Llama 3.2 1B)
- **Scraping**: BeautifulSoup, Requests

## Setup Instructions

### Backend
1. Install Python dependencies:
pip install django djangorestframework mysqlclient selenium requests beautifulsoup4 chromadb sentence-transformers django-cors-headers
2. Create MySQL database:
```sql
   CREATE DATABASE bookinsight;
```
3. Update `backend/bookinsight/bookinsight/settings.py` with your MySQL password
4. Run migrations:
python manage.py migrate
5. Scrape books:
python manage.py scrape_books
6. Start server:
python manage.py runserver

### Frontend
1. Install dependencies:
cd frontend
npm install
2. Start development server:
npm run dev

### AI (LM Studio)
1. Download LM Studio from https://lmstudio.ai
2. Download `llama-3.2-1b-instruct` model
3. Start local server on port 1234

## API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/books/ | List all books |
| GET | /api/books/{id}/ | Get book detail with AI insights |
| POST | /api/books/add/ | Add a new book |
| POST | /api/books/ask/ | Ask a question about books |
| GET | /api/books/{id}/recommendations/ | Get book recommendations |

## Sample Questions
- "What is a good mystery book?"
- "Tell me about Sapiens"
- "Recommend a book about history"
