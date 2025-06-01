import { PrismaClient } from "@prisma/client";
import { products } from "./dataDummy/products";

const prisma = new PrismaClient();

async function main() {
  console.log("start seeding....");

  for (const product of products) {
    const createProductData = await prisma.product.upsert({
      where: { id: product.id },

      create: {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        warehouseId: product.warehouseId,
      },

      update: {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        warehouseId: product.warehouseId,
      },
    });
    console.log("seeding is completed", createProductData);
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
