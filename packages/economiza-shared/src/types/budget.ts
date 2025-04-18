// Budget and Goal types

export type BudgetPeriod = "weekly" | "monthly" | "yearly";
export type GoalStatus = "active" | "completed" | "failed";

export interface Budget {
  id: string;
  userId: string;
  categoryId?: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
  alertThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}
