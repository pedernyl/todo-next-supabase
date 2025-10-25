import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createTodo, softDeleteTodo } from '../lib/dataService';

// Mock supabaseClient with full method chains (must be first)
vi.mock('../lib/supabaseClient', () => {
  const insertChain = { select: () => ({ single: () => Promise.resolve({ data: { id: '1', title: 'Test Todo', description: '', completed: false }, error: null }) }) };
  const updateChain = { eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: '1', deleted_timestamp: 1234567890, deleted_by: 'user1' }, error: null }) }) }) };
  return {
    supabase: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      from: (_table: unknown) => ({
        insert: () => insertChain,
        update: () => updateChain,
      })
    }
  };
});

// Mock next-auth getServerSession
vi.mock('next-auth', () => ({
  getServerSession: async () => ({ user: { email: 'test@example.com' } })
}));

// Mock fetch for user id with a typed mock
const fetchMock = vi.fn(async (url: RequestInfo) => {
  if (url.toString().includes('/api/userid')) {
    const resp = {
      ok: true,
      json: async () => ({ userId: 1 })
    } as unknown as Response;
    return resp;
  }
  throw new Error('Unknown fetch');
});
// Assign the typed mock to global.fetch for the test environment
// @ts-expect-error - test runtime injection
(global as unknown as { fetch: typeof fetch }) .fetch = fetchMock as unknown as typeof fetch;

describe('Todo API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a todo', async () => {
    const todo = await createTodo('Test Todo', '', undefined, undefined);
    expect(todo).toBeDefined();
    expect(todo.title).toBe('Test Todo');
  });

  it('soft deletes a todo', async () => {
    const deleted = await softDeleteTodo('1', 'user1');
    expect(deleted).toBeDefined();
    expect(deleted.deleted_by).toBe('user1');
  });
});
