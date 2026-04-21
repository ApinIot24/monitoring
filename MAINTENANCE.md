# Maintenance Guide

## Struktur Proyek yang Diperbaiki

Proyek ini telah direfaktor untuk meningkatkan maintainability dengan struktur yang lebih terorganisir.

### 📁 Struktur Folder Baru

```
src/
├── constants/          # Configuration values
│   ├── api.ts         # API endpoints & base URL
│   ├── production.ts  # Production targets (TOTAL_CARTON)
│   └── video.ts       # Video configuration
│
├── services/          # API service layer
│   └── api.ts         # Centralized API calls
│
├── hooks/             # Custom React hooks
│   ├── useVideoAutoplay.ts  # Video autoplay logic
│   ├── useLineData.ts       # Line data fetching
│   └── useCurrentTime.ts    # Current time hook
│
├── utils/             # Utility functions
│   ├── shift.ts       # Shift calculation utilities
│   └── time.ts        # Time-related utilities
│
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared interfaces & types
│
├── components/         # Reusable components
│   └── VideoPlayer/   # Video player components
│
└── config/            # Configuration files
    └── routes.ts      # Route configuration
```

## 🎯 Manfaat Struktur Baru

### 1. **Separation of Concerns**
- API calls terpisah dari components → `services/`
- Business logic di hooks → `hooks/`
- Configuration values terpusat → `constants/`

### 2. **Reusability**
- Custom hooks dapat digunakan di multiple pages
- Utility functions dapat di-share
- Components lebih modular

### 3. **Maintainability**
- Perubahan API URL hanya di satu tempat (`constants/api.ts`)
- Perubahan production targets hanya di satu tempat (`constants/production.ts`)
- Type safety dengan TypeScript types

### 4. **Testability**
- Services dapat di-test secara terpisah
- Hooks dapat di-test dengan React Testing Library
- Utils adalah pure functions, mudah di-test

## 📝 Cara Menggunakan Struktur Baru

### Menggunakan API Service

```typescript
import { fetchPackingData, fetchShiftData, fetchAllLineData } from '../services/api';

// Fetch single data
const packingData = await fetchPackingData('l1');

// Fetch all data for a line
const { packingData, shiftData, hourlyData, currentShift } = await fetchAllLineData('l1');
```

### Menggunakan Custom Hooks

```typescript
import { useVideoAutoplay } from '../hooks/useVideoAutoplay';
import { useLineData } from '../hooks/useLineData';
import { useCurrentTime } from '../hooks/useCurrentTime';

// Video autoplay
const { showVideo, isAutoplay, handleVideoEnded, ... } = useVideoAutoplay({
    videos: ['/videos/video.mp4'],
    autoplayEnabled: true,
    intervalHours: 2,
});

// Line data with polling
const { packingData, shiftData, hourlyData, isLoading, error } = useLineData({
    line: 'l1',
    pollingInterval: 10000, // 10 seconds
});

// Current time
const currentTime = useCurrentTime();
```

### Menggunakan Constants

```typescript
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { TOTAL_CARTON, getTargetCarton } from '../constants/production';
import { VIDEO_PATHS, AUTOPLAY_TIME_WINDOWS } from '../constants/video';

// Get API URL
const url = API_ENDPOINTS.packing('l1');

// Get target carton
const target = getTargetCarton('l1');
```

### Menggunakan Utils

```typescript
import { getCurrentShiftNumber, isWithinShiftWindow } from '../utils/shift';
import { isWithinAutoplayWindow, formatTime } from '../utils/time';

const shift = getCurrentShiftNumber();
const canAutoplay = isWithinAutoplayWindow();
const timeString = formatTime(new Date());
```

## 🔄 Migration Guide

### Refactoring Existing Pages

**Before:**
```typescript
const [showVideo, setShowVideo] = useState(false);
const [isAutoplay, setIsAutoplay] = useState(false);

useEffect(() => {
    // Complex autoplay logic...
}, []);
```

**After:**
```typescript
const { showVideo, isAutoplay, handleVideoEnded, ... } = useVideoAutoplay({
    videos: ['/videos/video.mp4'],
    autoplayEnabled: true,
});
```

### Refactoring API Calls

**Before:**
```typescript
const APIURLs = {
    packing: `http://10.37.12.11:3000/packing_${line}`,
};

const fetchPackingData = async () => {
    const response = await axios.get(APIURLs.packing);
    setPackingData(response.data[0]);
};
```

**After:**
```typescript
import { fetchPackingData } from '../services/api';

// Or use hook
const { packingData } = useLineData({ line: 'l1' });
```

## 🚀 Best Practices

1. **Jangan hardcode values** - Gunakan constants
2. **Jangan duplikasi logic** - Extract ke hooks/utils
3. **Gunakan TypeScript types** - Import dari `types/`
4. **Centralize API calls** - Gunakan `services/api.ts`
5. **Reuse components** - Gunakan components dari `components/`

## 📚 File Reference

- **API Configuration**: `src/constants/api.ts`
- **Production Constants**: `src/constants/production.ts`
- **Video Config**: `src/constants/video.ts`
- **API Services**: `src/services/api.ts`
- **Custom Hooks**: `src/hooks/`
- **Types**: `src/types/index.ts`
- **Routes**: `src/config/routes.ts`

## 🔧 Maintenance Tasks

### Mengubah API Base URL
Edit `src/constants/api.ts`:
```typescript
export const API_BASE_URL = 'http://new-url:3000';
```

### Menambah Production Line
Edit `src/constants/production.ts`:
```typescript
export const TOTAL_CARTON = {
    l1: 1016,
    l2: 1016,
    l8: 5000, // New line
};
```

### Menambah Route
Edit `src/config/routes.ts`:
```typescript
export const routeConfigs: RouteConfig[] = [
    // ... existing routes
    {
        path: '/new-page',
        element: <Pages.NewPage />,
        layout: 'default',
        label: 'New Page',
    },
];
```

## ⚠️ Notes

- File `Index.refactored.example.tsx` adalah contoh implementasi menggunakan struktur baru
- Struktur lama masih berfungsi untuk backward compatibility
- Migrasi dapat dilakukan secara bertahap per page

