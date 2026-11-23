# Known issues

Problems of the archive's sites that are understood and left as they are for now, with the fix that was weighed. A
problem leaves this file when it is fixed or no longer happens.

## Google sign-in writes errors to the console when the browser has no Google session

Found 2026-11-21 (the map session, on the No Man's Sky site's `localhost:5010`). Left as is by the owner the same day.

**What happens.** The shared sign-in (`AuthProvider` in `@seed-archive/ui`, `src/auth.tsx`) opens Google's One Tap
three seconds after a page loads, through the browser's FedCM. When the browser does not tell Google it is signed in
to Google, Google's own library (`accounts.google.com/gsi/client`) writes to `console.error`:

- `Not signed in with the identity provider.`
- `[GSI_LOGGER]: FedCM get() rejects with NetworkError: Error retrieving a token.`
- after leaving the page while One Tap waits: `… AbortError: signal is aborted without reason`.

In development Next.js counts each as an issue and shows its badge ("1 Issue").

**Where it shows.** The browser panes of Claude sessions, which keep no Google sign-in status for FedCM. Not in the
owner's Chrome signed in to Google, and never as a badge in production, where Next.js shows none. Visitors are not
affected; One Tap works for them.

**Not the cause any more.** Until 2026-11-21 the Google client lacked the origin `http://localhost` without a port,
and `gsi/status` answered 403 on every local site. The origin was added that day (Google Cloud project
`ethberry-atlas-archive`, the client "Seed Archive"); `gsi/status` answers 200 since.

**The fix weighed, not done.** Filter those messages out of `console.error` in the shared sign-in: wrap
`console.error` once, before One Tap opens, so a message that starts with one of Google's texts above is dropped and
every other message passes on to the original. Google's library writes them asynchronously, after the call that
opens One Tap has returned, so swapping the console out and back around that call would miss them; the wrapper has to
stay. The cost: it hides Google's real errors too (an origin missing from the client would go silent), and it patches
a global the whole page shares. The owner, 2026-11-21: "Такое себе решение", not planned for now.

**Another way, also not done.** Open One Tap only from the sign-in button, never by the timer. Google is then never
asked until a person asks, so nothing is written in any browser; but visitors lose the offer to sign in that appears
by itself.
