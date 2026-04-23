export class FixedArray<T> {
  private readonly buffer: Array<T | undefined>;
  private startIndex = 0;
  private count = 0;

  public constructor(private readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Capacity must be a positive integer");
    }
    this.buffer = new Array<T | undefined>(capacity);
  }

  public add(value: T): void {
    if (this.count < this.capacity) {
      const endIndex = (this.startIndex + this.count) % this.capacity;
      this.buffer[endIndex] = value;
      this.count += 1;
      return;
    }

    this.buffer[this.startIndex] = value;
    this.startIndex = (this.startIndex + 1) % this.capacity;
  }

  public getAll(): T[] {
    const items: T[] = [];
    for (let i = 0; i < this.count; i += 1) {
      const index = (this.startIndex + i) % this.capacity;
      const value = this.buffer[index];
      if (value !== undefined) {
        items.push(value);
      }
    }
    return items;
  }
}
