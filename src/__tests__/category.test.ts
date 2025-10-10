import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCategory } from '../lib/categoryService';

vi.mock('../lib/supabaseClient', () => {
  const insertChain = { select: () => ({ single: () => Promise.resolve({ data: { id: 'cat1', title: 'Test Category', owner_id: 1 }, error: null }) }) };
  return {
    supabase: {
      from: (table) => ({
        insert: () => insertChain,
      })
    }
  };
});

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
