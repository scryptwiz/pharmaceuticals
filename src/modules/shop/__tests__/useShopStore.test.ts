import { Product } from "../api/useProducts";
import { useShopStore } from "../store/useShopStore";

const MOCK_PRODUCT: Product = {
  id: "prod-1",
  name: "Organic Ashwagandha",
  category: "Herbal Supplements",
  price: 299,
  stock: 10,
  rating: 4.5,
  description: "Traditional Ayurvedic herb for stress relief and vitality.",
};

describe("Shop Zustand Store", () => {
  beforeEach(() => {
    useShopStore.getState().clearCart();
    const wishlist = useShopStore.getState().wishlist;
    wishlist.forEach((id) => useShopStore.getState().toggleWishlist(id));
  });

  test("should add product to cart and calculate correct quantity", () => {
    const { addToCart } = useShopStore.getState();

    addToCart(MOCK_PRODUCT);
    expect(useShopStore.getState().cart).toHaveLength(1);
    expect(useShopStore.getState().cart[0].product.id).toBe("prod-1");
    expect(useShopStore.getState().cart[0].quantity).toBe(1);

    addToCart(MOCK_PRODUCT);
    expect(useShopStore.getState().cart).toHaveLength(1);
    expect(useShopStore.getState().cart[0].quantity).toBe(2);
  });

  test("should remove product from cart", () => {
    const { addToCart, removeFromCart } = useShopStore.getState();

    addToCart(MOCK_PRODUCT);
    expect(useShopStore.getState().cart).toHaveLength(1);

    removeFromCart("prod-1");
    expect(useShopStore.getState().cart).toHaveLength(0);
  });

  test("should update quantity", () => {
    const { addToCart, updateQuantity } = useShopStore.getState();

    addToCart(MOCK_PRODUCT);
    updateQuantity("prod-1", 5);
    expect(useShopStore.getState().cart[0].quantity).toBe(5);

    updateQuantity("prod-1", 0);
    expect(useShopStore.getState().cart).toHaveLength(0);
  });

  test("should toggle wishlist items correctly", () => {
    const { toggleWishlist } = useShopStore.getState();

    toggleWishlist("prod-1");
    expect(useShopStore.getState().wishlist).toContain("prod-1");

    toggleWishlist("prod-1");
    expect(useShopStore.getState().wishlist).not.toContain("prod-1");
  });
});
