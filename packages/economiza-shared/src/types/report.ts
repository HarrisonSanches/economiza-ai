// Report and Analytics types

export type ReportType = "summary" | "trend" | "category" | "custom";
export type ExportFormat = "pdf" | "csv" | "json";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ReportFilter {
  field: string;
  value: string | number | boolean;
}

export interface Report {
  id: string;
  userId: string;
  type: ReportType;
  dateRange: DateRange;
  filters: ReportFilter[];
  format: ExportFormat;
  createdAt: Date;
}
