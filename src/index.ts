export interface CollectionConstructor {
	new (): Collection<unknown, unknown>;
	new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): Collection<K, V>;
	new <K, V>(iterable: Iterable<readonly [K, V]>): Collection<K, V>;
	readonly prototype: Collection<unknown, unknown>;
	readonly [Symbol.species]: CollectionConstructor;
}

/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 * @property {number} size - The amount of elements in this collection.
 */
export class Collection<K, V> extends Map<K, V> {
	public static readonly default: typeof Collection = Collection;
	public ['constructor']: typeof Collection;

	/**
	 * Identical to [Map.get()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get).
	 * Gets an element with the specified key, and returns its value, or `undefined` if the element does not exist.
	 * @param {*} key - The key to get from this collection
	 * @returns {* | undefined}
	 */
	public get(key: K): V | undefined {
		return super.get(key);
	}

	/**
	 * Identical to [Map.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set).
	 * Sets a new element in the collection with the specified key and value.
	 * @param {*} key - The key of the element to add
	 * @param {*} value - The value of the element to add
	 * @returns {Collection}
	 */
	public set(key: K, value: V): this {
		return super.set(key, value);
	}

	/**
	 * Identical to [Map.has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has).
	 * Checks if an element exists in the collection.
	 * @param {*} key - The key of the element to check for
	 * @returns {boolean} `true` if the element exists, `false` if it does not exist.
	 */
	public has(key: K): boolean {
		return super.has(key);
	}

	/**
	 * Identical to [Map.delete()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete).
	 * Deletes an element from the collection.
	 * @param {*} key - The key to delete from the collection
	 * @returns {boolean} `true` if the element was removed, `false` if the element does not exist.
	 */
	public delete(key: K): boolean {
		return super.delete(key);
	}

	/**
	 * Identical to [Map.clear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear).
	 * Removes all elements from the collection.
	 * @returns {undefined}
	 */
	public clear(): void {
		return super.clear();
	}

	/**
	 * Checks if all of the elements exist in the collection.
	 * @param {...*} keys - The keys of the elements to check for
	 * @returns {boolean} `true` if all of the elements exist, `false` if at least one does not exist.
	 */
	public hasAll(...keys: K[]): boolean {
		return keys.every((k) => super.has(k));
	}

	/**
	 * Checks if any of the elements exist in the collection.
	 * @param {...*} keys - The keys of the elements to check for
	 * @returns {boolean} `true` if any of the elements exist, `false` if none exist.
	 */
	public hasAny(...keys: K[]): boolean {
		return keys.some((k) => super.has(k));
	}

	/**
	 * Obtains the first value(s) in this collection.
	 * @param {number} [amount] Amount of values to obtain from the beginning
	 * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the end if
	 * amount is negative
	 */
	public first(): V | undefined;
	public first(amount: number): V[];
	public first(amount?: number): V | V[] | undefined {
		if (typeof amount === 'undefined') return this.values().next().value;
		if (amount < 0) return this.last(amount * -1);
		amount = Math.min(this.size, amount);
		const iter = this.values();
		return Array.from({ length: amount }, (): V => iter.next().value);
	}

	/**
	 * Obtains the first key(s) in this collection.
	 * @param {number} [amount] Amount of keys to obtain from the beginning
	 * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the end if
	 * amount is negative
	 */
	public firstKey(): K | undefined;
	public firstKey(amount: number): K[];
	public firstKey(amount?: number): K | K[] | undefined {
		if (typeof amount === 'undefined') return this.keys().next().value;
		if (amount < 0) return this.lastKey(amount * -1);
		amount = Math.min(this.size, amount);
		const iter = this.keys();
		return Array.from({ length: amount }, (): K => iter.next().value);
	}

	/**
	 * Obtains the last value(s) in this collection.
	 * @param {number} [amount] Amount of values to obtain from the end
	 * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the start if
	 * amount is negative
	 */
	public last(): V | undefined;
	public last(amount: number): V[];
	public last(amount?: number): V | V[] | undefined {
		const arr = [...this.values()];
		if (typeof amount === 'undefined') return arr[arr.length - 1];
		if (amount < 0) return this.first(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}

	/**
	 * Obtains the last key(s) in this collection.
	 * @param {number} [amount] Amount of keys to obtain from the end
	 * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the start if
	 * amount is negative
	 */
	public lastKey(): K | undefined;
	public lastKey(amount: number): K[];
	public lastKey(amount?: number): K | K[] | undefined {
		const arr = [...this.keys()];
		if (typeof amount === 'undefined') return arr[arr.length - 1];
		if (amount < 0) return this.firstKey(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}

	/**
	 * Obtains unique random value(s) from this collection.
	 * @param {number} [amount] Amount of values to obtain randomly
	 * @returns {*|Array<*>} A single value if no amount is provided or an array of values
	 */
	public random(): V | undefined;
	public random(amount: number): V[];
	public random(amount?: number): V | V[] | undefined {
		const arr = [...this.values()];
		if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
		if (!arr.length || !amount) return [];
		return Array.from(
			{ length: Math.min(amount, arr.length) },
			(): V => arr.splice(Math.floor(Math.random() * arr.length), 1)[0],
		);
	}

	/**
	 * Obtains unique random key(s) from this collection.
	 * @param {number} [amount] Amount of keys to obtain randomly
	 * @returns {*|Array<*>} A single key if no amount is provided or an array
	 */
	public randomKey(): K | undefined;
	public randomKey(amount: number): K[];
	public randomKey(amount?: number): K | K[] | undefined {
		const arr = [...this.keys()];
		if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
		if (!arr.length || !amount) return [];
		return Array.from(
			{ length: Math.min(amount, arr.length) },
			(): K => arr.splice(Math.floor(Math.random() * arr.length), 1)[0],
		);
	}

	/**
	 * Searches for a single item where the given function returns a truthy value. This behaves like
	 * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
	 * <warn>All collections used in Discord.js are mapped using their `id` property, and if you want to find by id you
	 * should use the `get` method. See
	 * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
	 * @param {Function} fn The function to test with (should return boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {*}
	 * @example collection.find(user => user.username === 'Bob');
	 */
	public find<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): V2 | undefined;
	public find(fn: (value: V, key: K, collection: this) => boolean): V | undefined;
	public find<This, V2 extends V>(
		fn: (this: This, value: V, key: K, collection: this) => value is V2,
		thisArg: This,
	): V2 | undefined;
	public find<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): V | undefined;
	public find(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): V | undefined {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return val;
		}
		return undefined;
	}

	/**
	 * Searches for the key of a single item where the given function returns a truthy value. This behaves like
	 * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex),
	 * but returns the key rather than the positional index.
	 * @param {Function} fn The function to test with (should return boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {*}
	 * @example collection.findKey(user => user.username === 'Bob');
	 */
	public findKey<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): K2 | undefined;
	public findKey(fn: (value: V, key: K, collection: this) => boolean): K | undefined;
	public findKey<This, K2 extends K>(
		fn: (this: This, value: V, key: K, collection: this) => key is K2,
		thisArg: This,
	): K2 | undefined;
	public findKey<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): K | undefined;
	public findKey(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): K | undefined {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return key;
		}
		return undefined;
	}

	/**
	 * Removes items that satisfy the provided filter function.
	 * @param {Function} fn Function used to test (should return a boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {number} The number of removed entries
	 */
	public sweep(fn: (value: V, key: K, collection: this) => boolean): number;
	public sweep<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): number;
	public sweep(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): number {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const previousSize = this.size;
		for (const [key, val] of this) {
			if (fn(val, key, this)) this.delete(key);
		}
		return previousSize - this.size;
	}

	/**
	 * Identical to
	 * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
	 * but returns a Collection instead of an Array.
	 * @param {Function} fn The function to test with (should return boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection}
	 * @example collection.filter(user => user.username === 'Bob');
	 */
	public filter<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): Collection<K2, V>;
	public filter<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): Collection<K, V2>;
	public filter(fn: (value: V, key: K, collection: this) => boolean): this;
	public filter<This, K2 extends K>(
		fn: (this: This, value: V, key: K, collection: this) => key is K2,
		thisArg: This,
	): Collection<K2, V>;
	public filter<This, V2 extends V>(
		fn: (this: This, value: V, key: K, collection: this) => value is V2,
		thisArg: This,
	): Collection<K, V2>;
	public filter<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): this;
	public filter(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): this {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results = new this.constructor[Symbol.species]<K, V>() as this;
		for (const [key, val] of this) {
			if (fn(val, key, this)) results.set(key, val);
		}
		return results;
	}

	/**
	 * Partitions the collection into two collections where the first collection
	 * contains the items that passed and the second contains the items that failed.
	 * @param {Function} fn Function used to test (should return a boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection[]}
	 * @example const [big, small] = collection.partition(guild => guild.memberCount > 250);
	 */
	public partition<K2 extends K>(
		fn: (value: V, key: K, collection: this) => key is K2,
	): [Collection<K2, V>, Collection<Exclude<K, K2>, V>];
	public partition<V2 extends V>(
		fn: (value: V, key: K, collection: this) => value is V2,
	): [Collection<K, V2>, Collection<K, Exclude<V, V2>>];
	public partition(fn: (value: V, key: K, collection: this) => boolean): [this, this];
	public partition<This, K2 extends K>(
		fn: (this: This, value: V, key: K, collection: this) => key is K2,
		thisArg: This,
	): [Collection<K2, V>, Collection<Exclude<K, K2>, V>];
	public partition<This, V2 extends V>(
		fn: (this: This, value: V, key: K, collection: this) => value is V2,
		thisArg: This,
	): [Collection<K, V2>, Collection<K, Exclude<V, V2>>];
	public partition<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): [this, this];
	public partition(
		fn: (value: V, key: K, collection: this) => boolean,
		thisArg?: unknown,
	): [Collection<K, V>, Collection<K, V>] {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results: [Collection<K, V>, Collection<K, V>] = [
			new this.constructor[Symbol.species]() as Collection<K, V>,
			new this.constructor[Symbol.species]() as Collection<K, V>,
		];
		for (const [key, val] of this) {
			if (fn(val, key, this)) {
				results[0].set(key, val);
			} else {
				results[1].set(key, val);
			}
		}
		return results;
	}

	/**
	 * Maps each item into a Collection, then joins the results into a single Collection. Identical in behavior to
	 * [Array.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap).
	 * @param {Function} fn Function that produces a new Collection
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection}
	 * @example collection.flatMap(guild => guild.members.cache);
	 */
	public flatMap<T>(fn: (value: V, key: K, collection: this) => Collection<K, T>): Collection<K, T>;
	public flatMap<T, This>(
		fn: (this: This, value: V, key: K, collection: this) => Collection<K, T>,
		thisArg: This,
	): Collection<K, T>;
	public flatMap<T>(fn: (value: V, key: K, collection: this) => Collection<K, T>, thisArg?: unknown): Collection<K, T> {
		const collections = this.map(fn, thisArg);
		return (new this.constructor[Symbol.species]() as Collection<K, T>).concat(...collections);
	}

	/**
	 * Maps each item to another value into an array. Identical in behavior to
	 * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
	 * @param {Function} fn Function that produces an element of the new array, taking three arguments
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Array}
	 * @example collection.map(user => user.tag);
	 */
	public map<T>(fn: (value: V, key: K, collection: this) => T): T[];
	public map<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): T[];
	public map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): T[] {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const iter = this.entries();
		return Array.from({ length: this.size }, (): T => {
			const [key, value] = iter.next().value;
			return fn(value, key, this);
		});
	}

	/**
	 * Maps each item to another value into a collection. Identical in behavior to
	 * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
	 * @param {Function} fn Function that produces an element of the new collection, taking three arguments
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection}
	 * @example collection.mapValues(user => user.tag);
	 */
	public mapValues<T>(fn: (value: V, key: K, collection: this) => T): Collection<K, T>;
	public mapValues<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): Collection<K, T>;
	public mapValues<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): Collection<K, T> {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const coll = new this.constructor[Symbol.species]() as Collection<K, T>;
		for (const [key, val] of this) coll.set(key, fn(val, key, this));
		return coll;
	}

	/**
	 * Checks if there exists an item that passes a test. Identical in behavior to
	 * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
	 * @param {Function} fn Function used to test (should return a boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {boolean}
	 * @example collection.some(user => user.discriminator === '0000');
	 */
	public some(fn: (value: V, key: K, collection: this) => boolean): boolean;
	public some<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): boolean;
	public some(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return true;
		}
		return false;
	}

	/**
	 * Checks if all items passes a test. Identical in behavior to
	 * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
	 * @param {Function} fn Function used to test (should return a boolean)
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {boolean}
	 * @example collection.every(user => !user.bot);
	 */
	public every<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): this is Collection<K2, V>;
	public every<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): this is Collection<K, V2>;
	public every(fn: (value: V, key: K, collection: this) => boolean): boolean;
	public every<This, K2 extends K>(
		fn: (this: This, value: V, key: K, collection: this) => key is K2,
		thisArg: This,
	): this is Collection<K2, V>;
	public every<This, V2 extends V>(
		fn: (this: This, value: V, key: K, collection: this) => value is V2,
		thisArg: This,
	): this is Collection<K, V2>;
	public every<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): boolean;
	public every(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (!fn(val, key, this)) return false;
		}
		return true;
	}

	/**
	 * Applies a function to produce a single value. Identical in behavior to
	 * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
	 * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
	 * and `collection`
	 * @param {*} [initialValue] Starting value for the accumulator
	 * @returns {*}
	 * @example collection.reduce((acc, guild) => acc + guild.memberCount, 0);
	 */
	public reduce<T>(fn: (accumulator: T, value: V, key: K, collection: this) => T, initialValue?: T): T {
		let accumulator!: T;

		if (typeof initialValue !== 'undefined') {
			accumulator = initialValue;
			for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
			return accumulator;
		}
		let first = true;
		for (const [key, val] of this) {
			if (first) {
				accumulator = val as unknown as T;
				first = false;
				continue;
			}
			accumulator = fn(accumulator, val, key, this);
		}

		// No items iterated.
		if (first) {
			throw new TypeError('Reduce of empty collection with no initial value');
		}

		return accumulator;
	}

	/**
	 * Identical to
	 * [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
	 * but returns the collection instead of undefined.
	 * @param {Function} fn Function to execute for each element
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection}
	 * @example
	 * collection
	 *  .each(user => console.log(user.username))
	 *  .filter(user => user.bot)
	 *  .each(user => console.log(user.username));
	 */
	public each(fn: (value: V, key: K, collection: this) => void): this;
	public each<T>(fn: (this: T, value: V, key: K, collection: this) => void, thisArg: T): this;
	public each(fn: (value: V, key: K, collection: this) => void, thisArg?: unknown): this {
		this.forEach(fn as (value: V, key: K, map: Map<K, V>) => void, thisArg);
		return this;
	}

	/**
	 * Runs a function on the collection and returns the collection.
	 * @param {Function} fn Function to execute
	 * @param {*} [thisArg] Value to use as `this` when executing function
	 * @returns {Collection}
	 * @example
	 * collection
	 *  .tap(coll => console.log(coll.size))
	 *  .filter(user => user.bot)
	 *  .tap(coll => console.log(coll.size))
	 */
	public tap(fn: (collection: this) => void): this;
	public tap<T>(fn: (this: T, collection: this) => void, thisArg: T): this;
	public tap(fn: (collection: this) => void, thisArg?: unknown): this {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		fn(this);
		return this;
	}

	/**
	 * Creates an identical shallow copy of this collection.
	 * @returns {Collection}
	 * @example const newColl = someColl.clone();
	 */
	public clone(): this {
		return new this.constructor[Symbol.species](this) as this;
	}

	/**
	 * Combines this collection with others into a new collection. None of the source collections are modified.
	 * @param {...Collection} collections Collections to merge
	 * @returns {Collection}
	 * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
	 */
	public concat(...collections: Collection<K, V>[]): this {
		const newColl = this.clone();
		for (const coll of collections) {
			for (const [key, val] of coll) newColl.set(key, val);
		}
		return newColl;
	}

	/**
	 * Checks if this collection shares identical items with another.
	 * This is different to checking for equality using equal-signs, because
	 * the collections may be different objects, but contain the same data.
	 * @param {Collection} collection Collection to compare with
	 * @returns {boolean} Whether the collections have identical contents
	 */
	public equals(collection: Collection<K, V>): boolean {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!collection) return false; // runtime check
		if (this === collection) return true;
		if (this.size !== collection.size) return false;
		for (const [key, value] of this) {
			if (!collection.has(key) || value !== collection.get(key)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * The sort method sorts the items of a collection in place and returns it.
	 * The sort is not necessarily stable in Node 10 or older.
	 * The default sort order is according to string Unicode code points.
	 * @param {Function} [compareFunction] Specifies a function that defines the sort order.
	 * If omitted, the collection is sorted according to each character's Unicode code point value,
	 * according to the string conversion of each element.
	 * @returns {Collection}
	 * @example collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
	 */
	public sort(
		compareFunction: (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number = (x, y): number =>
			Number(x > y) || Number(x === y) - 1,
	): this {
		const entries = [...this.entries()];
		entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));

		// Perform clean-up
		super.clear();

		// Set the new entries
		for (const [k, v] of entries) {
			super.set(k, v);
		}
		return this;
	}

	/**
	 * The intersect method returns a new structure containing items where the keys are present in both original structures.
	 * @param {Collection} other The other Collection to filter against
	 * @returns {Collection}
	 */
	public intersect(other: Collection<K, V>): Collection<K, V> {
		return other.filter((_, k) => this.has(k));
	}

	/**
	 * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
	 * @param {Collection} other The other Collection to filter against
	 * @returns {Collection}
	 */
	public difference(other: Collection<K, V>): Collection<K, V> {
		return other.filter((_, k) => !this.has(k)).concat(this.filter((_, k) => !other.has(k)));
	}

	/**
	 * The sorted method sorts the items of a collection and returns it.
	 * The sort is not necessarily stable in Node 10 or older.
	 * The default sort order is according to string Unicode code points.
	 * @param {Function} [compareFunction] Specifies a function that defines the sort order.
	 * If omitted, the collection is sorted according to each character's Unicode code point value,
	 * according to the string conversion of each element.
	 * @returns {Collection}
	 * @example collection.sorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
	 */
	public sorted(
		compareFunction: (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number = (x, y): number =>
			Number(x > y) || Number(x === y) - 1,
	): this {
		return (new this.constructor[Symbol.species]([...this.entries()]) as this).sort((av, bv, ak, bk) =>
			compareFunction(av, bv, ak, bk),
		);
	}
}

export default Collection;
