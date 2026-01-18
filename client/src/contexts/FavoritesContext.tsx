import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Favorite {
  id: string;
  type: "conference" | "journal";
  name: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (id: string, type: "conference" | "journal", name: string) => void;
  removeFavorite: (id: string, type: "conference" | "journal") => void;
  isFavorite: (id: string, type: "conference" | "journal") => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // 从localStorage加载收藏
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load favorites:", e);
      }
    }
  }, []);

  // 保存到localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (id: string, type: "conference" | "journal", name: string) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === id && f.type === type)) {
        return prev;
      }
      return [...prev, { id, type, name }];
    });
  };

  const removeFavorite = (id: string, type: "conference" | "journal") => {
    setFavorites(prev => prev.filter(f => !(f.id === id && f.type === type)));
  };

  const isFavorite = (id: string, type: "conference" | "journal") => {
    return favorites.some(f => f.id === id && f.type === type);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
