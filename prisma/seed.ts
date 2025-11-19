import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password for all demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@scopex.com' },
    update: {},
    create: {
      email: 'admin@scopex.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create Manager user
  const manager = await prisma.user.upsert({
    where: { email: 'manager@scopex.com' },
    update: {},
    create: {
      email: 'manager@scopex.com',
      password: hashedPassword,
      name: 'Manager User',
      role: 'MANAGER',
    },
  });

  // Create regular User
  const user = await prisma.user.upsert({
    where: { email: 'user@scopex.com' },
    update: {},
    create: {
      email: 'user@scopex.com',
      password: hashedPassword,
      name: 'Regular User',
      role: 'USER',
    },
  });

  // Create additional users
  const user2 = await prisma.user.upsert({
    where: { email: 'john@scopex.com' },
    update: {},
    create: {
      email: 'john@scopex.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'USER',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@scopex.com' },
    update: {},
    create: {
      email: 'jane@scopex.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'USER',
    },
  });

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      createdById: manager.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Build iOS and Android apps',
      createdById: manager.id,
    },
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Design homepage mockup',
        description: 'Create initial design concepts for homepage',
        status: 'IN_PROGRESS',
        projectId: project1.id,
        assignedToId: user.id,
      },
      {
        title: 'Implement authentication',
        description: 'Set up user login and registration',
        status: 'TODO',
        projectId: project1.id,
        assignedToId: user2.id,
      },
      {
        title: 'Setup database schema',
        description: 'Design and implement database structure',
        status: 'DONE',
        projectId: project2.id,
        assignedToId: user3.id,
      },
      {
        title: 'Create API endpoints',
        description: 'Build RESTful API for mobile app',
        status: 'IN_PROGRESS',
        projectId: project2.id,
        assignedToId: user.id,
      },
    ],
  });

  // Create audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'USER_LOGIN',
        userId: admin.id,
        details: 'Admin logged in successfully',
      },
      {
        action: 'PROJECT_CREATED',
        userId: manager.id,
        details: `Created project: ${project1.name}`,
      },
      {
        action: 'TASK_ASSIGNED',
        userId: manager.id,
        details: 'Assigned task to user',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📧 Demo Credentials:');
  console.log('Admin: admin@scopex.com / password123');
  console.log('Manager: manager@scopex.com / password123');
  console.log('User: user@scopex.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
