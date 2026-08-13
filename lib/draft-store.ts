import { createClient, type RedisClientType } from "redis";

const DRAFT_TTL_SECONDS = 60 * 60 * 24 * 30;
const MAX_DRAFT_BYTES = 15 * 1024 * 1024;

let client: RedisClientType | null = null;
let connecting: Promise<RedisClientType> | null = null;

function draftKey(email: string): string {
  return `form-draft:${email.trim().toLowerCase()}`;
}

export async function getRedis(): Promise<RedisClientType | null> {
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  if (client?.isOpen) return client;
  if (connecting) return connecting;

  const nextClient = createClient({ url });
  nextClient.on("error", (error) => {
    console.error("Redis:", error);
  });
  connecting = (async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      try {
        if (!nextClient.isOpen) await nextClient.connect();
        client = nextClient;
        connecting = null;
        return nextClient;
      } catch (error) {
        lastError = error;
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
    connecting = null;
    throw lastError;
  })();
  try {
    return await connecting;
  } catch (error) {
    connecting = null;
    client = null;
    throw error;
  }
}

export async function readDraft(email: string): Promise<string | null> {
  const redis = await getRedis();
  if (!redis) return null;
  return redis.get(draftKey(email));
}

export async function writeDraft(email: string, payload: string): Promise<void> {
  if (Buffer.byteLength(payload, "utf8") > MAX_DRAFT_BYTES) {
    throw new Error("Brouillon trop volumineux pour le cache Redis.");
  }
  const redis = await getRedis();
  if (!redis) {
    throw new Error("Redis n'est pas configuré (REDIS_URL).");
  }
  await redis.set(draftKey(email), payload, { EX: DRAFT_TTL_SECONDS });
}

export async function deleteDraft(email: string): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;
  await redis.del(draftKey(email));
}
