export interface TaskInterface {
  _id: string;
  title: string;
  description: string;
  flag: "urgent" | "priority" | "normal";
  marked_as_done?: boolean;
}
