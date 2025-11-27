'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Case {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
}

interface Popup {
  id: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'cases' | 'popups'>('cases');

  // Case Form State
  const [caseTitle, setCaseTitle] = useState('');
  const [caseCategory, setCaseCategory] = useState('임플란트');
  const [caseContent, setCaseContent] = useState('');
  const [caseImageUrl, setCaseImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Popup Form State
  const [popupImageUrl, setPopupImageUrl] = useState('');
  const [popupLink, setPopupLink] = useState('#');

  // Data
  const [cases, setCases] = useState<Case[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const casesRes = await fetch('/api/cases');
    const popupsRes = await fetch('/api/popups');
    if (casesRes.ok) setCases(await casesRes.json());
    if (popupsRes.ok) setPopups(await popupsRes.json());
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: caseTitle,
        category: caseCategory,
        content: caseContent,
        imageUrl: caseImageUrl
      })
    });
    setLoading(false);
    if (res.ok) {
      alert('Case added!');
      setCaseTitle('');
      setCaseContent('');
      setCaseImageUrl('');
      fetchData();
    } else {
      alert('Failed to add case');
    }
  };

  const handleSubmitPopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/popups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            imageUrl: popupImageUrl,
            link: popupLink,
            isActive: true
        })
    });
    setLoading(false);
    if(res.ok) {
        alert('Popup added!');
        setPopupImageUrl('');
        fetchData();
    }
  };

  const togglePopup = async (popup: Popup) => {
    const res = await fetch('/api/popups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: popup.id,
            isActive: !popup.isActive
        })
    });
    if(res.ok) fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded ${activeTab === 'cases' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Manage Cases
          </button>
          <button
            onClick={() => setActiveTab('popups')}
            className={`px-4 py-2 rounded ${activeTab === 'popups' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Manage Popups
          </button>
        </div>

        {activeTab === 'cases' && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Clinical Case</h2>
            <form onSubmit={handleSubmitCase} className="space-y-4 mb-8 border-b pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input required className="w-full border p-2 rounded" value={caseTitle} onChange={e => setCaseTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select className="w-full border p-2 rounded" value={caseCategory} onChange={e => setCaseCategory(e.target.value)}>
                    <option>임플란트</option>
                    <option>교정치료</option>
                    <option>심미보철</option>
                    <option>일반진료</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Image URL</label>
                  <input required className="w-full border p-2 rounded" value={caseImageUrl} onChange={e => setCaseImageUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Content Summary</label>
                  <textarea required className="w-full border p-2 rounded h-24" value={caseContent} onChange={e => setCaseContent(e.target.value)} />
                </div>
              </div>
              <button disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                {loading ? 'Adding...' : 'Add Case'}
              </button>
            </form>

            <h3 className="text-lg font-semibold mb-2">Existing Cases</h3>
            <div className="space-y-2">
              {cases.map(c => (
                <div key={c.id} className="border p-4 rounded flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img src={c.imageUrl} alt="" className="w-16 h-16 object-cover rounded" />
                    <div>
                      <div className="font-bold">{c.title}</div>
                      <div className="text-sm text-gray-500">{c.category}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'popups' && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Popup</h2>
             <form onSubmit={handleSubmitPopup} className="space-y-4 mb-8 border-b pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium">Image URL</label>
                  <input required className="w-full border p-2 rounded" value={popupImageUrl} onChange={e => setPopupImageUrl(e.target.value)} placeholder="https://..." />
                </div>
                 <div>
                  <label className="block text-sm font-medium">Link URL (Optional)</label>
                  <input className="w-full border p-2 rounded" value={popupLink} onChange={e => setPopupLink(e.target.value)} placeholder="#" />
                </div>
              </div>
               <button disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                {loading ? 'Adding...' : 'Add Popup'}
              </button>
            </form>

            <h3 className="text-lg font-semibold mb-2">Manage Popups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popups.map(p => (
                    <div key={p.id} className="border p-4 rounded relative">
                        <img src={p.imageUrl} alt="Popup" className="w-full h-40 object-contain mb-2 bg-gray-100" />
                        <div className="flex justify-between items-center">
                             <span className={`px-2 py-1 text-xs rounded ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {p.isActive ? 'Active' : 'Inactive'}
                             </span>
                             <button
                                onClick={() => togglePopup(p)}
                                className="text-blue-600 hover:underline text-sm"
                             >
                                {p.isActive ? 'Deactivate' : 'Activate'}
                             </button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
