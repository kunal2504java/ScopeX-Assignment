import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET single user (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['ADMIN']);
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

// PATCH update user (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['ADMIN']);
    const { id } = await params;
    const { email, name, role, password } = await request.json();

    const data: any = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (role) data.role = role;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_UPDATED',
        userId: currentUser.id,
        details: `Updated user: ${user.email}`,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

// DELETE user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['ADMIN']);
    const { id } = await params;

    // Prevent deleting yourself
    if (currentUser.id === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const user = await prisma.user.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_DELETED',
        userId: currentUser.id,
        details: `Deleted user: ${user.email}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
