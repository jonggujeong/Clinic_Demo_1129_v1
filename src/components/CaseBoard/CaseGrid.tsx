import CaseCard from './CaseCard';
import { getCases } from '@/lib/db';

export default function CaseGrid() {
  const cases = getCases();
  // Sort desc
  const sortedCases = cases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCases.map((c) => (
          <CaseCard key={c.id} data={c} />
        ))}
      </div>
    </div>
  );
}
