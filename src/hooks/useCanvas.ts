import { useEffect, useRef } from 'react'
import { FilterSettings, RGBShift, Effects, StickerData } from '../types'

export const useCanvas = (
  originalImage: string | null,
  filters: FilterSettings,
  rgbShift: RGBShift,
  effects: Effects,
  stickers: StickerData[]
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!originalImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Pixelate effect
      if (effects.pixelate > 0) {
        const pixelSize = Math.max(2, effects.pixelate * 2)
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCanvas.width = img.width / pixelSize
          tempCanvas.height = img.height / pixelSize
          tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height)
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height)
          ctx.imageSmoothingEnabled = true
        }
      } else {
        ctx.drawImage(img, 0, 0)
      }

      // Get image data for pixel-level effects
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Apply filters
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // Brightness
        r *= filters.brightness / 100
        g *= filters.brightness / 100
        b *= filters.brightness / 100

        // Contrast
        const contrastFactor = (filters.contrast / 100) * (filters.contrast / 100)
        r = ((r - 128) * contrastFactor) + 128
        g = ((g - 128) * contrastFactor) + 128
        b = ((b - 128) * contrastFactor) + 128

        // Saturation
        const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
        r = gray + (r - gray) * (filters.saturation / 100)
        g = gray + (g - gray) * (filters.saturation / 100)
        b = gray + (b - gray) * (filters.saturation / 100)

        // Grayscale
        if (filters.grayscale > 0) {
          const grayVal = 0.2989 * r + 0.5870 * g + 0.1140 * b
          r = r * (1 - filters.grayscale / 100) + grayVal * (filters.grayscale / 100)
          g = g * (1 - filters.grayscale / 100) + grayVal * (filters.grayscale / 100)
          b = b * (1 - filters.grayscale / 100) + grayVal * (filters.grayscale / 100)
        }

        // Sepia
        if (filters.sepia > 0) {
          const sr = (r * 0.393) + (g * 0.769) + (b * 0.189)
          const sg = (r * 0.349) + (g * 0.686) + (b * 0.168)
          const sb = (r * 0.272) + (g * 0.534) + (b * 0.131)
          r = r * (1 - filters.sepia / 100) + sr * (filters.sepia / 100)
          g = g * (1 - filters.sepia / 100) + sg * (filters.sepia / 100)
          b = b * (1 - filters.sepia / 100) + sb * (filters.sepia / 100)
        }

        // RGB Shift
        r += rgbShift.r
        g += rgbShift.g
        b += rgbShift.b

        // Grain
        if (effects.grain > 0) {
          const noise = (Math.random() - 0.5) * effects.grain * 2
          r += noise
          g += noise
          b += noise
        }

        // Clamp values
        data[i] = Math.max(0, Math.min(255, r))
        data[i + 1] = Math.max(0, Math.min(255, g))
        data[i + 2] = Math.max(0, Math.min(255, b))
      }

      ctx.putImageData(imageData, 0, 0)

      // Vignette effect
      if (effects.vignette > 0) {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
        )
        gradient.addColorStop(0, 'rgba(0,0,0,0)')
        gradient.addColorStop(1, `rgba(0,0,0,${effects.vignette / 100})`)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // RGB Split effect
      if (effects.rgbSplit > 0) {
        const offset = effects.rgbSplit / 2
        ctx.globalCompositeOperation = 'screen'
        ctx.globalAlpha = 0.5

        ctx.fillStyle = '#ff0000'
        ctx.drawImage(canvas, -offset, 0)

        ctx.fillStyle = '#0000ff'
        ctx.drawImage(canvas, offset, 0)

        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
      }

      // Blur effect
      if (filters.blur > 0) {
        ctx.filter = `blur(${filters.blur}px)`
        ctx.drawImage(canvas, 0, 0)
        ctx.filter = 'none'
      }

      // Invert
      if (filters.invert > 0) {
        ctx.globalCompositeOperation = 'difference'
        ctx.fillStyle = `rgba(255, 255, 255, ${filters.invert / 100})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = 'source-over'
      }

      // Draw stickers
      stickers.forEach(sticker => {
        ctx.save()
        ctx.translate(sticker.x, sticker.y)
        ctx.rotate((sticker.rotation * Math.PI) / 180)
        ctx.scale(sticker.scale, sticker.scale)
        ctx.font = '48px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(sticker.emoji, 0, 0)
        ctx.restore()
      })
    }
    img.src = originalImage
  }, [originalImage, filters, rgbShift, effects, stickers])

  return canvasRef
}
