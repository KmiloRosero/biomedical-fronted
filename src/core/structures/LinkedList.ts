export type EqualityFn<T> = (a: T, b: T) => boolean;

class LinkedListNode<T> {
  public next: LinkedListNode<T> | null = null;

  public constructor(public readonly value: T) {}
}

export class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private lengthValue = 0;
  private readonly equals: EqualityFn<T>;

  public constructor(equals?: EqualityFn<T>) {
    this.equals = equals ?? Object.is;
  }

  public append(value: T): void {
    const node = new LinkedListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.lengthValue = 1;
      return;
    }

    this.tail!.next = node;
    this.tail = node;
    this.lengthValue += 1;
  }

  public remove(value: T): boolean {
    if (!this.head) {
      return false;
    }

    if (this.equals(this.head.value, value)) {
      this.head = this.head.next;
      this.lengthValue -= 1;
      if (this.lengthValue === 0) {
        this.tail = null;
      }
      return true;
    }

    let previous = this.head;
    let current = this.head.next;
    while (current) {
      if (this.equals(current.value, value)) {
        previous.next = current.next;
        this.lengthValue -= 1;
        if (!previous.next) {
          this.tail = previous;
        }
        return true;
      }
      previous = current;
      current = current.next;
    }

    return false;
  }

  public shift(): T | undefined {
    if (!this.head) {
      return undefined;
    }

    const value = this.head.value;
    this.head = this.head.next;
    this.lengthValue -= 1;
    if (this.lengthValue === 0) {
      this.tail = null;
    }
    return value;
  }

  public peekFirst(): T | undefined {
    return this.head?.value;
  }

  public get size(): number {
    return this.lengthValue;
  }

  public toArray(): T[] {
    const items: T[] = [];
    let current = this.head;
    while (current) {
      items.push(current.value);
      current = current.next;
    }
    return items;
  }
}
