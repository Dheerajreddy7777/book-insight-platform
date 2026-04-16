'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/books/')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Book Insight Platform</h1>
        <p className="text-gray-500 mb-6">AI-powered book discovery and insights</p>

        <div className="flex gap-4 mb-8">
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Dashboard</Link>
          <Link href="/qa" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Q&A</Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading books...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book: any) => (
              <Link href={`/books/${book.id}`} key={book.id}>
                <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{book.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">Author: {book.author}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-500">{'⭐'.repeat(parseInt(book.rating) || 0)}</span>
                    <span className="text-sm text-gray-400">({book.rating}/5)</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
                  <span className="mt-3 inline-block text-blue-600 text-sm font-medium">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}