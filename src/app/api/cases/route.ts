import { NextResponse } from 'next/server';
import { getCases, saveCases, Case } from '@/lib/db';

export async function GET() {
  const cases = getCases();
  // Sort by date desc
  const sortedCases = cases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(sortedCases);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cases = getCases();

    const newCase: Case = {
      id: Date.now().toString(),
      title: body.title,
      category: body.category || '일반',
      content: body.content,
      imageUrl: body.imageUrl,
      createdAt: new Date().toISOString(),
    };

    cases.unshift(newCase);
    saveCases(cases);

    return NextResponse.json({ success: true, data: newCase });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add case' }, { status: 500 });
  }
}
