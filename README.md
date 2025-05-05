# Promistop

> A lightweight utility to create cancellable promises in JavaScript

**Promistop** adds `.cancel()` and `.isCancelled()` methods to any async task, with optional `AbortController` support.

![Build](https://img.shields.io/github/actions/workflow/status/ashishcumar/promistop/publish.yml)
![Fast](https://img.shields.io/badge/fast-5kb-blue)
![Lightweight](https://img.shields.io/badge/lightweight-5kb-green)
![Npm-Version](https://img.shields.io/npm/v/promistop.svg)
![Trusted](https://img.shields.io/badge/trusted-orange)
![No Dependency](https://img.shields.io/badge/dependencies-none-brightgreen)

## 🔧 Features

- Cancel any async function using `.cancel(reason?)`
- Check if a promise was cancelled using `.isCancelled()`
- Optional support for `AbortSignal` (e.g., for `fetch`)
- Tiny and framework-agnostic

## 📦 Installation

```bash
npm install promistop
```

## 🚀 Usage
### - API Call with `fetch` and `AbortSignal`
```ts
import { makeCancellable } from "promistop";

const cancellable = makeCancellable(
  async ({ signal }) => {
    const res = await fetch("/api/data", { signal });
    return res.json();
  },
  { abortable: true }
);

cancellable
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// Cancel the request if needed
cancellable.cancel("User navigated away");
```

### - Wrapping a `setTimeout`
```ts
import { makeCancellable } from "promistop";

const delay = (ms: number) =>
  makeCancellable(
    () =>
      new Promise((resolve) => {
        const id = setTimeout(() => resolve("Done waiting"), ms);
        // Optional cleanup if extending
        return () => clearTimeout(id);
      }),
    { cancelReason: "Timeout manually cancelled" }
  );

const timeoutPromise = delay(3000);

timeoutPromise.then(console.log).catch(console.error);

// Cancel before it completes
setTimeout(() => {
  timeoutPromise.cancel("Cancelled early");
}, 1000);
```

## 🧩 API

### `makeCancellable(asyncFn, options?)`

Creates a cancellable promise from any async function.

#### Parameters:

- **asyncFn**: `(params?: { signal?: AbortSignal }) => Promise<T> | T` – your async task
- **options**:
  - **abortable?**: `boolean` – enable AbortController support
  - **cancelReason?**: `string` – default cancel message

#### Returns:

A `CancellablePromise<T>` with:

- `.cancel(reason?)` - Cancels the promise with an optional reason
- `.isCancelled()` - Returns whether the promise has been cancelled

## ⚠️ Issues/Errors

For any hiccups with the package, drop an email to Kumarashish87998@gmail.com with "Error || Promistop" as the subject. 📧
