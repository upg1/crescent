// Mock all required dependencies before importing the component
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({ GET: {}, POST: {} })),
}));

jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn().mockReturnValue({}),
}), { virtual: true });

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

// Import after mocking
import { authOptions } from '../[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  role: 'STUDENT',
  scholarParent: null,
  scholarChild: null,
};

describe('NextAuth Configuration', () => {
  describe('auth configuration', () => {
    it('should have correct pages config', () => {
      expect(authOptions.pages.signIn).toBe('/auth/signin');
      expect(authOptions.pages.error).toBe('/auth/error');
    });
    
    it('should have correct session settings', () => {
      expect(authOptions.session.strategy).toBe('jwt');
      expect(authOptions.session.maxAge).toBe(30 * 24 * 60 * 60); // 30 days
    });
    
    it('should have JWT callback', () => {
      expect(typeof authOptions.callbacks.jwt).toBe('function');
    });
    
    it('should have session callback', () => {
      expect(typeof authOptions.callbacks.session).toBe('function');
    });
  });
});