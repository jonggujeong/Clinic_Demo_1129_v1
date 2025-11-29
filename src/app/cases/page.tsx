'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import Image from 'next/image';

interface Case {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  date: string;
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">임상사례</h1>
          <p className="text-lg text-gray-600">
            365라온누리치과의원의 실제 진료 과정을 공개합니다.
          </p>
        </div>

        {/* Filters/Categories - Simplified for now */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
           <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">전체</button>
           {/* Add more filter buttons as needed */}
        </div>

        {loading ? (
           <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((c) => (
              <div key={c.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="relative h-64 w-full bg-gray-200">
                   {/* Use unoptimized if external images are not configured or handled via next/image perfectly */}
                   {c.imageUrl ? (
                     <Image
                       src={c.imageUrl}
                       alt={c.title}
                       fill
                       className="object-cover"
                       unoptimized // Since users might paste arbitrary URLs
                     />
                   ) : (
                     <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                   )}
                   <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                     {c.category}
                   </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{c.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{c.content}</p>
                  <div className="mt-auto text-xs text-gray-400 border-t pt-4">
                    {c.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
