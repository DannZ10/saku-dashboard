// One source of truth for the idle window, read by the route handler on the server
// and by the idle timer in the browser, so the two can never drift apart.
export const IDLE_MINUTES = Math.max(1, Number(process.env.NEXT_PUBLIC_SESSION_IDLE_MINUTES) || 15);
export const IDLE_SECONDS = IDLE_MINUTES * 60;

// How long before the cutoff the browser warns the user.
export const WARN_SECONDS = Math.min(60, Math.floor(IDLE_SECONDS / 3));

export const SESSION_COOKIE = 'saku_session';
