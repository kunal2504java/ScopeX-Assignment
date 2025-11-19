import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    const user = await getSession();

    if (user) {
      // Create audit log
      await prisma.auditLog.create({
        data: {
          action: 'USER_LOGOUT',
          userId: user.id,
          details: `User ${user.email} logged out`,
        },
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
