export class Stack<T> {
  private readonly items: T[] = [];

  public push(value: T): void {
    this.items.push(value);
  }

  public pop(): T | undefined {
    return this.items.pop();
  }

  public peek(): T | undefined {
    return this.items.length ? this.items[this.items.length - 1] : undefined;
  }

  public size(): number {
    return this.items.length;
  }
}
