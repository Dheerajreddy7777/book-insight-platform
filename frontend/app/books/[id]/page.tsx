'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState('');
  const [loadingRec, setLoadingRec] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/books/${id}/`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setLoading(false);
      });
  }, [id]);

  const getRecommendations = async () => {
    setLoadingRec(true);
    const res = await fetch(`http://127.0.0.1:8000/api/books/${id}/recommendations/`);
    const data = await res.json();
    setRecommendations(data.recommendations);
    setLoadingRec(false);
  };

  if (loading) return <div className="p-8 text-gray-500">Loading book details...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Book Insight Platform</h1>
        <p className="text-gray-500 mb-6">AI-powered book discovery and insights</p>

        <div className="flex gap-4 mb-8">
          <Link href="/" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Dashboard</Link>
          <Link href="/qa" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Q&A</Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
          <p className="text-gray-500 mb-2">Author: {book.author}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500">{'⭐'.repeat(parseInt(book.rating) || 0)}</span>
            <span className="text-sm text-gray-400">({book.rating}/5)</span>
          </div>
          <p className="text-gray-600 mb-4">{book.description}</p>
          <a href={book.book_url} target="_blank" className="text-blue-600 hover:underline text-sm">
            View on Source Site →
          </a>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">🤖 AI Insights</h3>
          <div className="mb-4">
            <span className="font-medium text-gray-700">Genre: </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">{book.ai_genre}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Summary:</span>
            <p className="text-gray-600 mt-1">{book.ai_summary}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">📖 Recommendations</h3>
          <button
            onClick={getRecommendations}
            disabled={loadingRec}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {loadingRec ? 'Getting recommendations...' : 'Get Similar Books'}
          </button>
          {recommendations && (
            <p className="text-gray-600 whitespace-pre-wrap">{recommendations}</p>
          )}
        </div>
      </div>
    </main>
  );
}