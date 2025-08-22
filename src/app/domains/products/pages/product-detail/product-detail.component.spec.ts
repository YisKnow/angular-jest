import { DeferBlockBehavior } from "@angular/core/testing";
import {
  Spectator,
  createRoutingFactory,
  SpyObject,
  byTestId,
  mockProvider,
} from "@ngneat/spectator/jest";
import { of } from "rxjs";
import { faker } from "@faker-js/faker";

import { ProductService } from "@shared/services/product.service";
import { CartService } from "@shared/services/cart.service";
import { MetaTagsService } from "@shared/services/meta-tags.service";
import { generateFakeProduct } from "@shared/models/product.mock";

import { RelatedComponent } from "@products/components/related/related.component";

import ProductDetailComponent from "./product-detail.component";

window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
}));

describe("ProductDetailComponent", () => {
  let spectator: Spectator<ProductDetailComponent>;
  let productService: SpyObject<ProductService>;
  let cartService: SpyObject<CartService>;

  const mockProduct = generateFakeProduct({
    images: [
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
    ],
  });

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    deferBlockBehavior: DeferBlockBehavior.Manual,
    imports: [RelatedComponent],
    providers: [
      mockProvider(ProductService, {
        getOneBySlug: jest.fn().mockReturnValue(of(mockProduct)),
        getRelatedProducts: jest.fn().mockReturnValue(of([mockProduct])),
      }),
      mockProvider(CartService),
      mockProvider(MetaTagsService),
      /* mockProvider(CartService, {
        addToCart: jest.fn(),
      }),
      mockProvider(MetaTagsService, {
        updateMetaTags: jest.fn(),
      }), */
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput("slug", mockProduct.slug);
    productService = spectator.inject(ProductService);
    cartService = spectator.inject(CartService);
  });

  it("should be created", () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it("should getOneBySlug be called", () => {
    spectator.detectChanges();
    expect(productService.getOneBySlug).toHaveBeenCalledWith(mockProduct.slug);
  });

  it("should display the product cover", () => {
    // Act
    spectator.detectChanges();

    // Assert
    const cover = spectator.query<HTMLImageElement>(byTestId("cover"));
    expect(cover).toBeTruthy();
    expect(cover?.src).toBe(mockProduct.images[0]);
  });

  it("should load related products", async () => {
    spectator.detectChanges();
    await spectator.deferBlock().renderComplete();

    const related = spectator.query(RelatedComponent);
    expect(related).toBeTruthy();
    expect(productService.getRelatedProducts).toHaveBeenCalledWith(
      mockProduct.slug,
    );
  });

  it("should change the cover when the image is clicked", () => {
    spectator.detectChanges();
    const gallery = spectator.query(byTestId("gallery"));
    const images = gallery?.querySelectorAll("img");

    expect(gallery).toBeTruthy();
    expect(images?.length).toBe(mockProduct.images.length);

    if (images && images.length > 0) {
      spectator.click(images[1] as Element);
      const cover = spectator.query<HTMLImageElement>(byTestId("cover"));
      expect(cover).toBeTruthy();
      expect(cover?.src).toBe(mockProduct.images[1]);
    }
  });

  it("should add the product to the cart when button is clicked", () => {
    spectator.detectChanges();

    spectator.click(byTestId("add-to-cart"));
    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct);
  });
});
