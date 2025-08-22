import {
  Spectator,
  byTestId,
  createRoutingFactory,
} from "@ngneat/spectator/jest";

import { generateFakeProduct } from "@shared/models/product.mock";

import { ProductComponent } from "./product.component";

describe("ProductComponent", () => {
  let spectator: Spectator<ProductComponent>;

  const createComponent = createRoutingFactory({
    component: ProductComponent,
  });

  const mockProduct = generateFakeProduct();

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput("product", mockProduct);
  });

  it("should be created", () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it("should display product title", () => {
    spectator.detectChanges();
    const titleElement = spectator.query(byTestId("product-title"));
    expect(titleElement).toHaveText(mockProduct.title);
  });

  it("should emit a product when method is called", () => {
    // Arrange = Alistar entorno
    const emitSpy = jest.spyOn(spectator.component.addToCart, "emit");

    // Act
    spectator.detectChanges();
    spectator.component.addToCartHandler();

    // Assert = Ver si todo esta correcto
    expect(emitSpy).toHaveBeenCalledWith(mockProduct);
  });

  it("should emit a product when button is clicked", () => {
    // Arrange = Alistar entorno
    const emitSpy = jest.spyOn(spectator.component.addToCart, "emit");

    // Act
    spectator.detectChanges();
    spectator.click(byTestId("add-to-cart-button"));

    // Assert = Ver si todo esta correcto
    expect(emitSpy).toHaveBeenCalledWith(mockProduct);
  });
});
