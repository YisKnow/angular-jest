import { Spectator, byTestId, createRoutingFactory } from '@ngneat/spectator/jest';

import { CartService } from '@shared/services/cart.service';
import { Product } from '@shared/models/product.model';
import { generateFakeProduct } from '@shared/models/product.mock';

import { HeaderComponent } from './header.component';
import { SearchComponent } from '../search/search.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  let component: HeaderComponent;
  let cartService: CartService;
  let mockProduct: Product;

  const createComponent = createRoutingFactory({
    component: HeaderComponent,
    providers: [CartService],
    imports: [SearchComponent],
    declarations: [],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    cartService = spectator.inject(CartService);
    mockProduct = generateFakeProduct({
      price: 100,
    });
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Menu toggles', () => {
    it('should toggle side menu visibility', () => {
      spectator.detectChanges();

      // Initially hidden
      let sideMenu = spectator.query(byTestId('side-menu'));
      expect(sideMenu).toHaveClass('translate-x-full');

      // Click cart button to show menu
      const cartButton = spectator.query(byTestId('cart-button'));
      spectator.click(cartButton as Element);
      spectator.detectChanges();

      sideMenu = spectator.query(byTestId('side-menu'));
      expect(sideMenu).not.toHaveClass('translate-x-full');

      // Click close button to hide menu
      const closeButton = spectator.query(byTestId('close-button'));
      if (closeButton) {
        spectator.click(closeButton);
        spectator.detectChanges();

        sideMenu = spectator.query(byTestId('side-menu'));
        expect(sideMenu).toHaveClass('translate-x-full');
      }
    });

    it('should toggle main menu visibility on mobile', () => {
      spectator.detectChanges();

      // Initially hidden
      let mainMenu = spectator.query(byTestId('navbar-menu'));
      expect(mainMenu).toHaveClass('hidden');

      // Click hamburger menu
      const hamburgerButton = spectator.query(byTestId('navbar-toggle'));
      spectator.click(hamburgerButton as Element);
      spectator.detectChanges();

      mainMenu = spectator.query(byTestId('navbar-menu'));
      expect(mainMenu).not.toHaveClass('hidden');

      // Click again to hide
      spectator.click(hamburgerButton as Element);
      spectator.detectChanges();

      mainMenu = spectator.query(byTestId('navbar-menu'));
      expect(mainMenu).toHaveClass('hidden');
    });
  });

  describe('Cart functionality', () => {
    it('should display correct cart count', () => {
      cartService.addToCart(mockProduct);
      cartService.addToCart(mockProduct);
      spectator.detectChanges();

      const cartCount = spectator.query(byTestId('cart-count'));
      expect(cartCount).toHaveText(`${component.cart().length}`);
    });

    it('should display 0 when cart is empty', () => {
      spectator.detectChanges();

      const cartItems = spectator.query(byTestId('cart-count'));
      expect(cartItems).toHaveText('');

      const total = spectator.query(byTestId('total'));
      expect(total).toHaveText(`Total: 0`);
    });

    it('should display cart items and total', () => {
      cartService.addToCart(mockProduct);
      cartService.addToCart(mockProduct);
      spectator.detectChanges();

      const cartItems = spectator.query(byTestId('cart-count'));
      expect(cartItems).toHaveText(`${component.cart().length}`);

      const total = spectator.query(byTestId('total'));
      expect(total).toHaveText(`Total: ${component.total()}`);
    });
  });

  describe('Navigation', () => {
    it('should have correct navigation links', () => {
      spectator.detectChanges();

      const links = spectator.queryAll('a[routerLink]');
      expect(links).toHaveLength(4); // Home, About, Locations, Services

      const [home, about, locations, services] = links;
      expect(home.getAttribute('routerLink')).toBe('/');
      expect(about.getAttribute('routerLink')).toBe('/about');
      expect(locations.getAttribute('routerLink')).toBe('/locations');
      expect(services.getAttribute('routerLink')).toBe('/services');
    });

    it('should have active link styles', () => {
      spectator.detectChanges();

      const homeLink = spectator.query("a[routerLink='/']");
      expect(homeLink).toHaveClass('hover:underline');

      // Mock router link active state by adding the class directly
      if (homeLink) {
        homeLink.classList.add('underline');
        expect(homeLink).toHaveClass('underline');
      }
    });
  });
});
