import '@testing-library/jest-dom';

// Mock the next/router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    __esModule: true,
    ...originalModule,
    signIn: jest.fn(() => Promise.resolve({ ok: true })),
    signOut: jest.fn(() => Promise.resolve(true)),
    useSession: jest.fn(() => ({
      data: {
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          role: 'STUDENT',
        },
      },
      status: 'authenticated',
    })),
  };
});