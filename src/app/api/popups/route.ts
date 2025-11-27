import { NextResponse } from 'next/server';
import { getPopups, savePopups, Popup } from '@/lib/db';

export async function GET() {
  const popups = getPopups();
  return NextResponse.json(popups);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const popups = getPopups();

    // If update (has ID)
    if (body.id) {
        const index = popups.findIndex(p => p.id === body.id);
        if (index !== -1) {
            popups[index] = { ...popups[index], ...body };
        }
    } else {
        // Create new
        const newPopup: Popup = {
            id: Date.now().toString(),
            imageUrl: body.imageUrl,
            link: body.link || '#',
            isActive: body.isActive ?? true,
        };
        popups.push(newPopup);
    }

    savePopups(popups);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save popup' }, { status: 500 });
  }
}
