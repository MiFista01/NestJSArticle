import { PaginationMiddleware } from './pagination.middleware';

describe('PaginationMiddleware', () => {
  it('should be defined', () => {
    expect(new PaginationMiddleware()).toBeDefined();
  });
});
