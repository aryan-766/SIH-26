import json
import time
from typing import Any, Callable, Optional
import logging

logger = logging.getLogger("cache")

class CacheManager:
    """
    Production-ready cache wrapper providing get_or_set, rate-limiting, and cache invalidation.
    Automatically uses Redis if available, with graceful in-memory TTL dictionary fallback.
    """
    def __init__(self):
        self._memory_store = {}
        self._redis = None
        self._connected = False
        self._init_redis()

    def _init_redis(self):
        try:
            import redis
            from app.core.config import settings
            r = redis.from_url(settings.REDIS_URL, socket_timeout=1)
            r.ping()
            self._redis = r
            self._connected = True
            logger.info("Connected to Redis successfully.")
        except Exception:
            self._connected = False
            logger.info("Redis not reachable. Operating with in-memory TTL cache fallback.")

    @property
    def is_connected(self) -> bool:
        return self._connected

    def get(self, key: str) -> Optional[Any]:
        if self._connected and self._redis:
            try:
                val = self._redis.get(key)
                return json.loads(val) if val else None
            except Exception:
                pass
        
        # Memory fallback
        item = self._memory_store.get(key)
        if item:
            expires_at, val = item
            if expires_at is None or expires_at > time.time():
                return val
            else:
                del self._memory_store[key]
        return None

    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        if self._connected and self._redis:
            try:
                self._redis.setex(key, ttl_seconds, json.dumps(value, default=str))
                return
            except Exception:
                pass
        
        expires_at = time.time() + ttl_seconds if ttl_seconds > 0 else None
        self._memory_store[key] = (expires_at, value)

    def delete(self, key: str):
        if self._connected and self._redis:
            try:
                self._redis.delete(key)
            except Exception:
                pass
        self._memory_store.pop(key, None)

    def get_or_set(self, key: str, ttl_seconds: int, fetch_fn: Callable[[], Any]) -> Any:
        cached = self.get(key)
        if cached is not None:
            return cached
        fresh_data = fetch_fn()
        self.set(key, fresh_data, ttl_seconds)
        return fresh_data

    def check_rate_limit(self, user_id: str, endpoint: str, limit: int = 60, window_sec: int = 60) -> bool:
        """
        Sliding window / counter rate-limiting. Returns True if request is allowed, False if exceeded.
        """
        key = f"ratelimit:{user_id}:{endpoint}"
        now = time.time()
        record = self._memory_store.get(key)
        if not record or record[0] < now:
            self._memory_store[key] = (now + window_sec, 1)
            return True
        count = record[1]
        if count >= limit:
            return False
        self._memory_store[key] = (record[0], count + 1)
        return True

cache = CacheManager()
