'use client';

interface FilterChip {
  value: string;
  label: string;
  icon?: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  multiSelect?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function FilterChips({
  chips,
  selectedValues,
  onChange,
  multiSelect = false,
  variant = 'primary',
}: FilterChipsProps) {
  const handleClick = (value: string) => {
    if (multiSelect) {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((v) => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    } else {
      if (selectedValues.includes(value)) {
        onChange([]);
      } else {
        onChange([value]);
      }
    }
  };

  const getChipClass = (isSelected: boolean) => {
    const baseClass = 'chip cursor-pointer select-none';
    
    if (variant === 'primary') {
      return `${baseClass} ${
        isSelected
          ? 'bg-[#FF6B35] text-white shadow-md'
          : 'bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35]/20'
      }`;
    }
    
    if (variant === 'secondary') {
      return `${baseClass} ${
        isSelected
          ? 'bg-[#4ECDC4] text-white shadow-md'
          : 'bg-[#4ECDC4]/10 text-[#4ECDC4] hover:bg-[#4ECDC4]/20'
      }`;
    }
    
    return `${baseClass} ${
      isSelected
        ? 'bg-gray-800 text-white shadow-md'
        : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
    }`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.value}
          onClick={() => handleClick(chip.value)}
          className={getChipClass(selectedValues.includes(chip.value))}
        >
          {chip.icon && <span>{chip.icon}</span>}
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  );
}
