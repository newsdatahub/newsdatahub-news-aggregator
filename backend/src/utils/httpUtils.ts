/**
 * HTTP utility functions for making API requests
 */

export interface HttpError extends Error {
  statusCode?: number;
  body?: unknown;
}

/**
 * Makes a GET request to the specified URL with headers
 *
 * @param url - The URL to fetch
 * @param headers - HTTP headers to include
 * @returns Parsed JSON response
 * @throws HttpError if request fails
 */
export async function makeGetRequest<T>(
  url: string,
  headers: Record<string, string> = {}
): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as HttpError;
    error.statusCode = response.status;
    try {
      error.body = await response.json();
    } catch {
      // Ignore parse errors
    }
    throw error;
  }

  return response.json() as Promise<T>;
}

/**
 * Builds a query string from parameters object
 *
 * @param params - Object containing query parameters
 * @returns URL-encoded query string
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
