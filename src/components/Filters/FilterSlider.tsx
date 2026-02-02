import React from 'react'

interface FilterSliderProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  unit?: string
}

export const FilterSlider: React.FC<FilterSliderProps> = ({ label, value, min, max, onChange, unit = '' }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] uppercase tracking-tighter text-white/50">
        <span>{label}</span>
        <span className="text-cyan-400">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
  )
}
