import { NextResponse } from 'next/server';
import { deleteCase, getCase, updateCase } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseItem = await getCase(id);
    if (!caseItem) {
      return NextResponse.json({ message: 'Case not found' }, { status: 404 });
    }
    return NextResponse.json(caseItem);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching case' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updatedCase = await updateCase(id, body);

    if (!updatedCase) {
        return NextResponse.json({ message: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCase);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating case' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteCase(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting case' }, { status: 500 });
  }
}
