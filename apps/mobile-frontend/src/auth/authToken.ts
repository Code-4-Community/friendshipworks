/**
 * The single seam between the API client and whatever auth provider this app
 * eventually uses.
 *
 * AWS Amplify was deliberately dropped: Amplify v6 pulls in native modules and
 * therefore cannot run in Expo Go, which every developer on this project is
 * required to use (see CLAUDE.md). Until an Expo-Go-compatible auth approach is
 * chosen, `getAccessToken()` resolves to `undefined` and requests go out
 * unauthenticated — the backend's `CognitoJWTGuard` answers `401` for any
 * non-`@Public()` route, which is the intended, visible behaviour.
 *
 * To wire auth up later, call `setAccessTokenProvider()` once during app
 * startup with a function that returns a currently valid Cognito **access**
 * token. The provider owns caching and refresh; it is awaited on every
 * outgoing request, so it must be cheap.
 */
export type AccessTokenProvider = () => Promise<string | undefined>;

const noAccessToken: AccessTokenProvider = async () => undefined;

let accessTokenProvider: AccessTokenProvider = noAccessToken;

/**
 * Registers the function the API client uses to obtain an access token.
 *
 * @param provider The provider to use, or `null` to go back to sending
 * requests unauthenticated.
 */
export function setAccessTokenProvider(
  provider: AccessTokenProvider | null,
): void {
  accessTokenProvider = provider ?? noAccessToken;
}

/**
 * Resolves the access token for the current session, or `undefined` when no
 * provider is registered or nobody is signed in.
 */
export async function getAccessToken(): Promise<string | undefined> {
  return accessTokenProvider();
}
