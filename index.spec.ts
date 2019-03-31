import { expect } from "chai";

import * as assert from "assert";

import { Optional } from "./index";

describe("Optional Unit Tests", () => {
  describe("Instantiation", () => {
    it("Can accept a T", () => {
      const maybeNumber: Optional<number> = Optional.of(1);
    });

    it("Can create an empty optional", () => {
      const emptyNumber: Optional<number> = Optional.empty();
    });
  });

  describe("Retrieving values", () => {
    const presentNumber: Optional<number> = Optional.of(100);
    const emptyNumber: Optional<number> = Optional.empty();

    describe("get", () => {
      it("can get() a present value", () => {
        const num: number = presentNumber.get();

        expect(num).to.be.equal(100, "num should equal 100");
      });

      it("will throw when calling get() on an empty Optional", () => {
        assert.throws(emptyNumber.get, Error);
      });
    });

    describe("orElse", () => {
      it("will return the original value if present", () => {
        expect(presentNumber.orElse(200)).to.be.equal(100);
      });

      it("will return the ELSE value if not present", () => {
        expect(emptyNumber.orElse(200)).to.be.equal(200);
      });
    });

    describe("orElseGet", () => {
      it("will not call the supplier if value is present", async () => {
        expect(await presentNumber.orElseGet(() => 1000)).to.equal(100);
      });

      it("will call the supplier if value is not present", async () => {
        expect(await emptyNumber.orElseGet(() =>  1000)).to.equal(1000);
      });
    });

    describe("orElseThrow", () => {
      it("will not throw when a value is present", () => {
          expect(presentNumber.orElseThrow()).to.be.equal(100);
      });

      it("will throw when a value is not present", () => {
        assert.throws(emptyNumber.orElseThrow);
      });
    });
  });

  describe("Presence", () => {
    const presentNumber: Optional<number> = Optional.of(100);
    const emptyOptional: Optional<number> = Optional.empty();
    const nullOptional = Optional.ofNullable(null);

    it("returns true when a value is present", () => {
      expect(presentNumber.isPresent()).to.be.equal(true);
    });

    it("returns false when a value is not present", () => {
      expect(emptyOptional.isPresent()).to.be.equal(false);
      expect(nullOptional.isPresent()).to.be.equal(false);
    });

    it("can asynchronously consume values, if present", async () => {
      let called: boolean = false;

      await presentNumber.ifPresent(async (num: number) => {
        called = true; // hacky
        expect(num).to.be.equal(100);
      });

      expect(called).to.be.equal(true);
    });

    it("will not call consumer if not present", async () => {
      let called: boolean = false;

      await emptyOptional.ifPresent(async (num: number) => {
        called = true; // hacky
      });

      // @ts-ignore
      await nullOptional.ifPresent(async (num: number) => {
        called = true; // hacky
      });

      expect(called).to.be.equal(false);
    });
  });

  describe("filter", () => {
    const presentNumber: Optional<number> = Optional.of(100);

    it("can filter values - accept", async () => {
      const filtered = await presentNumber.filter((value: number): boolean => {
        return value > 1;
      });

      expect(filtered.isPresent()).to.be.equal(true);
      expect(filtered.get()).to.be.equal(100);
    });

    it("can filter values - reject", async () => {
      const filtered = await presentNumber.filter((value: number): boolean => {
        return value === 120;
      });

      expect(filtered.isPresent()).to.be.equal(false);
    });
  });

  describe("map", () => {
    interface IData {
      first: string;
      last: string;
    }

    const presentData: Optional<IData> = Optional.of({
      first: "Christian",
      last: "Roman",
    });

    it ("can map T to T", async () => {
      const reversedData = await presentData.map((data: IData): IData => {
        return {
          first: data.last,
          last: data.first,
        };
      });

      expect(reversedData.get()).to.deep.equal({
        first: "Roman",
        last: "Christian",
      });
    });

    it("can map T to K", async () => {
      const optionalString: Optional<string> = await presentData.map((data: IData): string => {
        return `${data.first} ${data.last}`;
      });

      expect(optionalString.get()).to.be.equal("Christian Roman");
    });
  });
});
