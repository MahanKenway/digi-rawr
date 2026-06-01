import { useState, useCallback } from 'react'
import { StickerData } from '../types'

export const useStickers = () => {
  const [stickers, setStickers] = useState<StickerData[]>([])
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [showStickerPanel, setShowStickerPanel] = useState(false)

  const addSticker = useCallback((emoji: string) => {
    const newSticker: StickerData = {
      id: Date.now().toString(),
      emoji,
      x: 150,
      y: 150,
      scale: 1,
      rotation: 0
    }
    setStickers(prev => [...prev, newSticker])
    setShowStickerPanel(false)
  }, [])

  const removeSticker = useCallback((id: string) => {
    setStickers(prev => prev.filter(s => s.id !== id))
    if (selectedSticker === id) setSelectedSticker(null)
  }, [selectedSticker])

  const updateSticker = useCallback((id: string, updates: Partial<StickerData>) => {
    setStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [])

  const resetStickers = useCallback(() => {
    setStickers([])
    setSelectedSticker(null)
  }, [])

  return {
    stickers,
    selectedSticker,
    showStickerPanel,
    setSelectedSticker,
    setShowStickerPanel,
    addSticker,
    removeSticker,
    updateSticker,
    resetStickers,
    setStickers
  }
}
