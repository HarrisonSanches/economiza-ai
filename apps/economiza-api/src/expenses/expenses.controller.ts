// expenses.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ExpensesService } from "./expenses.service";
import { CreateExpenseDto, UpdateExpenseDto } from "./dto/expense.dto";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard("jwt"))
@Controller("expenses")
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async findAll(
    @Req() req: any,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("categoryIds") categoryIds?: string | string[] | undefined,
    @Query("tagIds") tagIds?: string | string[] | undefined,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    const userId = (req.user as any)?.id || (req.user as any)?._id;
    const catIds =
      typeof categoryIds === "string"
        ? categoryIds.split(",")
        : Array.isArray(categoryIds)
          ? categoryIds
          : undefined;
    const tIds =
      typeof tagIds === "string"
        ? tagIds.split(",")
        : Array.isArray(tagIds)
          ? tagIds
          : undefined;
    return this.expensesService.findAll(userId, {
      startDate,
      endDate,
      categoryIds: catIds,
      tagIds: tIds,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Req() req: any, @Body() data: CreateExpenseDto) {
    const userId = (req.user as any)?.id || (req.user as any)?._id;
    const expenseData = {
      ...data,
      date: new Date(data.date),
    };
    return this.expensesService.create(userId, expenseData);
  }

  @Put(":id")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Req() req: any,
    @Param("id") id: string,
    @Body() data: UpdateExpenseDto
  ) {
    const userId = (req.user as any)?.id || (req.user as any)?._id;
    const { date, ...rest } = data;
    const updateData =
      date !== undefined ? { ...rest, date: new Date(date as string) } : rest;
    return this.expensesService.update(userId, id, updateData);
  }

  @Delete(":id")
  async remove(@Req() req: any, @Param("id") id: string) {
    const userId = (req.user as any)?.id || (req.user as any)?._id;
    return this.expensesService.remove(userId, id);
  }
}
