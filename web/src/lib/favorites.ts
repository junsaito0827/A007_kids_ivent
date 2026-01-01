// お気に入り管理（LocalStorage）

const FAVORITES_KEY = 'fav_event_ids';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(eventId: string): string[] {
  const favorites = getFavorites();
  if (!favorites.includes(eventId)) {
    favorites.push(eventId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
}

export function removeFavorite(eventId: string): string[] {
  const favorites = getFavorites().filter(id => id !== eventId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
}

export function toggleFavorite(eventId: string): { favorites: string[]; isFavorite: boolean } {
  const favorites = getFavorites();
  const isFavorite = favorites.includes(eventId);
  
  if (isFavorite) {
    return { favorites: removeFavorite(eventId), isFavorite: false };
  } else {
    return { favorites: addFavorite(eventId), isFavorite: true };
  }
}

export function isFavorite(eventId: string): boolean {
  return getFavorites().includes(eventId);
}
