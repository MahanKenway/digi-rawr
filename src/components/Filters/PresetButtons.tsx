import React from 'react'
import { PRESETS } from '../../utils/presets'
import { Preset } from '../../types'

interface PresetButtonsProps {
  selectedPreset: string
  onApplyPreset: (preset: Preset) => void
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({ selectedPreset, onApplyPreset }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-cyan-400">Y2K & Retro</h3>
        <div className="grid grid-cols-1 gap-2">
          {PRESETS.filter(p => p.style === 'y2k' || p.style === 'normal').map(preset => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset(preset)}
              className={`preset-button text-left px-3 py-2 rounded border transition-all ${
                selectedPreset === preset.name 
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{preset.name}</span>
                {selectedPreset === preset.name && <span className="text-[10px]">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-purple-400">Goth</h3>
        <div className="grid grid-cols-1 gap-2">
          {PRESETS.filter(p => p.style === 'goth').map(preset => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset(preset)}
              className={`preset-button text-left px-3 py-2 rounded border transition-all ${
                selectedPreset === preset.name 
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(192,132,252,0.2)]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{preset.name}</span>
                {selectedPreset === preset.name && <span className="text-[10px]">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-pink-400">Emo</h3>
        <div className="grid grid-cols-1 gap-2">
          {PRESETS.filter(p => p.style === 'emo').map(preset => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset(preset)}
              className={`preset-button text-left px-3 py-2 rounded border transition-all ${
                selectedPreset === preset.name 
                ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_10px_rgba(244,114,182,0.2)]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{preset.name}</span>
                {selectedPreset === preset.name && <span className="text-[10px]">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
