import { Preset } from '../types'

export const PRESETS: Preset[] = [
  {
    name: 'Normal',
    settings: { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
    rgbShift: { r: 0, g: 0, b: 0 },
    effects: { grain: 0, vignette: 0, rgbSplit: 0, pixelate: 0 },
    style: 'normal'
  },
  {
    name: 'Digicam',
    settings: { brightness: 105, contrast: 110, saturation: 85, hue: 0, blur: 0, grayscale: 0, sepia: 10, invert: 0 },
    rgbShift: { r: 5, g: 0, b: -5 },
    effects: { grain: 30, vignette: 40, rgbSplit: 10, pixelate: 0 },
    style: 'y2k'
  },
  {
    name: 'Y2K Aesthetic',
    settings: { brightness: 115, contrast: 120, saturation: 130, hue: 10, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
    rgbShift: { r: 10, g: -5, b: 10 },
    effects: { grain: 15, vignette: 0, rgbSplit: 25, pixelate: 0 },
    style: 'y2k'
  },
  {
    name: 'Goth Dark',
    settings: { brightness: 70, contrast: 140, saturation: 40, hue: 0, blur: 0, grayscale: 30, sepia: 0, invert: 0 },
    rgbShift: { r: -10, g: -10, b: 5 },
    effects: { grain: 50, vignette: 80, rgbSplit: 0, pixelate: 0 },
    style: 'goth'
  },
  {
    name: 'Goth Noir',
    settings: { brightness: 60, contrast: 150, saturation: 0, hue: 0, blur: 1, grayscale: 100, sepia: 0, invert: 0 },
    rgbShift: { r: 0, g: 0, b: 0 },
    effects: { grain: 60, vignette: 90, rgbSplit: 0, pixelate: 0 },
    style: 'goth'
  },
  {
    name: 'Emo Purple',
    settings: { brightness: 90, contrast: 110, saturation: 120, hue: 45, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
    rgbShift: { r: 20, g: -10, b: 30 },
    effects: { grain: 35, vignette: 50, rgbSplit: 15, pixelate: 0 },
    style: 'emo'
  },
  {
    name: 'Emo Red',
    settings: { brightness: 85, contrast: 130, saturation: 90, hue: 180, blur: 0, grayscale: 10, sepia: 30, invert: 0 },
    rgbShift: { r: 30, g: -20, b: -20 },
    effects: { grain: 40, vignette: 60, rgbSplit: 20, pixelate: 0 },
    style: 'emo'
  },
  {
    name: 'Glitch Core',
    settings: { brightness: 100, contrast: 125, saturation: 150, hue: 5, blur: 0, grayscale: 0, sepia: 0, invert: 5 },
    rgbShift: { r: 15, g: 0, b: -15 },
    effects: { grain: 20, vignette: 0, rgbSplit: 50, pixelate: 2 },
    style: 'y2k'
  },
  {
    name: 'Pixel Dreams',
    settings: { brightness: 110, contrast: 105, saturation: 110, hue: 0, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
    rgbShift: { r: 0, g: 0, b: 0 },
    effects: { grain: 10, vignette: 20, rgbSplit: 0, pixelate: 8 },
    style: 'y2k'
  }
]
