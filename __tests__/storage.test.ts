import { describe, it, expect } from 'vitest';
import { SPENDFLOW_STORAGE_KEYS } from '@/lib/constants/storage';

describe('Storage Key Constants', () => {
  it('defines valid storage keys', () => {
    expect(SPENDFLOW_STORAGE_KEYS.AUTH_USER).toBe('spendflow_auth_user_v1');
    expect(SPENDFLOW_STORAGE_KEYS.AUTH_TOKEN).toBe('spendflow_auth_token_v1');
    expect(SPENDFLOW_STORAGE_KEYS.TUTORIAL_SEEN).toBe('spendflow_tutorial_seen_v1');
    expect(SPENDFLOW_STORAGE_KEYS.TRIGGER_TOUR_ON_LOGIN).toBe('spendflow_trigger_tour_on_login_v1');
  });
});
