import React from 'react'
import { Preset } from '../../types'
import { PRESETS } from '../../utils/presets'

interface PresetButtonsProps {
  selectedPreset: string
  onApplyPreset: (presetName: string) => void
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({ selectedPreset, onApplyPreset }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PRESETS.map((preset) => (
        <button
          key={preset.name}
          onClick={() => onApplyPreset(preset.name)}
          className={`px-3 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all active:scale-95
            ${selectedPreset === preset.name
              ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
              : 'bg-white/5 border border-white/10 text-white/30 hover:text-white/60'}
          `}
        >
          {preset.name}
          {selectedPreset === preset.name && <span className="ml-2">✓</span>}
        </button>
      ))}
    </div>
  )
}
