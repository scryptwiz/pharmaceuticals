# Ayurvedic Super App

A React Native/Expo app built using TypeScript, Zustand, TanStack Query, and MMKV storage. It is structured into feature modules: Shop, Consultations, and Health Records, with a shared UI and library layer.

## Project Structure

```
src/
├── mocks/                     # Local seed data and generators
├── modules/                   # Feature modules
│   ├── shop/                  # Shop catalog and cart
│   ├── consultations/         # Doctor listing and booking
│   └── health-records/        # Health records timeline
└── shared/                    # Shared components, theme, and utility libraries
```

## Setup & Running

### Requirements

- Node.js & Bun
- iOS Simulator (Xcode) or Android Emulator (Android Studio)

### Installation

```bash
bun install
```

### Run App

Since the app uses native libraries like `react-native-mmkv`, you need to run a native build:

```bash
# iOS
bunx expo run:ios

# Android
bunx expo run:android
```

### Running Tests

```bash
bun test
```

---

## Key Implementation Details & Trade-offs

- **State & Storage**: Used `Zustand` combined with `MMKV` for fast, synchronous persistence of cart and booking states.
- **Offline Handling**:
  - Active bookings made offline are queued into a sync backlog store.
  - A custom sync manager listens to network reconnect events to drain the queue.
  - TanStack Query cache is persisted locally to allow immediate startup offline.
- **Mock Data**: Generates 20,000 products and 5,000 doctors locally. Used `Map` indexing to ensure lookups and text filters remain fast (under 5ms).
- **Render Performance**: Lists utilize `@shopify/flash-list` to keep memory footprint low and scrolling smooth with large datasets.
- **Client-side booking checks**: Slot conflict and expiration checks are performed on the device. In a production environment, slot validation would be handled via a server-side lock/database constraint.
- **Analytics**: Integrated a simple wrapper for tracking custom actions (e.g., cart additions, bookings).
