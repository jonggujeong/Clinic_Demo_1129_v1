import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import FloatingMenu from '@/components/FloatingMenu/FloatingMenu';
import CaseGrid from '@/components/CaseBoard/CaseGrid';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-[100px]">
        {/* Banner Section simulating the reference site */}
        <section className="bg-white border-b py-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">임상증례게시판</h1>
            <p className="text-gray-600">Reon Dental Clinic의 실제 진료 과정을 공개합니다.</p>
        </section>

        {/* Categories (Static for now, could be dynamic) */}
        <div className="bg-white border-b sticky top-[60px] z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
                <div className="flex space-x-6 py-4 whitespace-nowrap text-sm md:text-base font-medium text-gray-600">
                    <span className="text-blue-600 border-b-2 border-blue-600 cursor-pointer">전체</span>
                    <span className="hover:text-blue-600 cursor-pointer">임플란트</span>
                    <span className="hover:text-blue-600 cursor-pointer">교정치료</span>
                    <span className="hover:text-blue-600 cursor-pointer">충치치료</span>
                    <span className="hover:text-blue-600 cursor-pointer">심미보철</span>
                </div>
            </div>
        </div>

        <CaseGrid />
      </main>
      <Footer />
      <FloatingMenu />
    </>
  );
}
