export interface FilterSettings {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  grayscale: number
  sepia: number
  invert: number
}

export interface RGBShift {
  r: number
  g: number
  b: number
}

export interface StickerData {
  id: string
  emoji: string
  x: number
  y: number
  scale: number
  rotation: number
}

export interface Preset {
  name: string
  settings: Partial<FilterSettings>
  rgbShift?: RGBShift
  effects: {
    grain: number
    vignette: number
    rgbSplit: number
    pixelate: number
  }
  style: 'normal' | 'goth' | 'emo' | 'y2k'
}
