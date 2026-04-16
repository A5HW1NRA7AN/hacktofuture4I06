import { describe, it, expect } from 'vitest';
import { themes } from '../config/themes';
import type { ThemeMode, ThemeColors } from '../types/theme';

// ----------------------------------------------------------------
// Theme configuration validation
// ----------------------------------------------------------------
describe('Theme Configuration', () => {
  const requiredKeys: (keyof ThemeColors)[] = [
    'bg',
    'bgGradient',
    'surface',
    'surfaceAlt',
    'glass',
    'glassBorder',
    'textPrimary',
    'textSecondary',
    'textMuted',
    'accentPrimary',
    'accentPrimaryHover',
    'accentSecondary',
    'accentGlow',
    'inputBg',
    'inputBorder',
    'inputFocusBorder',
    'borderColor',
    'shadowCard',
    'shadowButton',
    'overlayOrb1',
    'overlayOrb2',
  ];

  const themeModes: ThemeMode[] = ['dark', 'light'];

  it('should export both dark and light themes', () => {
    expect(themes).toHaveProperty('dark');
    expect(themes).toHaveProperty('light');
  });

  themeModes.forEach((mode) => {
    describe(`${mode} theme`, () => {
      it('should have all required colour keys', () => {
        for (const key of requiredKeys) {
          expect(themes[mode]).toHaveProperty(key);
          expect(typeof themes[mode][key]).toBe('string');
        }
      });

      it('should have non-empty values for every key', () => {
        for (const key of requiredKeys) {
          expect(themes[mode][key].trim().length).toBeGreaterThan(0);
        }
      });

      it('should have valid hex or rgba/rgb colours for base tokens', () => {
        const colourRegex = /^(#[0-9a-fA-F]{3,8}|rgba?\(.*\))$/;
        const baseTokens: (keyof ThemeColors)[] = [
          'bg',
          'textPrimary',
          'textSecondary',
          'textMuted',
          'accentPrimary',
          'accentPrimaryHover',
          'accentSecondary',
        ];
        for (const key of baseTokens) {
          expect(themes[mode][key]).toMatch(colourRegex);
        }
      });

      it('should have gradient strings for gradient tokens', () => {
        expect(themes[mode].bgGradient).toContain('linear-gradient');
        expect(themes[mode].overlayOrb1).toContain('radial-gradient');
        expect(themes[mode].overlayOrb2).toContain('radial-gradient');
      });

      it('should have box-shadow values for shadow tokens', () => {
        expect(themes[mode].shadowCard).toContain('px');
        expect(themes[mode].shadowButton).toContain('px');
      });
    });
  });

  it('dark and light themes should have different bg colours', () => {
    expect(themes.dark.bg).not.toBe(themes.light.bg);
  });

  it('dark and light themes should have different text colours', () => {
    expect(themes.dark.textPrimary).not.toBe(themes.light.textPrimary);
  });
});
