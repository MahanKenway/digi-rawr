import { useState, useCallback } from 'react'
import { FilterSettings, RGBShift, Effects } from '../types'
import { PRESETS } from '../constants/presets'

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

const DEFAULT_EFFECTS: Effects = {
  grain: 0,
  vignette: 0,
  rgbSplit: 0,
  pixelate: 0
}

export const useImageFilters = () => {
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS)
  const [rgbShift, setRgbShift] = useState<RGBShift>(DEFAULT_RGB_SHIFT)
  const [effects, setEffects] = useState<Effects>(DEFAULT_EFFECTS)
  const [selectedPreset, setSelectedPreset] = useState<string>('Normal')

  const updateFilter = useCallback((key: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateRGBShift = useCallback((key: keyof RGBShift, value: number) => {
    setRgbShift(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateEffect = useCallback((key: keyof Effects, value: number) => {
    setEffects(prev => ({ ...prev, [key]: value }))
  }, [])

  const applyPreset = useCallback((presetName: string) => {
    const preset = PRESETS.find(p => p.name === presetName)
    if (!preset) return

    setSelectedPreset(presetName)
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
    updateRGBShift,
    updateEffect,
    applyPreset,
    resetFilters
  }
}
