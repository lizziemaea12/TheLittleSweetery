import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Testing Prisma connection...");
  try {
    await prisma.$connect();
    console.log("Prisma connected!");
    // Check if models exist
    const count = await prisma.product.count();
    console.log(`Product count: ${count}`);
  } catch (error: any) {
    console.error("Prisma error:", error);
    if (error.message) console.error("Error Message:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
