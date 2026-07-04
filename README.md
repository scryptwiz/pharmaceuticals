# Ayurvedic Super App

This repository contains the source code for the Ayurvedic Super App, built with React Native (Expo v54), React Navigation, Zustand, TanStack Query, and local MMKV storage.

---

## 1. Core Resilient Architecture

- **Theme Design Tokens ([theme.ts](./src/shared/design-system/theme.ts))**: Consists of color themes for the app.
- **Local Storage ([storage.ts](./src/shared/lib/storage.ts))**: Using `react-native-mmkv` for high-performance storage and retrieval of data.
- **Resilient API Client with "Chaos Mode" ([api-client.ts](./src/shared/lib/api-client.ts))**: Custom HTTP wrapper supporting timeouts, exponential backoff retries, and a toggleable "Chaos Mode" that injects network latency, 500/502 server errors, or malformed JSON payloads to verify frontend durability.
- **TanStack Query ([query-client.ts](./src/shared/lib/query-client.ts))**: Leverages `@react-native-community/netinfo` to automatically trigger refetches on network recovery, backed by an offline cache persister.
- **Global Error Boundary ([ErrorBoundary.tsx](./src/shared/components/ErrorBoundary.tsx))**: Intercepts render crashes and displays a styled error screen with a "Try Again" recovery action.
- **Shared Presentation Components**:
  - **[Chip.tsx](./src/shared/components/Chip.tsx)**: Reusable chip handling active states and typography.
  - **[SearchInput.tsx](./src/shared/components/SearchInput.tsx)**: Reusable search bar.

---

## 2. In-Memory Mock Database

The application operates on a local, seed-based deterministic generator creating large datasets:

- **20,000 Products** (Ayurvedic supplements, herbs, wellness oils, and cosmetics).
- **5,000 Doctors** (specialists across different domains of traditional Ayurveda).
- **Sub-5ms Searches**: Products and doctors are indexed using `Map` lookups and pre-compiled search hashes, ensuring filtering across 20,000+ items executes instantly.

---

## 3. Shop Module (Cart & Catalog)

A complete, offline product flow:

- **Infinite Scroll Listing ([ShopScreen.tsx](./src/modules/shop/screens/ShopScreen.tsx))**: Paginated catalog of 20,000 products powered by `@shopify/flash-list`.
- **Zustand Store ([useShopStore.ts](./src/modules/shop/store/useShopStore.ts))**: Manages the cart and user wishlist. The entire store is persisted in MMKV, keeping the cart intact after application restarts.
- **Catalog Filters ([FilterSection.tsx](./src/modules/shop/components/FilterSection.tsx))**: Text searches, category filters, and sorting choices (Price Ascending, Descending, and Ratings).
- **Shopping Cart ([CartScreen.tsx](./src/modules/shop/screens/CartScreen.tsx))**: Lists cart items, manages adjusters (+/-), and calculates pricing totals and a simulation of checkout action.

---

## 4. Consultations Module (Doctor Directory)

A complete, virtualized medical appointment interface:

- **Doctor Directory ([ConsultationsScreen.tsx](./src/modules/consultations/screens/ConsultationsScreen.tsx))**: Renders the catalog of 5,000 doctors with text search and specialty selection.
- **Zustand Booking Store ([useConsultationStore.ts](./src/modules/consultations/store/useConsultationStore.ts))**: Stores patient consultation bookings locally and syncs with MMKV storage.
- **Doctor Profiles ([DoctorDetailScreen.tsx](./src/modules/consultations/screens/DoctorDetailScreen.tsx))**: Showcases experience, specialist bio, consultation fee, and a calendar picker for upcoming dates.
- **Slot conflict and Expiration engine ([bookingUtils.ts](./src/modules/consultations/utils/bookingUtils.ts))**:
  - Blocks users from booking slots in the past relative to current local time (`isSlotExpired`).
  - Prevents double-booking clashes (`checkSlotConflict`), flagging a doctor conflict or patient calendar overlap.
- **Real-time Slot Status Picker ([SlotSelector.tsx](./src/modules/consultations/components/SlotSelector.tsx))**: Interactive slot selector showing current status (Available, selected, Expired, booked by you, or conflicting with other bookings).

---

## 5. Developer Guide & Execution

### Pre-Requisites

- iOS Simulator (Xcode installed) or Android Emulator (Android Studio installed).
- Node.js & Bun package manager.

### Installation

```bash
bun install
```

### Compile & Launch Native Binaries

Because this project utilizes fast native modules (`react-native-mmkv`), you must perform a native build to run the dev client on your device/simulator:

```bash
bunx expo run:ios

bunx expo run:android
```

### Unit Tests

```bash
bun test
```
