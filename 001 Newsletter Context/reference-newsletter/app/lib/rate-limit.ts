// New reference-app safeguard: bounded process-local throttling for login and registration.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_KEYS = 1000;
const attempts = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(key: string, limit: number): boolean {
	const now = Date.now();
	for (const [storedKey, entry] of attempts) {
		if (entry.expiresAt <= now) attempts.delete(storedKey);
	}
	const current = attempts.get(key);
	if (current && current.expiresAt > now && current.count >= limit) return false;
	if (!current || current.expiresAt <= now) {
		if (attempts.size >= MAX_KEYS) attempts.delete(attempts.keys().next().value!);
		attempts.set(key, { count: 1, expiresAt: now + WINDOW_MS });
	} else {
		current.count += 1;
	}
	return true;
}
