'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  size?: 'md' | 'lg';
  showButton?: boolean;
}

export function SearchBar({
  defaultValue = '',
  placeholder = 'イベント・スポットを検索...',
  size = 'md',
  showButton = true,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/events?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/events');
    }
  };

  const sizeClasses = {
    md: 'py-3 text-base',
    lg: 'py-4 text-lg',
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        {/* 検索アイコン */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 入力フィールド */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full
            ${sizeClasses[size]}
            pl-12 pr-4
            ${showButton ? 'pr-28' : 'pr-4'}
            bg-white
            border-2 border-gray-200
            rounded-full
            font-medium
            text-gray-800
            placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10
            hover:border-gray-300
          `}
        />

        {/* 検索ボタン */}
        {showButton && (
          <button
            type="submit"
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              px-5 py-2
              bg-gradient-to-r from-[#FF6B35] to-[#FF8F65]
              text-white font-bold
              rounded-full
              transition-all duration-200
              hover:shadow-lg hover:scale-105
              active:scale-95
            "
          >
            検索
          </button>
        )}
      </div>
    </form>
  );
}
