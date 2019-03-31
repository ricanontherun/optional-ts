export class Optional<T> {
  public static empty<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  public static of<T>(value: T): Optional<T> {
    return new Optional(value);
  }

  public static ofNullable<T>(value: T | null): Optional<T | null> {
    return value ? Optional.of(value) : Optional.empty();
  }

  protected value!: T | null;

  protected constructor(value: T | null) {
    this.value = value;
  }

  public get(): T {
    if (!this.value) {
      throw new Error("Empty optional");
    }

    return this.value;
  }

  public isPresent(): boolean {
    return !!this.value;
  }

  public async ifPresent(consumer: (value: T) => Promise<any>): Promise<any> {
    if (this.value) {
      return consumer(this.value);
    }

    return;
  }

  public orElse(other: T): T {
    return this.value ? this.value : other;
  }

  public async orElseGet(supplier: () => T): Promise<T> {
    return this.value ? this.value : supplier();
  }

  public orElseThrow(): T {
    if (this.value) {
      return this.value;
    }

    throw new Error("Empty optional");
  }

  public async filter(predicate: (value: T) => boolean): Promise<Optional<T>> {
    if (!this.value) {
      return this;
    }

    return predicate(this.value) ? this : Optional.empty();
  }

  public async map<U>(mapper: (value: T) => U| null): Promise<Optional<any>> {
    if (!this.value) {
      return Optional.of(this.value);
    }

    const mapped: U | null = mapper(this.value);
    if (!mapped) {
      return Optional.empty<U>();
    }

    return Optional.of(mapped);
  }
 }
