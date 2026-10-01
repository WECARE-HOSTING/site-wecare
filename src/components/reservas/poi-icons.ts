import type { Poi } from "@/lib/reservas/nearby";

// Kept apart from NearbyMap so server-rendered code can use it without loading Leaflet (which needs `window`).
export const CATEGORY_ICON: Record<Poi["category"], string> = { transit: "🚇", food: "🍽️", shopping: "🛍️", nature: "🌳", culture: "🎭", sports: "⚽", health: "🏥", other: "📍" };
