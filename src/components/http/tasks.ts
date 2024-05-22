import request from ".";
import { TaskInterface } from "../interface/task.interface";
import process from "process";

export default class TaskProvider {
  constructor(
    private token: string,
    private module?: string,
  ) {
    this.module = "task";
  }

  public async create(task: TaskInterface) {
    return request.post(
      `${process.env.NEXT_PUBLIC_API_URL_BASE}/${this.module}`,
      new URLSearchParams({
        title: task.title,
        description: task.description,
        flag: task.flag,
      }).toString(),
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }

  public async tasks() {
    return request.get(
      `${process.env.NEXT_PUBLIC_API_URL_BASE}/${this.module}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }

  public async task(id: string) {
    return request.get(
      `${process.env.NEXT_PUBLIC_API_URL_BASE}/${this.module}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }

  public async update(task: TaskInterface) {
    return request.put(
      `${process.env.NEXT_PUBLIC_API_URL_BASE}/${this.module}/${task._id}`,
      new URLSearchParams({
        title: task.title,
        description: task.description,
        flag: task.flag,
      }).toString(),
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
  }

  public async check(id: string, done: boolean) {
    return request.put(
      `${process.env.NEXT_PUBLIC_API_URL_BASE}/${this.module}/${id}`,
      new URLSearchParams({ marked_as_done: done ? "0" : "1" }).toString(),
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
  }

  public async drop(id: string) {
    return request.delete(
      `${process.env.NEXT_PUBLIC_API_URL_BASE}/${this.module}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }
}
