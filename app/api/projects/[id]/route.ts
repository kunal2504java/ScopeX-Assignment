import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET single project (Admin and Manager)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['ADMIN', 'MANAGER']);
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

// PATCH update project (Manager and Admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['ADMIN', 'MANAGER']);
    const { id } = await params;
    const { name, description } = await request.json();

    const data: any = {};
    if (name) data.name = name;
    if (description !== undefined) data.description = description;

    const project = await prisma.project.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'PROJECT_UPDATED',
        userId: currentUser.id,
        details: `Updated project: ${project.name}`,
      },
    });

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

// DELETE project (Manager and Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['ADMIN', 'MANAGER']);
    const { id } = await params;

    const project = await prisma.project.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'PROJECT_DELETED',
        userId: currentUser.id,
        details: `Deleted project: ${project.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
