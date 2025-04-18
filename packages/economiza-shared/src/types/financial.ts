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

// Expense-specific types

export enum ExpenseType {
  ONE_TIME = "one-time",
  RECURRING = "recurring",
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  categoryIds: string[];
  tagIds: string[];
  date: Date;
  type: ExpenseType;
  attachmentUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseDTO {
  amount: number;
  description: string;
  categoryIds: string[];
  tagIds?: string[];
  date: Date;
  notes?: string;
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {}
