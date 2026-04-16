import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import type { ThemeMode } from '../types/theme';
import { themes } from '../config/themes';

/* ------------------------------------------------------------------ */
/*  InputField — isolated focus state to prevent full-form re-renders  */
/* ------------------------------------------------------------------ */
interface InputFieldProps {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly name: string;
  readonly placeholder: string;
  readonly icon: string;
  readonly t: typeof themes.dark;
  readonly delay: number;
}

function InputField({ id, label, type, name, placeholder, icon, t, delay }: InputFieldProps): React.JSX.Element {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  const hasValue = value.length > 0;

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '24px',
        animation: `fadeInUp 0.5s ease ${delay}s both`,
      }}
    >
      {/* Floating label */}
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: '48px',
          top: focused || hasValue ? '8px' : '50%',
          transform: focused || hasValue ? 'none' : 'translateY(-50%)',
          fontSize: focused || hasValue ? '0.7rem' : '0.95rem',
          fontWeight: 500,
          color: focused ? t.accentPrimary : t.textMuted,
          letterSpacing: '0.03em',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
          zIndex: 2,
          textTransform: focused || hasValue ? 'uppercase' : 'none',
        }}
      >
        {label}
      </label>

      {/* Icon */}
      <span
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1.15rem',
          opacity: focused ? 1 : 0.4,
          transition: 'opacity 0.25s ease',
          zIndex: 2,
        }}
      >
        {icon}
      </span>

      {/* Input */}
      <input
        id={id}
        type={type}
        name={name}
        required
        placeholder={focused ? placeholder : ''}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: hasValue || focused ? '24px 16px 10px 48px' : '18px 16px 18px 48px',
          backgroundColor: focused ? `color-mix(in srgb, ${t.inputBg} 100%, ${t.accentPrimary} 5%)` : t.inputBg,
          border: `1.5px solid ${focused ? t.inputFocusBorder : t.inputBorder}`,
          borderRadius: '14px',
          color: t.textPrimary,
          fontSize: '0.95rem',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          outline: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: focused ? `0 0 0 3px ${t.accentGlow}` : 'none',
        }}
      />

      {/* Bottom glow line */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: focused ? '80%' : '0%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${t.accentPrimary}, transparent)`,
          borderRadius: '1px',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AuthApp — main component                                          */
/* ------------------------------------------------------------------ */
function AuthApp(): React.JSX.Element {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isBtnPressed, setIsBtnPressed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') setThemeMode(saved);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  const handleFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>, formType: string) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      console.log(`${formType} submitted:`, data);
      alert(`${formType} successful! Check console for payload.`);
    },
    [],
  );

  const t = themes[themeMode];
  const isDark = themeMode === 'dark';

  const styles = useMemo((): Record<string, CSSProperties> => ({
    /* ---- Page ---- */
    page: {
      backgroundImage: t.bgGradient,
      backgroundSize: '200% 200%',
      animation: 'gradientShift 15s ease infinite',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
      color: t.textPrimary,
      position: 'relative',
      overflow: 'hidden',
      transition: 'color 0.4s ease',
    },

    /* ---- Floating orbs ---- */
    orb1: {
      position: 'fixed',
      width: '500px',
      height: '500px',
      borderRadius: '50%',
      background: t.overlayOrb1,
      top: '-10%',
      right: '-5%',
      animation: 'orb1Move 20s ease-in-out infinite',
      pointerEvents: 'none',
      zIndex: 0,
    },
    orb2: {
      position: 'fixed',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: t.overlayOrb2,
      bottom: '-10%',
      left: '-5%',
      animation: 'orb2Move 25s ease-in-out infinite',
      pointerEvents: 'none',
      zIndex: 0,
    },

    /* ---- Header ---- */
    header: {
      position: 'relative',
      zIndex: 10,
      width: '100%',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    themeBtn: {
      background: t.glass,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      color: t.textPrimary,
      border: `1px solid ${t.glassBorder}`,
      padding: '10px 22px',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '0.85rem',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      letterSpacing: '0.02em',
    },

    /* ---- Main ---- */
    main: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      position: 'relative',
      zIndex: 1,
    },

    /* ---- Card ---- */
    card: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      maxWidth: '980px',
      background: t.surface,
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      borderRadius: '28px',
      overflow: 'hidden',
      border: `1px solid ${t.glassBorder}`,
      boxShadow: t.shadowCard,
      animation: 'fadeInUp 0.7s ease both',
    },

    /* ---- Branding side ---- */
    branding: {
      flex: 1.15,
      padding: '60px 48px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      background: isDark
        ? 'linear-gradient(160deg, rgba(10, 14, 26, 0.8) 0%, rgba(20, 30, 60, 0.4) 100%)'
        : 'linear-gradient(160deg, rgba(254, 243, 199, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)',
      borderRight: `1px solid ${t.glassBorder}`,
      overflow: 'hidden',
    },
    brandingDecorRing: {
      position: 'absolute',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      border: `1px solid ${t.glassBorder}`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'spinSlow 60s linear infinite',
      pointerEvents: 'none',
    },
    brandingDecorRing2: {
      position: 'absolute',
      width: '420px',
      height: '420px',
      borderRadius: '50%',
      border: `1px dashed ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'spinSlow 90s linear infinite reverse',
      pointerEvents: 'none',
    },
    logo: {
      width: '130px',
      marginBottom: '24px',
      filter: isDark ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
      animation: 'float 6s ease-in-out infinite',
      position: 'relative',
      zIndex: 2,
    },
    projectName: {
      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      fontSize: '2.6rem',
      fontWeight: 800,
      backgroundImage: `linear-gradient(135deg, ${t.accentPrimary}, ${t.accentSecondary})`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 12px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      position: 'relative',
      zIndex: 2,
    },
    tagline: {
      color: t.textSecondary,
      fontSize: '1.05rem',
      fontStyle: 'italic',
      margin: '0 0 32px 0',
      position: 'relative',
      zIndex: 2,
      lineHeight: 1.6,
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
      textAlign: 'left',
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: t.textSecondary,
      fontSize: '0.88rem',
      fontWeight: 500,
    },
    featureDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: t.accentPrimary,
      flexShrink: 0,
    },

    /* ---- Auth side ---- */
    auth: {
      flex: 1,
      padding: '48px 44px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    authTitle: {
      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      fontSize: '1.6rem',
      fontWeight: 700,
      margin: '0 0 4px 0',
      color: t.textPrimary,
    },
    authSubtitle: {
      fontSize: '0.9rem',
      color: t.textSecondary,
      margin: '0 0 28px 0',
      fontWeight: 400,
    },

    /* ---- Tabs ---- */
    tabsContainer: {
      display: 'flex',
      marginBottom: '32px',
      background: t.glass,
      borderRadius: '14px',
      padding: '4px',
      border: `1px solid ${t.glassBorder}`,
    },

    /* ---- Divider ---- */
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      margin: '20px 0',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: t.borderColor,
    },
    dividerText: {
      fontSize: '0.75rem',
      fontWeight: 600,
      color: t.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  }), [t, isDark]);

  // Tab style — computed per-tab
  const tabStyle = (isActive: boolean): CSSProperties => ({
    flex: 1,
    textAlign: 'center',
    padding: '12px 0',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
    color: isActive ? (isDark ? '#fff' : t.textPrimary) : t.textMuted,
    background: isActive ? t.surfaceAlt : 'transparent',
    borderRadius: '10px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    outline: 'none',
    position: 'relative',
  });

  // Submit button
  const submitBtnStyle: CSSProperties = {
    width: '100%',
    padding: '16px',
    background: isBtnHovered
      ? `linear-gradient(135deg, ${t.accentPrimaryHover}, ${t.accentPrimary})`
      : `linear-gradient(135deg, ${t.accentSecondary}, ${t.accentPrimary})`,
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    cursor: 'pointer',
    marginTop: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isBtnHovered ? t.shadowButton : 'none',
    transform: isBtnPressed ? 'scale(0.97)' : isBtnHovered ? 'translateY(-2px)' : 'none',
    animation: 'fadeInUp 0.5s ease 0.6s both',
  };

  const loginFields = [
    { id: 'login-email', label: 'Email Address', type: 'email', name: 'email', placeholder: 'you@company.com', icon: '✉️', delay: 0.2 },
    { id: 'login-pwd', label: 'Password', type: 'password', name: 'password', placeholder: '••••••••', icon: '🔒', delay: 0.35 },
  ];

  const signupFields = [
    { id: 'signup-user', label: 'Username', type: 'text', name: 'user_name', placeholder: 'johndoe', icon: '👤', delay: 0.2 },
    { id: 'signup-email', label: 'Email Address', type: 'email', name: 'email', placeholder: 'you@company.com', icon: '✉️', delay: 0.3 },
    { id: 'signup-pwd', label: 'Password', type: 'password', name: 'password', placeholder: 'Create a strong password', icon: '🔒', delay: 0.4 },
  ];

  const fields = activeTab === 'login' ? loginFields : signupFields;

  return (
    <div style={styles.page}>
      {/* Animated background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Header */}
      <header style={styles.header}>
        <button
          onClick={toggleTheme}
          style={styles.themeBtn}
          type="button"
          id="theme-toggle"
        >
          {isDark ? '☀️' : '🌙'}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </header>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.card}>
          {/* ---- Left: Branding ---- */}
          <div style={styles.branding}>
            {/* Decorative rings */}
            <div style={styles.brandingDecorRing} />
            <div style={styles.brandingDecorRing2} />

            <img src="/logo.png" alt="OnePiece Logo" style={styles.logo} />
            <h1 style={styles.projectName}>OnePiece</h1>
            <p style={styles.tagline}>&ldquo;Unified your company&rsquo;s need&rdquo;</p>

            {/* Feature highlights */}
            <ul style={styles.featureList}>
              {['Secure & encrypted access', 'Team collaboration tools', 'Real-time analytics dashboard', 'Enterprise-grade reliability'].map(
                (feat) => (
                  <li key={feat} style={styles.featureItem}>
                    <span style={styles.featureDot} />
                    {feat}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* ---- Right: Auth ---- */}
          <div style={styles.auth}>
            <h2 style={styles.authTitle}>
              {activeTab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={styles.authSubtitle}>
              {activeTab === 'login'
                ? 'Enter your credentials to access your dashboard'
                : 'Fill in the details below to get started'}
            </p>

            {/* Tabs */}
            <div style={styles.tabsContainer} role="tablist" id="auth-tabs">
              <div
                role="tab"
                tabIndex={0}
                aria-selected={activeTab === 'login'}
                style={tabStyle(activeTab === 'login')}
                onClick={() => setActiveTab('login')}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTab('login')}
                id="tab-signin"
              >
                Sign In
              </div>
              <div
                role="tab"
                tabIndex={0}
                aria-selected={activeTab === 'signup'}
                style={tabStyle(activeTab === 'signup')}
                onClick={() => setActiveTab('signup')}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTab('signup')}
                id="tab-signup"
              >
                Sign Up
              </div>
            </div>

            {/* Form */}
            <form
              key={activeTab}
              onSubmit={(e) => handleFormSubmit(e, activeTab === 'login' ? 'Login' : 'Signup')}
              id={`form-${activeTab}`}
            >
              {fields.map((f) => (
                <InputField key={f.id} {...f} t={t} />
              ))}

              {/* Forgot password — login only */}
              {activeTab === 'login' && (
                <div
                  style={{
                    textAlign: 'right',
                    marginBottom: '16px',
                    marginTop: '-12px',
                    animation: 'fadeIn 0.4s ease 0.45s both',
                  }}
                >
                  <a
                    href="#"
                    style={{
                      color: t.accentPrimary,
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      letterSpacing: '0.02em',
                    }}
                    id="forgot-password-link"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                style={submitBtnStyle}
                onMouseEnter={() => setIsBtnHovered(true)}
                onMouseLeave={() => { setIsBtnHovered(false); setIsBtnPressed(false); }}
                onMouseDown={() => setIsBtnPressed(true)}
                onMouseUp={() => setIsBtnPressed(false)}
                id={`btn-${activeTab}`}
              >
                {activeTab === 'login' ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>

            {/* Bottom text */}
            <p
              style={{
                textAlign: 'center',
                marginTop: '24px',
                fontSize: '0.82rem',
                color: t.textMuted,
                animation: 'fadeIn 0.5s ease 0.8s both',
              }}
            >
              {activeTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <span
                onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                style={{
                  color: t.accentPrimary,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
              >
                {activeTab === 'login' ? 'Sign Up' : 'Sign In'}
              </span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '16px 20px',
          fontSize: '0.75rem',
          color: t.textMuted,
          position: 'relative',
          zIndex: 1,
          letterSpacing: '0.03em',
        }}
      >
        © 2026 OnePiece. All rights reserved.
      </footer>
    </div>
  );
}

export default AuthApp;
