import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth';

// GET single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireAuth();
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Regular users can only see their own tasks
    if (currentUser.role === 'USER' && task.assignedToId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json({ task });
  } catch (error: any) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

// PATCH update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireAuth();
    const { id } = await params;
    const { title, description, status, assignedToId } = await request.json();

    // Check if task exists and user has permission
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Regular users can only update status of their own tasks
    if (currentUser.role === 'USER') {
      if (existingTask.assignedToId !== currentUser.id) {
        return NextResponse.json(
          { error: 'Forbidden: Insufficient permissions' },
          { status: 403 }
        );
      }
      // Users can only update status
      if (title || description || assignedToId) {
        return NextResponse.json(
          { error: 'Users can only update task status' },
          { status: 403 }
        );
      }
    }

    const data: any = {};
    if (title) data.title = title;
    if (description !== undefined) data.description = description;
    if (status) data.status = status;
    if (assignedToId && ['ADMIN', 'MANAGER'].includes(currentUser.role)) {
      data.assignedToId = assignedToId;
    }

    const task = await prisma.task.update({
      where: { id },
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
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
        action: 'TASK_UPDATED',
        userId: currentUser.id,
        details: `Updated task: ${task.title}`,
      },
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

// DELETE task (Manager and Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['ADMIN', 'MANAGER']);
    const { id } = await params;

    const task = await prisma.task.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'TASK_DELETED',
        userId: currentUser.id,
        details: `Deleted task: ${task.title}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
