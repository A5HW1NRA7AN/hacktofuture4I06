/**
 * Agent API Tests
 *
 * Verifies the sendAction function:
 * - Returns ActionResult on success
 * - Falls back to demo data on failure
 * - Demo responses match keywords (bug, done, blocked)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios', () => {
  const mockCreate = vi.fn(() => ({
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }));
  return { default: { create: mockCreate } };
});

describe('Agent API', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('sendAction returns demo fallback with jira actions on network error', async () => {
    const { sendAction } = await import('../api/agent');

    // sendAction falls back to demo when the agent is unreachable
    const result = await sendAction('create a standup ticket');

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.original_text).toBe('create a standup ticket');
    expect(result.actions_taken.length).toBeGreaterThan(0);
  });

  it('sendAction returns bug-themed response for bug keywords', async () => {
    const { sendAction } = await import('../api/agent');

    const result = await sendAction('there is a critical bug in the payment flow');

    expect(result.success).toBe(true);
    expect(result.actions_taken.some(a => a.tool === 'jira')).toBe(true);
    expect(result.message.toLowerCase()).toContain('bug');
  });

  it('sendAction returns done-themed response for completion keywords', async () => {
    const { sendAction } = await import('../api/agent');

    const result = await sendAction('the feature is done and merged');

    expect(result.success).toBe(true);
    expect(result.message.toLowerCase()).toContain('done');
  });

  it('sendAction returns blocked-themed response for blocker keywords', async () => {
    const { sendAction } = await import('../api/agent');

    const result = await sendAction('we are blocked on the dependency');

    expect(result.success).toBe(true);
    expect(result.message.toLowerCase()).toContain('block');
  });

  it('checkHealth returns false when agent is unreachable', async () => {
    const { checkHealth } = await import('../api/agent');

    const healthy = await checkHealth();
    expect(healthy).toBe(false);
  });
});
