import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET all projects (Admin and Manager)
export async function GET(request: NextRequest) {
  try {
    await requireRole(['ADMIN', 'MANAGER']);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

// POST create new project (Manager and Admin)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireRole(['ADMIN', 'MANAGER']);
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: currentUser.id,
      },
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
        action: 'PROJECT_CREATED',
        userId: currentUser.id,
        details: `Created project: ${project.name}`,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
