import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding initial products...");
  
  const products = [
    { name: "Puppy Chow", price: 2.50 },
    { name: "Snickerdoodles", price: 1.50 },
    { name: "Cake Pops", price: 2.50 },
    { name: "Caramel Corn", price: 2.50 },
  ];

  for (const product of products) {
    try {
      const up = await prisma.product.upsert({
        where: { name: product.name },
        update: { price: product.price },
        create: {
          name: product.name,
          price: product.price,
          stockQuantity: 0, // Admin will set this via UI
        },
      });
      console.log(`- ${up.name} ($${up.price}) - OK`);
    } catch (e: any) {
      console.error(`Error Upserting ${product.name}:`, e.message);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
