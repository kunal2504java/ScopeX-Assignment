import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET dashboard reports (Admin only)
export async function GET() {
  try {
    await requireRole(['ADMIN']);

    // Get counts
    const totalUsers = await prisma.user.count();
    const totalProjects = await prisma.project.count();
    const totalTasks = await prisma.task.count();

    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    // Get tasks by status
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Get recent activities
    const recentActivities = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalTasks,
      usersByRole,
      tasksByStatus,
      recentActivities,
    });
  } catch (error: any) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
