import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { Product } from '@shared/models/product.model';
import { generateFakeProduct } from '@shared/models/product.mock';

import { CartService } from './cart.service';

describe('CartService', () => {
  let spectator: SpectatorService<CartService>;
  const createService = createServiceFactory(CartService);

  beforeEach(() => {
    spectator = createService();
  });

  it('should create the service', () => {
    expect(spectator.service).toBeDefined();
  });

  it('should initialize with an empty cart', () => {
    expect(spectator.service.cart()).toEqual([]);
    expect(spectator.service.total()).toBe(0);
  });

  it('should add a product to the cart', () => {
    const mockProduct: Product = generateFakeProduct();

    spectator.service.addToCart(mockProduct);
    expect(spectator.service.cart()).toContain(mockProduct);
    expect(spectator.service.cart()).toEqual([mockProduct]);
    expect(spectator.service.total()).toBe(mockProduct.price);
  });

  it('should add multiple products to the cart', () => {
    const mockProduct1: Product = generateFakeProduct({ price: 100 });

    const mockProduct2: Product = generateFakeProduct({ price: 200 });

    spectator.service.addToCart(mockProduct1);
    spectator.service.addToCart(mockProduct2);

    expect(spectator.service.cart()).toHaveLength(2);
    expect(spectator.service.cart()).toContain(mockProduct1);
    expect(spectator.service.cart()).toContain(mockProduct2);
    expect(spectator.service.total()).toBe(300);
  });

  it('should handle adding products with zero price', () => {
    const mockProduct: Product = generateFakeProduct({ price: 0 });

    spectator.service.addToCart(mockProduct);
    expect(spectator.service.cart()).toHaveLength(1);
    expect(spectator.service.total()).toBe(0);
  });

  it('should handle adding the same product multiple times', () => {
    const mockProduct: Product = generateFakeProduct({ price: 100 });

    spectator.service.addToCart(mockProduct);
    spectator.service.addToCart(mockProduct);
    spectator.service.addToCart(mockProduct);

    expect(spectator.service.cart()).toHaveLength(3);
    expect(spectator.service.total()).toBe(300);
  });

  it('should handle adding products with negative prices', () => {
    const mockProduct: Product = generateFakeProduct({ price: -50 });

    spectator.service.addToCart(mockProduct);
    expect(spectator.service.cart()).toHaveLength(1);
    expect(spectator.service.total()).toBe(-50);
  });
});
