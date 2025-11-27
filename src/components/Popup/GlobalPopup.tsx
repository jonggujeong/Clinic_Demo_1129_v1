'use client';

import { useState, useEffect } from 'react';

interface Popup {
  id: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
}

export default function GlobalPopup() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [visiblePopups, setVisiblePopups] = useState<Popup[]>([]);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const res = await fetch('/api/popups');
        if (res.ok) {
          const allPopups: Popup[] = await res.json();
          // Filter active popups
          const active = allPopups.filter(p => p.isActive);

          // Check cookies for "don't show today"
          // We'll use localStorage for simplicity in this demo, or document.cookie
          const filtered = active.filter(p => {
             const cookieName = `hide_popup_${p.id}`;
             return !getCookie(cookieName);
          });

          setVisiblePopups(filtered);
        }
      } catch (e) {
        console.error('Failed to fetch popups', e);
      }
    };

    fetchPopups();
  }, []);

  const closePopup = (id: string, dontShowToday: boolean) => {
    if (dontShowToday) {
      setCookie(`hide_popup_${id}`, 'true', 1);
    }
    setVisiblePopups(prev => prev.filter(p => p.id !== id));
  };

  if (visiblePopups.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none flex items-start justify-start p-4 md:p-10 gap-4 flex-wrap">
      {visiblePopups.map((popup, index) => (
        <div key={popup.id} className="pointer-events-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 w-[300px] md:w-[400px] relative animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
          <a href={popup.link} target={popup.link === '#' ? '_self' : '_blank'} rel="noreferrer">
            <img src={popup.imageUrl} alt="Notice" className="w-full h-auto object-contain" />
          </a>
          <div className="bg-gray-900 text-white text-xs flex justify-between items-center p-2">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input type="checkbox" onChange={(e) => {
                if(e.target.checked) closePopup(popup.id, true);
              }} />
              <span>오늘 하루 보지 않기</span>
            </label>
            <button onClick={() => closePopup(popup.id, false)} className="px-2 py-1 font-bold hover:text-gray-300">
              닫기 X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper functions for cookies
function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
