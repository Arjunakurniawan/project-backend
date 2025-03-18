export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  warehouseId: number;
  warehouse: Warehouse | null;
  categoryId: number;
  category: Category | null;
};

export type Category = {
  id: number;
  name: string;
};

export type Warehouse = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

// string union vs enum di typescript
type TransactionType = "INCOMING" | "OUTCOMING";

export type Transaction = {
  id: number;
  type: TransactionType;
  createdAt: Date;
};

export type TransactionWithItems = {
  id: number;
  type: TransactionType;
  createdAt: Date;
  items: TransactionItem[];
};

export type TransactionItem = {
  productId: number;
  transactionId: number;
  quantity: number;
  price: number;
  product: Product | null;
};

export type ProductRequest = {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  warehouseId: number;
  categoryId: number;
};

export type CategoryRequest = {
  name: string;
};

export type WarehouseRequest = {
  name: string;
  address: string;
  phone: string;
};

export type TransactionRequest = {
  type: TransactionType;
  items: [
    {
      productId: number;
      quantity: number;
      price: number;
    }
  ];
};

//response JSON
export type ApiResponse<T> = {
  data: T;
  message: string | null;
};
