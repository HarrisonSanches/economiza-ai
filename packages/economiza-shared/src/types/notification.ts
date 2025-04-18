// Notification and Webhook types

export type NotificationType = "budget_alert" | "goal_progress" | "system";
export type NotificationStatus = "pending" | "delivered" | "failed" | "read";
export type WebhookEvent =
  | "expense.created"
  | "budget.alert"
  | "goal.completed";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  createdAt: Date;
  readAt?: Date;
}

export interface WebhookEndpoint {
  id: string;
  userId: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  createdAt: Date;
}
