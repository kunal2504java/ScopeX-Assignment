import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET audit logs (Admin only)
export async function GET(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action') || '';

    const where: any = {};

    if (action) {
      where.action = action;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error('Get audit logs error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
