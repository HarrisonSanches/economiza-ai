// expenses.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { ExpensesService } from "./expenses.service";

@Controller("expenses")
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async findAll() {
    // TODO: Replace with actual user ID from auth context
    return this.expensesService.findAll("mock-user-id");
  }

  @Post()
  async create(@Body() data: any) {
    // TODO: Replace with actual user ID from auth context
    return this.expensesService.create("mock-user-id", data);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: any) {
    // TODO: Replace with actual user ID from auth context
    return this.expensesService.update("mock-user-id", id, data);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    // TODO: Replace with actual user ID from auth context
    return this.expensesService.remove("mock-user-id", id);
  }
}
