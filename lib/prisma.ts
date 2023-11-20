// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma ||  new PrismaClient(); // Log queries new PrismaClient({log: ['query'],});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

/*let prisma: PrismaClient;
prisma = new PrismaClient();
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}*/

export default prisma;