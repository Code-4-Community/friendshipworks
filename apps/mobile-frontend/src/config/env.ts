/**
 * Client-side configuration, read from Expo's public environment variables.
 *
 * `process.env.EXPO_PUBLIC_*` is NOT a runtime lookup. `babel-preset-expo`'s
 * `expo-inline-or-reference-env-vars` plugin rewrites each
 * `process.env.EXPO_PUBLIC_<NAME>` expression at transform time: it inlines the
 * literal value into production bundles, and in development and under Jest it
 * rewrites the read to `expo/virtual/env` (which is just `process.env`).
 *
 * Consequences to respect when editing this file:
 * - Only the `EXPO_PUBLIC_` prefix is replaced. Other names are unavailable.
 * - The expression must be written out literally. Destructuring
 *   (`const { EXPO_PUBLIC_X } = process.env`) and dynamic access
 *   (`process.env[key]`) are NOT rewritten and will be `undefined`.
 * - Values come from `apps/mobile-frontend/.env` — the Expo CLI loads dotenv
 *   files relative to the Expo project root, NOT the workspace root, so the
 *   repo-root `.env` used by the backend is not visible here.
 * - NEVER put a secret in an `EXPO_PUBLIC_` variable: it ships in the bundle.
 */

/**
 * Checks whether an environment variable value is a defined, non-empty string.
 *
 * @param value The environment variable value to check.
 * @returns `true` if the value is a defined, non-empty string; `false` otherwise.
 *
 * Also tells TypeScript that `value` is a `string` when this returns true.
 */
export function isNonEmptyEnv(value: string | undefined): value is string {
  if (value === undefined) {
    return false;
  }
  return value.trim() !== '';
}

/**
 * Fallback for local development against a backend on the same machine.
 *
 * `localhost` only works for the web target and for simulators. A physical
 * device running Expo Go must reach the backend over the LAN, so set
 * `EXPO_PUBLIC_API_BASE_URL=http://<your-machine-lan-ip>:3000` in
 * `apps/mobile-frontend/.env`.
 */
const DEFAULT_API_BASE_URL = 'http://localhost:3000';

// Assigned to a local first so the literal member expression is rewritten by
// the Expo Babel plugin before the emptiness check runs.
const configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const apiBaseUrl = isNonEmptyEnv(configuredApiBaseUrl)
  ? configuredApiBaseUrl
  : DEFAULT_API_BASE_URL;
