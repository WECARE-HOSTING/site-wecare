import "server-only";
import { get, put } from "@vercel/blob";

/**
 * Durable results for things that are slow or cost money to produce (AI translations, nearby
 * places). They live in a private Vercel Blob store, one JSON file per key, and survive deploys.
 *
 * Why not `unstable_cache`: its key includes the source of the cached function, which changes
 * with every build, so every deploy emptied the cache and the AI work was redone (and billed).
 * Keys here are explicit: callers hash the source text, so a result is reused until that text
 * changes — and only then paid for again.
 */

const memory = new Map<string, unknown>(); // per-instance copy of what we already read or wrote
const inFlight = new Map<string, Promise<unknown>>();
const MEMORY_LIMIT = 400;

const pathFor = (namespace: string, id: string) => `reservas/${namespace}/${id}.json`;

async function read<T>(pathname: string): Promise<T | null> {
  const blob = await get(pathname, { access: "private" });
  if (!blob || blob.statusCode !== 200) return null;
  return (await new Response(blob.stream).json()) as T;
}

/**
 * The stored value for (namespace, id), or `compute()` stored for next time.
 * If the store itself can't be read this throws instead of computing: redoing paid work because
 * of a storage hiccup is worse than showing the original text for a moment.
 */
export function durable<T>(namespace: string, id: string, compute: () => Promise<T>): Promise<T> {
  const key = pathFor(namespace, id);
  if (memory.has(key)) return Promise.resolve(memory.get(key) as T);
  let work = inFlight.get(key) as Promise<T> | undefined;
  if (!work) {
    work = (async () => {
      const stored = await read<T>(key);
      const value = stored ?? (await compute());
      if (stored === null) {
        await put(key, JSON.stringify(value), { access: "private", contentType: "application/json", allowOverwrite: true, addRandomSuffix: false }).catch((err) =>
          console.error(`[reservas] could not store ${key}; the result will be recomputed next time`, err),
        );
      }
      if (memory.size >= MEMORY_LIMIT) memory.delete(memory.keys().next().value as string);
      memory.set(key, value);
      return value;
    })().finally(() => inFlight.delete(key));
    inFlight.set(key, work);
  }
  return work;
}
