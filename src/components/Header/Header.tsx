import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
            {/* Placeholder for Logo if not available, or text */}
            <span className="text-2xl font-bold text-blue-900">RE:ON</span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link href="#philosophy" className="text-gray-700 hover:text-blue-900 font-medium">진료철학</Link>
          <Link href="#team" className="text-gray-700 hover:text-blue-900 font-medium">의료진소개</Link>
          <Link href="#special" className="text-gray-700 hover:text-blue-900 font-medium">특화진료</Link>
          <Link href="#subjects" className="text-gray-700 hover:text-blue-900 font-medium">진료과목</Link>
          <Link href="/cases" className="text-gray-700 hover:text-blue-900 font-medium">임상사례</Link>
          <Link href="#equipment" className="text-gray-700 hover:text-blue-900 font-medium">장비소개</Link>
          <Link href="#interior" className="text-gray-700 hover:text-blue-900 font-medium">둘러보기</Link>
          <Link href="#info" className="text-gray-700 hover:text-blue-900 font-medium">진료안내</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-2">
            {/* Placeholder for contact or reservation button */}
            <button className="px-4 py-2 bg-blue-900 text-white rounded-full text-sm font-semibold hover:bg-blue-800 transition">
                온라인 예약
            </button>
        </div>

         {/* Mobile Menu Button (Placeholder) */}
         <div className="md:hidden">
            <button className="text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
