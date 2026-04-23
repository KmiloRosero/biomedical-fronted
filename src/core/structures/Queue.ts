import { LinkedList } from "./LinkedList";

export class Queue<T> {
  private readonly list = new LinkedList<T>();

  public enqueue(value: T): void {
    this.list.append(value);
  }

  public dequeue(): T | undefined {
    return this.list.shift();
  }

  public peek(): T | undefined {
    return this.list.peekFirst();
  }

  public size(): number {
    return this.list.size;
  }
}
