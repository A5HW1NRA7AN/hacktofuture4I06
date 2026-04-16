import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthApp from '../pages/AuthApp';

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

/** Render AuthApp and return a userEvent instance */
function setup() {
  const user = userEvent.setup();
  const result = render(<AuthApp />);
  return { user, ...result };
}

// ----------------------------------------------------------------
// 1. Initial Rendering
// ----------------------------------------------------------------
describe('AuthApp — Initial Rendering', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the page without crashing', () => {
    const { container } = setup();
    expect(container.firstChild).toBeTruthy();
  });

  it('displays the OnePiece logo', () => {
    setup();
    const logo = screen.getByAltText('OnePiece Logo');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('IMG');
  });

  it('displays the project name "OnePiece"', () => {
    setup();
    expect(screen.getByText('OnePiece')).toBeInTheDocument();
  });

  it('displays the tagline', () => {
    setup();
    // The tagline uses smart quotes rendered via HTML entities
    expect(screen.getByText(/Unified your company/)).toBeInTheDocument();
  });

  it('displays feature highlights', () => {
    setup();
    expect(screen.getByText('Secure & encrypted access')).toBeInTheDocument();
    expect(screen.getByText('Team collaboration tools')).toBeInTheDocument();
    expect(screen.getByText('Real-time analytics dashboard')).toBeInTheDocument();
    expect(screen.getByText('Enterprise-grade reliability')).toBeInTheDocument();
  });

  it('displays the footer copyright', () => {
    setup();
    expect(screen.getByText(/© 2026 OnePiece/)).toBeInTheDocument();
  });

  it('shows Sign In form by default (not Sign Up)', () => {
    setup();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Enter your credentials to access your dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Create account')).not.toBeInTheDocument();
  });

  it('renders Email and Password fields for login', () => {
    setup();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders the Sign In submit button', () => {
    setup();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the Forgot password link', () => {
    setup();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('renders "Don\'t have an account? Sign Up" prompt', () => {
    setup();
    expect(screen.getByText(/Don't have an account/)).toBeInTheDocument();
  });
});

// ----------------------------------------------------------------
// 2. Tab Switching
// ----------------------------------------------------------------
describe('AuthApp — Tab Switching', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Sign In tab is active by default', () => {
    setup();
    const signInTab = screen.getByRole('tab', { name: 'Sign In' });
    expect(signInTab).toHaveAttribute('aria-selected', 'true');
  });

  it('Sign Up tab is inactive by default', () => {
    setup();
    const signUpTab = screen.getByRole('tab', { name: 'Sign Up' });
    expect(signUpTab).toHaveAttribute('aria-selected', 'false');
  });

  it('switches to Sign Up form when Sign Up tab is clicked', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByText('Fill in the details below to get started')).toBeInTheDocument();
    expect(screen.queryByText('Welcome back')).not.toBeInTheDocument();
  });

  it('shows Username, Email, and Password fields in Sign Up form', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows Create Account button in Sign Up form', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('does not show Forgot password link in Sign Up form', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

    expect(screen.queryByText('Forgot password?')).not.toBeInTheDocument();
  });

  it('shows "Already have an account? Sign In" in Sign Up view', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

    expect(screen.getByText(/Already have an account/)).toBeInTheDocument();
  });

  it('switches back to Sign In when Sign In tab is clicked', async () => {
    const { user } = setup();
    // Switch to signup first
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));
    expect(screen.getByText('Create account')).toBeInTheDocument();

    // Switch back
    await user.click(screen.getByRole('tab', { name: 'Sign In' }));
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('toggles via the inline "Sign Up" / "Sign In" link', async () => {
    const { user } = setup();
    // Click the inline "Sign Up" span
    const signUpLink = screen.getByRole('button', { name: 'Sign Up' });
    await user.click(signUpLink);
    expect(screen.getByText('Create account')).toBeInTheDocument();

    // Click the inline "Sign In" span
    const signInLink = screen.getByRole('button', { name: 'Sign In' });
    await user.click(signInLink);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('supports keyboard navigation on tabs (Enter key)', () => {
    setup();
    const signUpTab = screen.getByRole('tab', { name: 'Sign Up' });
    fireEvent.keyDown(signUpTab, { key: 'Enter' });
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });
});

// ----------------------------------------------------------------
// 3. Theme Toggle
// ----------------------------------------------------------------
describe('AuthApp — Theme Toggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to dark mode and shows Light Mode toggle', () => {
    setup();
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });

  it('switches to light mode on toggle click', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /light mode/i }));
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('toggles back to dark mode on second click', async () => {
    const { user } = setup();
    const toggle = screen.getByRole('button', { name: /light mode/i });
    await user.click(toggle);
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /dark mode/i }));
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });

  it('persists theme to localStorage', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /light mode/i }));
    expect(localStorage.getItem('theme')).toBe('light');

    await user.click(screen.getByRole('button', { name: /dark mode/i }));
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('restores theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'light');
    setup();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('ignores invalid localStorage theme values', () => {
    localStorage.setItem('theme', 'neon');
    setup();
    // Should fall back to dark (default)
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });
});

// ----------------------------------------------------------------
// 4. Form Inputs — Interactions
// ----------------------------------------------------------------
describe('AuthApp — Input Interactions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('email input accepts typed values', async () => {
    const { user } = setup();
    const emailInput = screen.getByLabelText('Email Address');
    await user.click(emailInput);
    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('password input accepts typed values', async () => {
    const { user } = setup();
    const pwdInput = screen.getByLabelText('Password');
    await user.click(pwdInput);
    await user.type(pwdInput, 'secret123');
    expect(pwdInput).toHaveValue('secret123');
  });

  it('email input is of type "email"', () => {
    setup();
    const emailInput = screen.getByLabelText('Email Address');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('password input is of type "password"', () => {
    setup();
    const pwdInput = screen.getByLabelText('Password');
    expect(pwdInput).toHaveAttribute('type', 'password');
  });

  it('all login inputs are required', () => {
    setup();
    expect(screen.getByLabelText('Email Address')).toBeRequired();
    expect(screen.getByLabelText('Password')).toBeRequired();
  });

  it('all signup inputs are required', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

    expect(screen.getByLabelText('Username')).toBeRequired();
    expect(screen.getByLabelText('Email Address')).toBeRequired();
    expect(screen.getByLabelText('Password')).toBeRequired();
  });

  it('signup Username input is of type "text"', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

    expect(screen.getByLabelText('Username')).toHaveAttribute('type', 'text');
  });

  it('inputs have correct name attributes for FormData', async () => {
    const { user } = setup();
    expect(screen.getByLabelText('Email Address')).toHaveAttribute('name', 'email');
    expect(screen.getByLabelText('Password')).toHaveAttribute('name', 'password');

    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));
    expect(screen.getByLabelText('Username')).toHaveAttribute('name', 'user_name');
    expect(screen.getByLabelText('Email Address')).toHaveAttribute('name', 'email');
    expect(screen.getByLabelText('Password')).toHaveAttribute('name', 'password');
  });
});

// ----------------------------------------------------------------
// 5. Form Submission
// ----------------------------------------------------------------
describe('AuthApp — Form Submission', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('submits login form and logs data to console', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { user } = setup();

    await user.type(screen.getByLabelText('Email Address'), 'admin@co.com');
    await user.type(screen.getByLabelText('Password'), 'pass123');
    await user.click(screen.getByRole('button', { name: /sign in →/i }));

    expect(consoleSpy).toHaveBeenCalledWith('Login submitted:', {
      email: 'admin@co.com',
      password: 'pass123',
    });
    expect(alertSpy).toHaveBeenCalledWith('Login successful! Check console for payload.');
  });

  it('submits signup form and logs data to console', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { user } = setup();

    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));
    await user.type(screen.getByLabelText('Username'), 'johndoe');
    await user.type(screen.getByLabelText('Email Address'), 'john@co.com');
    await user.type(screen.getByLabelText('Password'), 'strong!');
    await user.click(screen.getByRole('button', { name: /create account →/i }));

    expect(consoleSpy).toHaveBeenCalledWith('Signup submitted:', {
      user_name: 'johndoe',
      email: 'john@co.com',
      password: 'strong!',
    });
    expect(alertSpy).toHaveBeenCalledWith('Signup successful! Check console for payload.');
  });
});

// ----------------------------------------------------------------
// 6. Accessibility
// ----------------------------------------------------------------
describe('AuthApp — Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('tabs have role="tab" and tabIndex', () => {
    setup();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    tabs.forEach((tab) => {
      expect(tab).toHaveAttribute('tabindex', '0');
    });
  });

  it('tab aria-selected reflects active state', async () => {
    const { user } = setup();
    const [signIn, signUp] = screen.getAllByRole('tab');

    expect(signIn).toHaveAttribute('aria-selected', 'true');
    expect(signUp).toHaveAttribute('aria-selected', 'false');

    await user.click(signUp);
    expect(signIn).toHaveAttribute('aria-selected', 'false');
    expect(signUp).toHaveAttribute('aria-selected', 'true');
  });

  it('tablist container has role="tablist"', () => {
    setup();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('inputs are associated with labels via htmlFor/id', () => {
    setup();
    const emailLabel = screen.getByText('Email Address');
    const emailInput = screen.getByLabelText('Email Address');
    expect(emailLabel.tagName).toBe('LABEL');
    expect(emailLabel).toHaveAttribute('for', emailInput.id);
  });

  it('theme toggle button has type="button" (no accidental submit)', () => {
    setup();
    const toggleBtn = screen.getByRole('button', { name: /light mode/i });
    expect(toggleBtn).toHaveAttribute('type', 'button');
  });

  it('submit buttons have type="submit"', () => {
    setup();
    const submitBtn = screen.getByRole('button', { name: /sign in →/i });
    expect(submitBtn).toHaveAttribute('type', 'submit');
  });

  it('inline toggle links have role="button" and tabIndex', async () => {
    setup();
    const inlineLink = screen.getByRole('button', { name: 'Sign Up' });
    expect(inlineLink).toHaveAttribute('tabindex', '0');
  });
});

// ----------------------------------------------------------------
// 7. Unique IDs (for browser testing / QA)
// ----------------------------------------------------------------
describe('AuthApp — Unique Element IDs', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('theme toggle has id="theme-toggle"', () => {
    setup();
    expect(document.getElementById('theme-toggle')).toBeInTheDocument();
  });

  it('tabs have unique IDs', () => {
    setup();
    expect(document.getElementById('tab-signin')).toBeInTheDocument();
    expect(document.getElementById('tab-signup')).toBeInTheDocument();
  });

  it('auth-tabs container has id="auth-tabs"', () => {
    setup();
    expect(document.getElementById('auth-tabs')).toBeInTheDocument();
  });

  it('login form has id="form-login"', () => {
    setup();
    expect(document.getElementById('form-login')).toBeInTheDocument();
  });

  it('login submit button has id="btn-login"', () => {
    setup();
    expect(document.getElementById('btn-login')).toBeInTheDocument();
  });

  it('signup form has id="form-signup"', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));
    expect(document.getElementById('form-signup')).toBeInTheDocument();
  });

  it('forgot-password link has id', () => {
    setup();
    expect(document.getElementById('forgot-password-link')).toBeInTheDocument();
  });
});

// ----------------------------------------------------------------
// 8. Edge Cases & Regression
// ----------------------------------------------------------------
describe('AuthApp — Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('switching tabs resets the form (new key forces remount)', async () => {
    const { user } = setup();
    // Type into login email
    await user.type(screen.getByLabelText('Email Address'), 'data');
    expect(screen.getByLabelText('Email Address')).toHaveValue('data');

    // Switch to signup and back
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));
    await user.click(screen.getByRole('tab', { name: 'Sign In' }));

    // Input should be reset because form is keyed by activeTab
    expect(screen.getByLabelText('Email Address')).toHaveValue('');
  });

  it('theme toggle does not affect which tab is active', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Sign Up' }));
    expect(screen.getByText('Create account')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /light mode/i }));
    // Still on signup
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  it('logo image has src="/logo.png"', () => {
    setup();
    const logo = screen.getByAltText('OnePiece Logo') as HTMLImageElement;
    expect(logo.getAttribute('src')).toBe('/logo.png');
  });

  it('renders correctly with no localStorage at all', () => {
    setup();
    // Should default to dark mode and sign-in tab
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });
});
