interface CancellablePromise<T> extends Promise<T> {
  cancel: (reason?: string) => void;
  isCancelled: () => boolean;
}

interface CancellableOptions {
  abortable?: boolean;
  cancelReason?: string;
}

function makeCancellable<T>(
  asyncFn: (params?: { signal?: AbortSignal }) => Promise<T> | T,
  options: CancellableOptions = {}
): CancellablePromise<T> {
  let cancelRequested = false;
  let cancelHandler: ((reason: string) => void) | null = null;
  const abortController = options.abortable ? new AbortController() : null;
  const cancelReason = options.cancelReason || "Operation cancelled by user";

  const cancel = (customReason?: string) => {
    if (cancelRequested) return;
    cancelRequested = true;

    if (abortController) {
      abortController.abort(customReason || cancelReason);
    }

    if (cancelHandler) {
      cancelHandler(customReason || cancelReason);
    }
  };

  const promise = new Promise<T>((resolve, reject) => {
    cancelHandler = reject;

    try {
      const result = abortController
        ? asyncFn({ signal: abortController.signal })
        : asyncFn();

      Promise.resolve(result)
        .then((res) => {
          if (cancelRequested) {
            reject(cancelReason);
          } else {
            resolve(res);
          }
        })
        .catch((err) => {
          if (
            cancelRequested ||
            (abortController && err.name === "AbortError")
          ) {
            reject(cancelReason);
          } else {
            reject(err);
          }
        });
    } catch (syncError) {
      reject(syncError);
    }
  }) as CancellablePromise<T>;

  promise.cancel = cancel;
  promise.isCancelled = () => cancelRequested;

  return promise;
}

export { makeCancellable };
