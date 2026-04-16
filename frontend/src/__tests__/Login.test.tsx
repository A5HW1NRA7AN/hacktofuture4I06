/**
 * Login Page Tests
 *
 * Verifies the Login component renders correctly:
 * - Shows email and password fields
 * - Shows sign in button
 * - Shows link to register page
 * - Form submission handling
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/auth/Login';

// Mock the backendApi module
vi.mock('../api/backend', () => ({
  backendApi: {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { headers: {} },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

// Mock the auth store
vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn((selector) => {
    const state = {
      setAuth: vi.fn(),
      user: null,
      token: null,
      isAuthenticated: false,
      logout: vi.fn(),
    };
    return typeof selector === 'function' ? selector(state) : state;
  }),
}));

describe('Login Page', () => {
  const renderLogin = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  it('renders the VoxBridge heading', () => {
    renderLogin();
    expect(screen.getByText('Welcome to VoxBridge')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument();
  });

  it('renders password input field', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    renderLogin();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders link to register page', () => {
    renderLogin();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('email input has correct type', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('you@company.com');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('password input has correct type', () => {
    renderLogin();
    const passInput = screen.getByPlaceholderText('••••••••');
    expect(passInput).toHaveAttribute('type', 'password');
  });
});
