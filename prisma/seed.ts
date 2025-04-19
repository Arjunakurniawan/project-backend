import { PrismaClient } from "@prisma/client";
import { products } from "./data/products";

const prisma = new PrismaClient();

const categories = await prisma.category.findMany();
const warehouses = await prisma.warehouse.findMany();

async function main() {
  console.log("start seeding....");

  for (const product of products) {
    const matchedCategory = categories.find((c) => c.name === product.name);
    const matchedWarehouse = warehouses.find((w) => w.name === product.name);

    if (!matchedCategory || !matchedWarehouse) continue;
    const createProductData = await prisma.product.upsert({
      where: { id: product.id },

      create: {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock,
        categoryId: matchedCategory.id,
        warehouseId: matchedWarehouse.id,
      },

      update: {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock,
        categoryId: matchedCategory.id,
        warehouseId: matchedWarehouse.id,
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
