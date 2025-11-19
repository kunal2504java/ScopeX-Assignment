import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth';

// GET all tasks (role-based filtering)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');

    const where: any = {};

    // Regular users can only see their own tasks
    if (currentUser.role === 'USER') {
      where.assignedToId = currentUser.id;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status;
    }

    const tasks = await prisma.task.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

// POST create new task (Manager and Admin)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireRole(['ADMIN', 'MANAGER']);
    const { title, description, projectId, assignedToId, status } = await request.json();

    if (!title || !projectId || !assignedToId) {
      return NextResponse.json(
        { error: 'Title, project, and assigned user are required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assignedToId,
        status: status || 'TODO',
      },
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
        action: 'TASK_CREATED',
        userId: currentUser.id,
        details: `Created task: ${task.title} and assigned to ${task.assignedTo.name}`,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
