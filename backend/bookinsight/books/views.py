import requests
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"

def get_ai_insight(prompt):
    try:
        response = requests.post(LM_STUDIO_URL, json={
            "model": "llama-3.2-1b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        })
        data = response.json()
        print("LM Studio response:", data)
        return data['choices'][0]['message']['content']
    except Exception as e:
        print("Error:", str(e))
        return f"Error: {str(e)}"

@api_view(['GET'])
def get_all_books(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = BookSerializer(book)
    data = serializer.data

    # Generate AI insights
    summary = get_ai_insight(f"Summarize in 2 sentences: '{book.title}'. {book.description[:200]}")
    genre = get_ai_insight(f"Genre in 3 words: '{book.title}'")

    data['ai_summary'] = summary
    data['ai_genre'] = genre
    return Response(data)

@api_view(['POST'])
def add_book(request):
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def ask_question(request):
    question = request.data.get('question', '')
    if not question:
        return Response({'error': 'No question provided'}, status=status.HTTP_400_BAD_REQUEST)

    # Get all books as context
    books = Book.objects.all()[:5]
    context = "\n".join([f"Title: {b.title}" for b in books])

    prompt = f"""You are a book assistant. Based on these books:
{context}

Answer this question: {question}

Give a helpful answer with book title references."""

    answer = get_ai_insight(prompt)
    return Response({'question': question, 'answer': answer})

@api_view(['GET'])
def get_recommendations(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

    # Get other books
    other_books = Book.objects.exclude(pk=pk)[:10]
    context = "\n".join([f"- {b.title}: {b.description[:100]}" for b in other_books])

    prompt = f"""Given someone likes '{book.title}', recommend 3 books from this list and explain why briefly:
{context}"""

    recommendation = get_ai_insight(prompt)
    return Response({'book': book.title, 'recommendations': recommendation})