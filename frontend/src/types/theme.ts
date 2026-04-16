// Theme type definitions
export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  readonly bg: string;
  readonly bgGradient: string;
  readonly surface: string;
  readonly surfaceAlt: string;
  readonly glass: string;
  readonly glassBorder: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly accentPrimary: string;
  readonly accentPrimaryHover: string;
  readonly accentSecondary: string;
  readonly accentGlow: string;
  readonly inputBg: string;
  readonly inputBorder: string;
  readonly inputFocusBorder: string;
  readonly borderColor: string;
  readonly shadowCard: string;
  readonly shadowButton: string;
  readonly overlayOrb1: string;
  readonly overlayOrb2: string;
}
