// Mock supabaseClient with full method chains (must be first)
import { vi } from 'vitest';
vi.mock('../lib/supabaseClient', () => {
  const insertChain = { select: () => ({ single: () => Promise.resolve({ data: { id: 'cat1', title: 'Test Category', owner_id: 1 }, error: null }) }) };
  return {
    supabase: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      from: (_table: string) => ({
        insert: () => insertChain,
      })
    }
  };
});

import { createCategory } from '../lib/categoryService';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Category API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a category', async () => {
    const category = await createCategory('Test Category', 1);
    expect(category).toBeDefined();
    expect(category.title).toBe('Test Category');
  });
});
