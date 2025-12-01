'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Case {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  date: string;
}

export default function AdminPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('임플란트');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check Auth
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/cases/login');
        } else {
          setIsAuthenticated(true);
          loadCases();
        }
      });
  }, [router]);

  const loadCases = () => {
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
        setLoading(false);
      });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/cases/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const res = await fetch(`/api/cases/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadCases();
      // If we deleted the item being edited, reset the form
      if (editId === id) {
          resetForm();
      }
    } else {
      alert('Failed to delete');
    }
  };

  const handleEdit = (c: Case) => {
      setIsEditing(true);
      setEditId(c.id);
      setTitle(c.title);
      setCategory(c.category);
      setImageUrl(c.imageUrl);
      setContent(c.content);
      // scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setIsEditing(false);
      setEditId(null);
      setTitle('');
      setCategory('임플란트');
      setImageUrl('');
      setContent('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const caseData = {
      title,
      category,
      imageUrl,
      content,
      // If editing, keep original date or update? Usually keep original unless requested.
      // But for new posts we set date.
      ...(isEditing ? {} : { date: new Date().toISOString().split('T')[0] }),
    };

    let res;
    if (isEditing && editId) {
        res = await fetch(`/api/cases/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caseData),
        });
    } else {
        res = await fetch('/api/cases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caseData),
        });
    }

    if (res.ok) {
      resetForm();
      loadCases();
    } else {
      alert(isEditing ? 'Failed to update case' : 'Failed to add case');
    }
    setSubmitting(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">임상사례 관리자</h1>
          <div className="space-x-4">
             <Link href="/cases" className="text-blue-600 hover:text-blue-800">사이트 바로가기</Link>
             <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
               로그아웃
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{isEditing ? '사례 수정' : '새 사례 추가'}</h2>
                {isEditing && (
                    <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">취소</button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">제목</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">카테고리</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>임플란트</option>
                  <option>교정치료</option>
                  <option>충치치료</option>
                  <option>치주치료</option>
                  <option>심미보철</option>
                  <option>일반진료</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">이미지 URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">내용</label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none disabled:opacity-50 ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {submitting ? '저장 중...' : (isEditing ? '수정하기' : '추가하기')}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">등록된 사례 ({cases.length})</h2>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-4">
                {cases.map((c) => (
                  <div key={c.id} className={`border p-4 rounded-lg flex gap-4 items-start ${editId === c.id ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}>
                    {c.imageUrl && (
                      <div className="w-24 h-24 relative flex-shrink-0 bg-gray-100">
                        <img
                          src={c.imageUrl}
                          alt={c.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                           <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{c.category}</span>
                           <h3 className="font-bold text-lg mt-1">{c.title}</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(c)}
                                className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                삭제
                            </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{c.content}</p>
                      <p className="text-gray-400 text-xs mt-2">{c.date}</p>
                    </div>
                  </div>
                ))}
                {cases.length === 0 && (
                   <div className="text-center text-gray-500 py-8">등록된 사례가 없습니다.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
