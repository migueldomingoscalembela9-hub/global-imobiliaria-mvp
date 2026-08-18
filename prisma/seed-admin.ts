import { PrismaClient, RoleCode } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.findUnique({
    where: { code: RoleCode.ADMIN }
  });

  if (!adminRole) {
    throw new Error('Role ADMIN não encontrada. Execute `npm run db:seed` primeiro.');
  }

  const email = process.env.ADMIN_EMAIL ?? 'admin@globalimobiliaria.com';
  const password = process.env.ADMIN_PASSWORD ?? 'admin12345';

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Administrador Global',
      email,
      phone: '+244900000000',
      passwordHash,
      roleId: adminRole.id,
      status: 'ACTIVE'
    }
  });

  console.log(`Administrador criado/verificado: ${admin.email} (password: ${password})`);
}

main().finally(() => prisma.$disconnect());