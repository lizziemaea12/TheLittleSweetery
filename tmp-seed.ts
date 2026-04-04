import { prisma } from "./lib/prisma";

async function main() {
  const products = [
    { name: "Puppy Chow", price: 2.50 },
    { name: "Snickerdoodles", price: 1.50 },
    { name: "Cake Pops", price: 2.50 },
    { name: "Caramel Corn", price: 2.50 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: { price: product.price },
      create: { ...product, stockQuantity: 0 },
    });
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
