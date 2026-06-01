import React from 'react'
import { FilterSettings } from '../../types'
import { PRESETS } from '../../constants/presets'
import './FilterPanel.css'

interface FilterPanelProps {
  filters: FilterSettings
  selectedPreset: string
  onFilterChange: (key: keyof FilterSettings, value: number) => void
  onPresetSelect: (presetName: string) => void
  onReset: () => void
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  selectedPreset,
  onFilterChange,
  onPresetSelect,
  onReset
}) => {
  const filterKeys: (keyof FilterSettings)[] = [
    'brightness', 'contrast', 'saturation', 'hue',
    'blur', 'grayscale', 'sepia', 'invert'
  ]

  return (
    <div className="filter-panel">
      {/* Presets */}
      <div className="panel-section">
        <h3 className="panel-title">Presets</h3>
        <div className="presets-grid">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              className={`preset-btn ${selectedPreset === preset.name ? 'active' : ''}`}
              onClick={() => onPresetSelect(preset.name)}
              title={preset.name}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="panel-section">
        <h3 className="panel-title">Filters</h3>
        <div className="filters-list">
          {filterKeys.map(key => (
            <div key={key} className="filter-control">
              <label className="filter-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="range"
                min={key === 'brightness' || key === 'contrast' || key === 'saturation' ? 0 : -100}
                max={key === 'brightness' || key === 'contrast' || key === 'saturation' ? 200 : 100}
                value={filters[key]}
                onChange={(e) => onFilterChange(key, parseInt(e.target.value))}
                className="filter-slider"
              />
              <span className="filter-value">{filters[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button className="reset-btn" onClick={onReset}>
        🔄 Reset All
      </button>
    </div>
  )
}
