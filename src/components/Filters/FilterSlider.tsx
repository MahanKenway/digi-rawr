import React from 'react'

interface FilterSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

export const FilterSlider: React.FC<FilterSliderProps> = ({ label, value, min, max, step, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-white/70 text-[10px] uppercase tracking-widest font-bold mb-1">
        {label}: {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer range-sm"
      />
    </div>
  )
}
