import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const DEFAULT_TTL = 30; // seconds

let redis: Redis | null = null;

// Initialize redis lazily (gracefully handle missing redis)
function getRedis(): Redis | null {
    if (redis) return redis;
    try {
        redis = new Redis(REDIS_URL, {
            connectTimeout: 3000,
            maxRetriesPerRequest: 1,
            lazyConnect: true,
        });
        redis.on('error', (err) => {
            // Muted to reduce log noise (Redis is optional)
            // console.warn('[Redis] Connection error:', err.message);
            redis = null;
        });
        return redis;
    } catch {
        return null;
    }
}

/**
 * Express cache middleware.
 * Caches GET responses in Redis with TTL.
 * If Redis is unavailable, passes through without caching.
 */
export function cache(ttl: number = DEFAULT_TTL) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') return next();

        const client = getRedis();
        if (!client) return next();

        const key = `tc:${req.originalUrl}`;

        try {
            const cached = await client.get(key);
            if (cached) {
                res.setHeader('X-Cache', 'HIT');
                return res.json(JSON.parse(cached));
            }
        } catch {
            return next();
        }

        // Override res.json to capture response and cache it
        const originalJson = res.json.bind(res);
        res.json = (body: unknown) => {
            const r = client.setex(key, ttl, JSON.stringify(body));
            r.catch(() => { }); // fire-and-forget
            res.setHeader('X-Cache', 'MISS');
            return originalJson(body);
        };

        next();
    };
}

export async function invalidateCache(pattern: string): Promise<void> {
    const client = getRedis();
    if (!client) return;
    try {
        const keys = await client.keys(`tc:${pattern}`);
        if (keys.length > 0) await client.del(...keys);
    } catch {
        // Silently ignore cache errors
    }
}
