// Financial-related types

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: "income" | "expense";
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionDTO {
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: "income" | "expense";
}
