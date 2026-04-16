/**
 * Register Page Tests
 *
 * Verifies the Register component renders correctly:
 * - Shows all required form fields (name, org, email, password)
 * - Shows create account button
 * - Shows link to login page
 * - Enforces min password length
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../pages/auth/Register';

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

describe('Register Page', () => {
  const renderRegister = () =>
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

  it('renders the create account heading', () => {
    renderRegister();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });

  it('renders first name input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Jane')).toBeInTheDocument();
  });

  it('renders last name input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
  });

  it('renders organization name input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Acme Inc.')).toBeInTheDocument();
  });

  it('renders email input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument();
  });

  it('renders password input with min length hint', () => {
    renderRegister();
    const passInput = screen.getByPlaceholderText('Min. 8 characters');
    expect(passInput).toBeInTheDocument();
    expect(passInput).toHaveAttribute('minLength', '8');
  });

  it('renders create account button', () => {
    renderRegister();
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  it('renders link to login page', () => {
    renderRegister();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
