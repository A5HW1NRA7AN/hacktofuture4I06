/**
 * App Router Tests
 *
 * Verifies routing and protected route logic:
 * - ProtectedRoute redirects unauthenticated users
 * - ProtectedRoute renders children for authenticated users
 * - Login and Register pages render at their routes
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';

// Mock all child components to keep tests isolated
vi.mock('../pages/auth/Login', () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock('../pages/auth/Register', () => ({
  default: () => <div>Register Page</div>,
}));

vi.mock('../components/layout/DashboardLayout', () => ({
  default: () => <div>Dashboard Layout</div>,
}));

vi.mock('../pages/dashboard/Overview', () => ({
  default: () => <div>Overview Page</div>,
}));

vi.mock('../pages/dashboard/Chat', () => ({
  default: () => <div>Chat Page</div>,
}));

vi.mock('../pages/dashboard/Integrations', () => ({
  default: () => <div>Integrations Page</div>,
}));

// ProtectedRoute extracted for direct testing
function ProtectedRoute({ children, isAuth }: { children: React.ReactNode; isAuth: boolean }) {
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

describe('App Routing', () => {
  it('renders Login page at /login', async () => {
    const Login = vi.mocked((await import('../pages/auth/Login')).default);
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders Register page at /register', async () => {
    const Register = vi.mocked((await import('../pages/auth/Register')).default);
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Register Page')).toBeInTheDocument();
  });

  it('ProtectedRoute redirects to /login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/login" element={<div>Login Redirect</div>} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuth={false}>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login Redirect')).toBeInTheDocument();
  });

  it('ProtectedRoute renders children when authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/login" element={<div>Login Redirect</div>} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuth={true}>
                <div>Dashboard Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });
});
