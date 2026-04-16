'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function QAPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/books/ask/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch {
      setAnswer('Error getting answer. Make sure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Book Insight Platform</h1>
        <p className="text-gray-500 mb-6">AI-powered book discovery and insights</p>

        <div className="flex gap-4 mb-8">
          <Link href="/" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Dashboard</Link>
          <Link href="/qa" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Q&A</Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ask About Books</h2>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="e.g. What is a good mystery book? or Tell me about Sapiens..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Ask Question'}
          </button>

          {answer && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Answer:</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}