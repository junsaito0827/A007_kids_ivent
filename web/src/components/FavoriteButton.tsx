'use client';

import { useState, useEffect } from 'react';
import { isFavorite, toggleFavorite } from '@/lib/favorites';

interface FavoriteButtonProps {
  eventId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function FavoriteButton({ eventId, size = 'md', showLabel = false }: FavoriteButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsActive(isFavorite(eventId));
  }, [eventId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = toggleFavorite(eventId);
    setIsActive(result.isFavorite);
    setIsAnimating(true);

    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${showLabel ? 'px-4 min-w-fit' : ''}
        inline-flex items-center justify-center gap-2
        rounded-full
        transition-all duration-200
        ${isActive
          ? 'bg-[#FF6B9D]/10 hover:bg-[#FF6B9D]/20'
          : 'bg-white/90 hover:bg-white shadow-md'
        }
        ${isAnimating ? 'scale-125' : 'hover:scale-105'}
      `}
      aria-label={isActive ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <span
        className={`
          transition-transform duration-200
          ${isAnimating ? 'animate-pulse-slow' : ''}
        `}
      >
        {isActive ? '❤️' : '🤍'}
      </span>
      {showLabel && (
        <span className={`font-semibold text-sm ${isActive ? 'text-[#FF6B9D]' : 'text-gray-600'}`}>
          {isActive ? 'お気に入り' : 'お気に入り'}
        </span>
      )}
    </button>
  );
}
