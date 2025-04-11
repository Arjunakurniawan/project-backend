import { PrismaClient } from "@prisma/client";
import { products } from "./data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("start seeding....");

  for (const product of products) {
    const upsertedProduct = await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product,
    });
    console.log("seeding is completed", upsertedProduct);
  }
  console.info("seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
