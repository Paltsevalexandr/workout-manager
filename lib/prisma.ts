import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";


function createPrismaClient() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
    return new PrismaClient({ adapter });
}

// In dev, Next.js re-evaluates modules on every code change.
// Keeping the client on globalThis prevents opening 
// a new connection pool each time
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
