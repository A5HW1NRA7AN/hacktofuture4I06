/**
 * Auth Store Tests
 *
 * Verifies Zustand authentication state management:
 * - Setting user + token
 * - Clearing state on logout
 * - isAuthenticated derived state
 * - Zustand persist middleware integration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    localStorage.clear();
  });

  it('starts unauthenticated with no user or token', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('setAuth stores user and token and sets isAuthenticated', () => {
    const mockUser = {
      id: 'u-1',
      email: 'test@voxbridge.io',
      first_name: 'Test',
      last_name: 'User',
      is_active: true,
    };
    useAuthStore.getState().setAuth(mockUser, 'jwt-token-abc');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('jwt-token-abc');
  });

  it('persists auth state via zustand persist middleware', () => {
    const mockUser = { id: '1', email: 'a@b.com', first_name: 'A', last_name: 'B', is_active: true };
    useAuthStore.getState().setAuth(mockUser, 'persist-token');

    // Zustand persist stores under the persist key "voxbridge-auth"
    const stored = localStorage.getItem('voxbridge-auth');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.token).toBe('persist-token');
    expect(parsed.state.isAuthenticated).toBe(true);
  });

  it('logout clears user, token, and isAuthenticated', () => {
    const mockUser = { id: '1', email: 'a@b.com', first_name: 'A', last_name: 'B', is_active: true };
    useAuthStore.getState().setAuth(mockUser, 'some-token');

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('updateUser merges partial user data', () => {
    const mockUser = { id: '1', email: 'a@b.com', first_name: 'A', last_name: 'B', is_active: true };
    useAuthStore.getState().setAuth(mockUser, 'token');

    useAuthStore.getState().updateUser({ first_name: 'Updated' });

    const state = useAuthStore.getState();
    expect(state.user?.first_name).toBe('Updated');
    expect(state.user?.email).toBe('a@b.com'); // unchanged
  });

  it('updateUser is a no-op when user is null', () => {
    useAuthStore.getState().updateUser({ first_name: 'Nope' });
    expect(useAuthStore.getState().user).toBeNull();
  });
});
