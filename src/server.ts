import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient, Category, Warehouse } from "@prisma/client";
import cors from "cors";
import {
  ProductRequest,
  Product,
  ApiResponse,
  CategoryRequest,
  WarehouseRequest,
  Transaction,
  TransactionWithItems,
  TransactionRequest,
} from "../typing/model";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
dotenv.config();

// CRUD product
app.get<string, null, ApiResponse<Product[]>>("/product", async (_, res) => {
  try {
    const products =
      (await prisma.product.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          category: true,
          warehouse: true,
        },
      })) || [];

    res.status(200).json({ data: products, message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: [], message: "Error Get Products" });
  }
});

app.get<string, { id: string }, ApiResponse<Product | null>>(
  "/product/:id",
  async (req, res) => {
    try {
      const product =
        (await prisma.product.findFirstOrThrow({
          where: {
            id: parseInt(req.params.id),
            deletedAt: null,
          },
          include: {
            category: true,
            warehouse: true,
          },
        })) || [];

      res.status(200).json({ data: product, message: "success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Get Product" });
    }
  }
);

app.post<string, null, ApiResponse<null>, ProductRequest>(
  "/product",
  async (req, res) => {
    try {
      await prisma.product.create({
        data: req.body,
      });
      res
        .status(201)
        .json({ data: null, message: "Product created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Create Product" });
    }
  }
);

app.put<string, { id: string }, ApiResponse<null>, ProductRequest>(
  "/product/:id",
  async (req, res) => {
    try {
      await prisma.product.update({
        data: req.body,
        where: {
          id: parseInt(req.params.id),
        },
      });
      res.status(200).json({ data: null, message: "success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Get Product" });
    }
  }
);

app.delete<string, { id: string }, ApiResponse<null>>(
  "/product/:id",
  async (req, res) => {
    try {
      await prisma.product.update({
        where: { id: parseInt(req.params.id) },
        data: {
          deletedAt: new Date(),
        },
      });
      console.log("product soft deleted successfully");
      res
        .status(204)
        .json({ data: null, message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Delete Product" });
    }
  }
);

// end product

// CRUD category

app.get<string, null, ApiResponse<Category[]>>("/category", async (_, res) => {
  try {
    const categories =
      (await prisma.category.findMany({
        where: {
          deletedAt: null,
        },
      })) || [];
    res.status(200).json({ data: categories, message: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: [], message: "Error Get Categories" });
  }
});

app.post<string, null, ApiResponse<null>, CategoryRequest>(
  "/category",
  async (req, res) => {
    try {
      await prisma.category.create({
        data: req.body,
      });
      res.status(201).json({ data: null, message: "Success Created" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Create Category" });
    }
  }
);

app.delete<string, { id: string }, ApiResponse<null>>(
  "/category/:id",
  async (req: Request, res: Response) => {
    try {
      await prisma.category.update({
        where: { id: parseInt(req.params.id) },
        data: {
          deletedAt: new Date(),
        },
      });
      console.log("category soft deleted");
      res.status(200).json({ data: null, message: "Success Delete" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, error: "Error Delete Category" });
    }
  }
);

app.put<string, { id: string }, ApiResponse<null>, CategoryRequest>(
  "/category/:id",
  async (req, res) => {
    try {
      await prisma.category.update({
        where: { id: parseInt(req.params.id) },
        data: req.body,
      });
      console.log("category soft deleted");
      res.status(200).json({ data: null, message: "Success Update" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Update Category" });
    }
  }
);

//end category

//CRUD warehouse
app.get<string, null, ApiResponse<Warehouse[]>>(
  "/warehouse",
  async (_, res) => {
    try {
      const warehouse =
        (await prisma.warehouse.findMany({
          where: {
            deletedAt: null,
          },
        })) || [];
      res.status(200).json({ data: warehouse, message: "success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: [], message: "Error Get Warehouses" });
    }
  }
);

app.post<string, null, ApiResponse<null>, WarehouseRequest>(
  "/warehouse",
  async (req, res) => {
    try {
      await prisma.warehouse.create({
        data: req.body,
      });
      res.status(201).json({ data: null, message: "Success Created" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Create Warehouse" });
    }
  }
);

app.delete<string, { id: string }, ApiResponse<null>, WarehouseRequest>(
  "/warehouse/:id",
  async (req, res) => {
    try {
      await prisma.warehouse.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          deletedAt: new Date(),
        },
      });
      res.status(200).json({ data: null, message: "Category is Soft Delete" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Delete Warehouse" });
    }
  }
);

app.put<string, { id: string }, ApiResponse<null>>(
  "/warehouse/:id",
  async (req, res) => {
    try {
      await prisma.warehouse.update({
        where: { id: parseInt(req.params.id) },
        data: req.body,
      });
      res.status(200).json({ data: null, message: "Success Update" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Update Warehouse" });
    }
  }
);
//end warehouse

//CRUD Transaction
app.get<string, null, ApiResponse<Transaction[]>>(
  "/transaction",
  async (_, res) => {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          deletedAt: null,
        },
      });
      res.status(200).json({ data: transactions, message: "success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: [], message: "Error Get Transactions" });
    }
  }
);

app.get<string, { id: string }, ApiResponse<TransactionWithItems | null>>(
  "/transaction/:id",
  async (req, res) => {
    try {
      const transaction = await prisma.transaction.findFirstOrThrow({
        where: {
          id: parseInt(req.params.id),
          deletedAt: null,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  warehouse: true,
                },
              },
            },
          },
        },
      });
      res.status(200).json({ data: transaction, message: "success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Get Transactions" });
    }
  }
);

app.post<string, null, ApiResponse<null>, TransactionRequest>(
  "/transaction",
  async (req, res) => {
    try {
      await prisma.transaction.create({
        data: {
          ...req.body,
          items: {
            createMany: {
              data: req.body.items,
            },
          },
        },
      });

      console.log(req.body.items);
      console.log(req.body.type);

      // const transaction = await prisma.transaction.create({
      //   data: {
      //     type: req.body.type,
      //   },
      // });

      // await prisma.transactionItem.createMany({
      //   data: req.body.items.map((item) => ({
      //     transactionId: transaction.id,
      //     productId: item.productId,
      //     price: item.price,
      //     quantity: item.quantity,
      //   })),
      // });

      res.status(201).json({ data: null, message: "Success Created" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Create Transaction" });
    }
  }
);

app.delete("/transaction/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        deletedAt: new Date(),
      },
    });
    res.status(200).json({ message: "transaction soft deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error Delete Transaction" });
  }
});

app.put<string, { id: string }, ApiResponse<null>, TransactionRequest>(
  "/transaction/:id",
  async (req, res) => {
    try {
      await prisma.transaction.update({
        where: { id: parseInt(req.params.id) },
        data: {
          type: req.body.type,
        },
      });

      await prisma.transactionItem.deleteMany({
        where: {
          transactionId: parseInt(req.params.id),
        },
      });

      await prisma.transactionItem.createMany({
        data: req.body.items.map((item) => ({
          transactionId: parseInt(req.params.id),
          productId: item.productId,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      res.status(200).json({ data: null, message: "Success Update" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: null, message: "Error Update Transaction" });
    }
  }
);

//end Transaction

const connectPrisma = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to Prisma!");
  } catch (error) {
    console.error("Error connecting to Prisma:", error);
  }
};

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

connectPrisma();
