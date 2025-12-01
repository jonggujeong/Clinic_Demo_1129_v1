'use client';

import { useState, useEffect, use } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Case {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  date: string;
}

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [caseItem, setCaseItem] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/cases/${resolvedParams.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setCaseItem(data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/cases'); // Redirect if not found
      });
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-28 pb-12 flex justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!caseItem) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Title Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {caseItem.category}
                </span>
                <span className="text-sm text-gray-500">{caseItem.date}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {caseItem.title}
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {caseItem.imageUrl && (
              <div className="mb-8 relative w-full h-auto">
                 <img
                   src={caseItem.imageUrl}
                   alt={caseItem.title}
                   className="max-w-full h-auto rounded-lg mx-auto"
                 />
              </div>
            )}

            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
              {caseItem.content}
            </div>
          </div>

          {/* Footer / Navigation */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <Link
              href="/cases"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
