import { NextResponse } from 'next/server';
import { getCases, addCase } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  const cases = await getCases();
  return NextResponse.json(cases);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const newCase = await addCase(body);
    return NextResponse.json(newCase);
  } catch (error) {
    return NextResponse.json({ message: 'Error creating case' }, { status: 500 });
  }
}
