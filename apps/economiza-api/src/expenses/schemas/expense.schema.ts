import { Schema } from "mongoose";
import { ExpenseType } from "@economiza/shared/src/types/financial";

export const ExpenseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    tagIds: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    date: { type: Date, required: true, index: true },
    type: {
      type: String,
      enum: Object.values(ExpenseType),
      default: ExpenseType.ONE_TIME,
    },
    attachmentUrl: { type: String },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: "expenses",
    timestamps: true,
  }
);

// Indexes for common queries
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ categoryIds: 1 });
ExpenseSchema.index({ tagIds: 1 });
