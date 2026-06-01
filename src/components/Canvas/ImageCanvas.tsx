import React, { useRef, useEffect } from 'react'
import { useCanvas } from '../../hooks/useCanvas'
import { FilterSettings, RGBShift, Effects, StickerData } from '../../types'
import './ImageCanvas.css'

interface ImageCanvasProps {
  originalImage: string | null
  filters: FilterSettings
  rgbShift: RGBShift
  effects: Effects
  stickers: StickerData[]
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({
  originalImage,
  filters,
  rgbShift,
  effects,
  stickers,
  onCanvasReady
}) => {
  const canvasRef = useCanvas(originalImage, filters, rgbShift, effects, stickers)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (canvasRef.current && onCanvasReady) {
      onCanvasReady(canvasRef.current)
    }
  }, [onCanvasReady])

  return (
    <div className="image-canvas-container" ref={containerRef}>
      {!originalImage ? (
        <div className="canvas-placeholder">
          <p>📷 Upload or drag an image to start editing</p>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="image-canvas"
        />
      )}
    </div>
  )
}
