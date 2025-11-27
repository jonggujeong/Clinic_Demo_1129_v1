import Link from 'next/link';
import { Case } from '@/lib/db';

interface CaseCardProps {
  data: Case;
}

export default function CaseCard({ data }: CaseCardProps) {
  return (
    <div className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={data.imageUrl}
          alt={data.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          {data.category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {data.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
          {data.content}
        </p>
        <div className="text-xs text-gray-400 mt-auto pt-2 border-t">
          {new Date(data.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
