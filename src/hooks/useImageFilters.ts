import { useState, useCallback } from 'react'
import { FilterSettings, RGBShift, Preset } from '../types'

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0
}

const DEFAULT_RGB_SHIFT: RGBShift = { r: 0, g: 0, b: 0 }

const DEFAULT_EFFECTS = {
  grain: 0,
  vignette: 0,
  rgbSplit: 0,
  pixelate: 0
}

export const useImageFilters = () => {
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS)
  const [rgbShift, setRgbShift] = useState<RGBShift>(DEFAULT_RGB_SHIFT)
  const [effects, setEffects] = useState(DEFAULT_EFFECTS)
  const [selectedPreset, setSelectedPreset] = useState<string>('Normal')

  const updateFilter = useCallback((key: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateEffect = useCallback((key: keyof typeof DEFAULT_EFFECTS, value: number) => {
    setEffects(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateRGBShift = useCallback((key: keyof RGBShift, value: number) => {
    setRgbShift(prev => ({ ...prev, [key]: value }))
  }, [])

  const applyPreset = useCallback((preset: Preset) => {
    setSelectedPreset(preset.name)
    setFilters(prev => ({ ...prev, ...preset.settings }))
    if (preset.rgbShift) setRgbShift(preset.rgbShift)
    if (preset.effects) setEffects(preset.effects)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setRgbShift(DEFAULT_RGB_SHIFT)
    setEffects(DEFAULT_EFFECTS)
    setSelectedPreset('Normal')
  }, [])

  return {
    filters,
    rgbShift,
    effects,
    selectedPreset,
    updateFilter,
    updateEffect,
    updateRGBShift,
    applyPreset,
    resetFilters
  }
}
