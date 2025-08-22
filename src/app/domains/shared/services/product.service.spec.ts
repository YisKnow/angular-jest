import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator/jest';
import { environment } from '@env/environment';
import { ProductService } from './product.service';
import { generateFakeProduct } from '../models/product.mock';

describe('ProductService', () => {
  let spectator: SpectatorHttp<ProductService>;
  const createHttp = createHttpFactory(ProductService);

  beforeEach(() => {
    spectator = createHttp();
  });

  describe('getProducts', () => {
    const url = `${environment.apiUrl}/api/v1/products`;

    it('should get all products without params', () => {
      const fakeProducts = [generateFakeProduct(), generateFakeProduct()];

      spectator.service.getProducts().subscribe(products => {
        expect(products).toEqual(fakeProducts);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(fakeProducts);
    });

    it('should get products by category_id', () => {
      const fakeProducts = [generateFakeProduct(), generateFakeProduct()];
      const categoryId = '1';

      spectator.service.getProducts({ category_id: categoryId }).subscribe(products => {
        expect(products).toEqual(fakeProducts);
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products?categoryId=${categoryId}`, HttpMethod.GET);
      req.flush(fakeProducts);
    });

    it('should get products by category_slug', () => {
      const fakeProducts = [generateFakeProduct(), generateFakeProduct()];
      const categorySlug = 'electronics';

      spectator.service.getProducts({ category_slug: categorySlug }).subscribe(products => {
        expect(products).toEqual(fakeProducts);
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products?categorySlug=${categorySlug}`, HttpMethod.GET);
      req.flush(fakeProducts);
    });

    it('should handle error when getting products', () => {
      const errorMessage = 'Server error';

      spectator.service.getProducts({}).subscribe({
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products`, HttpMethod.GET);
      req.flush(null, { status: 500, statusText: errorMessage });
    });
  });

  describe('getOne', () => {
    it('should get one product by id', () => {
      const fakeProduct = generateFakeProduct();
      const productId = '1';

      spectator.service.getOne(productId).subscribe(product => {
        expect(product).toEqual(fakeProduct);
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products/${productId}`, HttpMethod.GET);
      req.flush(fakeProduct);
    });

    it('should handle error when product not found', () => {
      const productId = '999999';
      const errorMessage = 'Product not found';

      spectator.service.getOne(productId).subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products/${productId}`, HttpMethod.GET);
      req.flush(null, { status: 404, statusText: errorMessage });
    });
  });

  describe('getOneBySlug', () => {
    it('should get one product by slug', () => {
      const fakeProduct = generateFakeProduct();
      const productSlug = 'test-product';

      spectator.service.getOneBySlug(productSlug).subscribe(product => {
        expect(product).toEqual(fakeProduct);
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products/slug/${productSlug}`, HttpMethod.GET);
      req.flush(fakeProduct);
    });

    it('should handle error when product slug not found', () => {
      const productSlug = 'non-existent-product';
      const errorMessage = 'Product not found';

      spectator.service.getOneBySlug(productSlug).subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products/slug/${productSlug}`, HttpMethod.GET);
      req.flush(null, { status: 404, statusText: errorMessage });
    });
  });

  describe('getRelatedProducts', () => {
    it('should get related products', () => {
      const fakeProducts = [generateFakeProduct(), generateFakeProduct()];
      const productSlug = 'test-product';

      spectator.service.getRelatedProducts(productSlug).subscribe(products => {
        expect(products).toEqual(fakeProducts);
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products/slug/${productSlug}/related`, HttpMethod.GET);
      req.flush(fakeProducts);
    });

    it('should handle empty related products', () => {
      const productSlug = 'test-product';

      spectator.service.getRelatedProducts(productSlug).subscribe(products => {
        expect(products).toEqual([]);
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products/slug/${productSlug}/related`, HttpMethod.GET);
      req.flush([]);
    });

    it('should handle error when fetching related products', () => {
      const productSlug = 'test-product';
      const errorMessage = 'Server error';

      spectator.service.getRelatedProducts(productSlug).subscribe({
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = spectator.expectOne(`${environment.apiUrl}/api/v1/products/slug/${productSlug}/related`, HttpMethod.GET);
      req.flush(null, { status: 500, statusText: errorMessage });
    });
  });
});
