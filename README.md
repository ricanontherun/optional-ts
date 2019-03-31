# Optional\<Ts>

Java 8 Optional\<T>, but for Typescript.

# Usage
```typescript
import {Optional} from 'optional-ts';

// Wrap possibly null values.
const presentOptional: Optional<number> = Optional.ofNullable(possiblyNullValue());

// Or not? If that's your thing...
const presentOptional: Optional<number> = Optional.of(100);
const nullOptional: Optional<number> = Optional.ofNullable(null);

// Check if present
presentOptional.isPresent(); // true
nullOptional.isPresent(); //false

// Get the contained value (throws)
presentOptional.get(); // 100
nullOptional.get(); // Error

// Fallback to another value if not present
presentOptional.orElse(100); // 100
nullOptional.orElse(2); // 2

// Compute another value if not present
presentOptional.orElseGet(() => 1000); // 100 (original)
nullOptional.orElseGet(() => 1000); // 1000

// Process value if present
await presentOptional.ifPresent((value: number) => {
  doSomethingWithValue(value);
});

// Filter
await presentOptional.filter((value: number) => number > 1); // Optional<number>(100)
await presentOptional.filter((value: number) => number === 1000); // Optional.empty()
await nullOptional.filter((value: number) => number === 1000); // Optional.empty()

// Map
interface IData {
  first: string;
  last: string;
}

const presentData: Optional<IData> = Optional.of({
  first: "Christian",
  last: "Roman",
});

const optionalString: Optional<string> = await presentData.map((data: IData): string => {
  return `Hello, ${data.first} ${data.last}`;
});

optionalString.ifPresent((value: string) => {
  console.log(value); // Hello, Christian Roman
});
