// expenses.service.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Expense } from "@economiza/shared/src/types/financial";

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel("Expense") private readonly expenseModel: Model<Expense>
  ) {}

  async findAll(
    userId: string,
    options?: {
      startDate?: string;
      endDate?: string;
      categoryIds?: string[];
      tagIds?: string[];
      page?: number;
      limit?: number;
    }
  ): Promise<{
    data: Expense[];
    pagination: { total: number; page: number; limit: number; pages: number };
  }> {
    const filter: any = { userId };

    if (options?.startDate) {
      filter.date = {
        ...(filter.date || {}),
        $gte: new Date(options.startDate),
      };
    }
    if (options?.endDate) {
      filter.date = { ...(filter.date || {}), $lte: new Date(options.endDate) };
    }
    if (options?.categoryIds && options.categoryIds.length > 0) {
      filter.categoryIds = { $in: options.categoryIds };
    }
    if (options?.tagIds && options.tagIds.length > 0) {
      filter.tagIds = { $in: options.tagIds };
    }

    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit =
      options?.limit && options.limit > 0 ? Math.min(options.limit, 50) : 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.expenseModel
        .find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.expenseModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async create(userId: string, data: Partial<Expense>): Promise<Expense> {
    const expense = new this.expenseModel({ ...data, userId });
    return expense.save();
  }

  async update(
    userId: string,
    expenseId: string,
    data: Partial<Expense>
  ): Promise<Expense | null> {
    return this.expenseModel
      .findOneAndUpdate(
        { _id: expenseId, userId },
        { $set: data },
        { new: true }
      )
      .exec();
  }

  async remove(
    userId: string,
    expenseId: string
  ): Promise<{ id: string; deleted: boolean }> {
    const res = await this.expenseModel
      .deleteOne({ _id: expenseId, userId })
      .exec();
    return { id: expenseId, deleted: res.deletedCount === 1 };
  }
}
