import { PrismaClient, RoleCode } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (const code of Object.values(RoleCode)) {
    await prisma.role.upsert({
      where: { code },
      update: {},
      create: { code }
    });
  }
  console.log('Roles inicializadas.');
}

main().finally(() => prisma.$disconnect());
