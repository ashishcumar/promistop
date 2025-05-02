# Promistop ⏹️

> A lightweight utility to create cancellable promises in JavaScript

**Promistop** adds `.cancel()` and `.isCancelled()` methods to any async task, with optional `AbortController` support.

[![npm version](https://img.shields.io/npm/v/promistop)](https://www.npmjs.com/package/promistop)
[![bundle size](https://img.shields.io/bundlephobia/minzip/promistop)](https://bundlephobia.com/package/promistop)
[![license](https://img.shields.io/npm/l/promistop)](LICENSE)

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

```javascript
import { makeCancellable } from 'promistop';

const cancellable = makeCancellable(async ({ signal }) => {
  const res = await fetch('/api/data', { signal });
  return res.json();
}, { abortable: true });

cancellable
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Cancel the request if needed
cancellable.cancel("User navigated away");
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

