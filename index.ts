export type ISupplier<T> = () => T;
export type IPredicate<T> = (value: T) => boolean;
export type IConsumer<T> = (value: T) => Promise<any>;
export type IMapper<T, U> = (value: T) => U | null;

/**
 * Class Optional<T>
 *
 *  Represent a value of type T, which may be empty (null).
 */
export class Optional<T> {
  /**
   * Create an empty Optional.
   */
  public static empty<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  /**
   * Create an Optional with a value.
   *
   * @param value
   */
  public static of<T>(value: any): Optional<T> {
    return new Optional(value);
  }

  /**
   * Create an Optional with possibly null value.
   *
   * @param value
   */
  public static ofNullable<T>(value: any): Optional<T> {
    return value ? Optional.of(value) : Optional.empty();
  }

  protected value!: T | null;

  protected constructor(value: any) {
    this.value = value;
  }

  /**
   * Get the value
   *
   * @throws Error
   */
  public get(): T {
    if (!this.value) {
      throw new Error("Empty optional");
    }

    return this.value;
  }

  /**
   * Get the value, if non-null, returning other if null.
   *
   * @param other
   */
  public orElse(other: T): T {
    return this.value ? this.value : other;
  }

  /**
   * Get the value, if non-null, executing supplier() if null.
   *
   * @param supplier
   */
  public async orElseGet(supplier: ISupplier<T>): Promise<T> {
    return this.value ? this.value : supplier();
  }

  /**
   * Get the value, if non-null, throwing an Error if null
   *
   * @throws Error
   */
  public orElseThrow(): T {
    if (this.value) {
      return this.value;
    }

    throw new Error("Empty optional");
  }

  /**
   * Check if the value contained is non-null.
   */
  public isPresent(): boolean {
    return !!this.value;
  }

  /**
   * If a non-null value is present, execute a consumer fn(T)
   *
   * @param consumer
   */
  public async ifPresent(consumer: IConsumer<T>): Promise<any> {
    if (this.value) {
      return consumer(this.value);
    }

    return;
  }

  /**
   * If present, execute predicate() on the value, returning the value if true, empty Optional otherwise.
   * @param predicate
   */
  public async filter(predicate: IPredicate<T>): Promise<Optional<T>> {
    if (!this.value) {
      return this;
    }

    return predicate(this.value) ? this : Optional.empty();
  }

  /**
   * If present, execute mapper() on the stored value, returning the result as a new Optional,
   * but return a new empty Optional otherwise.
   * @param mapper
   */
  public async map<U>(mapper: IMapper<T, U>): Promise<Optional<any>> {
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
