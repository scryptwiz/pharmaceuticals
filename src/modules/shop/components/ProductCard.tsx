import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../shared/design-system/theme";
import { Product } from "../api/useProducts";
import { useShopStore } from "../store/useShopStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, wishlist, addToCart, toggleWishlist } = useShopStore();
  const isWishlisted = wishlist.includes(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Ionicons name="leaf-outline" size={40} color={Colors.primary} />
        <Pressable style={styles.wishlistButton} onPress={handleToggleWishlist}>
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={22}
            color={isWishlisted ? Colors.accent : Colors.inactive}
          />
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={Colors.star} />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        </View>

        <View style={styles.stockRow}>
          {isOutOfStock ? (
            <Text style={[styles.stockStatus, styles.outOfStock]}>
              Out of Stock
            </Text>
          ) : product.stock < 15 ? (
            <Text style={[styles.stockStatus, styles.lowStock]}>
              Only {product.stock} left
            </Text>
          ) : (
            <Text style={[styles.stockStatus, styles.inStock]}>In Stock</Text>
          )}
        </View>

        <Pressable
          style={[styles.addButton, isOutOfStock && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
        >
          <Text style={styles.addButtonText}>
            {quantity > 0 ? `Added (${quantity})` : "Add to Cart"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 8,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.background,
    padding: 6,
    borderRadius: 20,
  },
  info: {
    padding: 12,
  },
  category: {
    fontSize: 11,
    color: Colors.inactive,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text,
    marginVertical: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: "600",
    marginLeft: 3,
  },
  stockRow: {
    marginVertical: 6,
  },
  stockStatus: {
    fontSize: 11,
    fontWeight: "600",
  },
  inStock: {
    color: Colors.success,
  },
  lowStock: {
    color: Colors.warning,
  },
  outOfStock: {
    color: Colors.error,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 4,
  },
  disabledButton: {
    backgroundColor: Colors.disabled,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
});
