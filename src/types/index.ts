// Filter and Effects Types
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

export interface Effects {
  grain: number
  vignette: number
  rgbSplit: number
  pixelate: number
  bloom: number
  glow: number
}

export interface Preset {
  name: string
  settings: Partial<FilterSettings>
  rgbShift?: RGBShift
  effects: Effects
  style: 'normal' | 'goth' | 'emo' | 'y2k'
}

// Sticker Types
export interface StickerData {
  id: string
  emoji: string
  x: number
  y: number
  scale: number
  rotation: number
}

// Text Layer Types
export interface TextLayer {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  rotation: number
}

// Frame Types
export interface Frame {
  id: string
  name: string
  type: 'border' | 'polaroid' | 'film' | 'vintage'
  color?: string
  width: number
}

// Window Types
export interface WindowState {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isMinimized: boolean
  isMaximized: boolean
}

// Editor State Types
export interface EditorState {
  originalImage: string | null
  filters: FilterSettings
  rgbShift: RGBShift
  effects: Effects
  dateStamp: {
    enabled: boolean
    text: string
    color: string
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  }
  selectedPreset: string
  stickers: StickerData[]
  textLayers: TextLayer[]
  selectedFrame: Frame | null
  selectedSticker: string | null
  selectedTextLayer: string | null
}
