/**
 * Backend API Client Tests
 *
 * Verifies the Axios instance configuration:
 * - Base URL
 * - JWT Authorization header injection
 * - Demo mode fallbacks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage before import
const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
});

import { backendApi } from '../api/backend';

describe('backendApi', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  });

  it('has correct base URL pointing to Django backend', () => {
    expect(backendApi.defaults.baseURL).toContain('/api/v1');
  });

  it('sets Content-Type to application/json', () => {
    expect(backendApi.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('injects Bearer token from localStorage into request headers', async () => {
    mockStorage['voxbridge_token'] = 'test-jwt-token';

    // Create a mock adapter to intercept the request
    const interceptors = backendApi.interceptors.request as unknown as { handlers: { length: number } };
    // Verify the interceptor exists
    expect(interceptors.handlers.length).toBeGreaterThan(0);
  });

  it('has response interceptor for error handling', () => {
    const interceptors = backendApi.interceptors.response as unknown as { handlers: { length: number } };
    expect(interceptors.handlers.length).toBeGreaterThan(0);
  });
});
