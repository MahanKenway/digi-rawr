import { useState, useRef } from 'react'
import { DraggableWindow } from './components/Windows/DraggableWindow'
import { ImageCanvas } from './components/Canvas/ImageCanvas'
import { FilterPanel } from './components/Panels/FilterPanel'
import { StickerPanel } from './components/Panels/StickerPanel'
import { Toolbar } from './components/Toolbar/Toolbar'
import { useImageFilters } from './hooks/useImageFilters'
import { useStickers } from './hooks/useStickers'
import './App.css'

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const {
    filters,
    rgbShift,
    effects,
    selectedPreset,
    updateFilter,
    updateRGBShift,
    updateEffect,
    applyPreset,
    resetFilters
  } = useImageFilters()

  const {
    stickers,
    selectedSticker,
    showStickerPanel,
    setShowStickerPanel,
    addSticker,
    resetStickers,
    setStickers
  } = useStickers()

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Download image
  const downloadImage = () => {
    if (!canvasRef.current) return

    const link = document.createElement('a')
    link.download = `digicam-edit-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  // Reset all
  const handleReset = () => {
    setOriginalImage(null)
    resetFilters()
    resetStickers()
  }

  // Sticker keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!selectedSticker || !originalImage) return

    setStickers(stickers.map(s => {
      if (s.id !== selectedSticker) return s

      switch ((e as any).key) {
        case 'Delete':
        case 'Backspace':
          return null as unknown as typeof s
        case 'ArrowUp':
          return { ...s, y: s.y - 5 }
        case 'ArrowDown':
          return { ...s, y: s.y + 5 }
        case 'ArrowLeft':
          return { ...s, x: s.x - 5 }
        case 'ArrowRight':
          return { ...s, x: s.x + 5 }
        case '+':
        case '=':
          return { ...s, scale: Math.min(3, s.scale + 0.1) }
        case '-':
          return { ...s, scale: Math.max(0.3, s.scale - 0.1) }
        case '[':
          return { ...s, rotation: (s.rotation - 15) % 360 }
        case ']':
          return { ...s, rotation: (s.rotation + 15) % 360 }
        default:
          return s
      }
    }).filter(Boolean) as typeof stickers)
  }

  return (
    <div className="app">
      {/* Toolbar */}
      <Toolbar
        onUpload={handleFileUpload}
        onDownload={downloadImage}
        onReset={handleReset}
      />

      {/* Main workspace */}
      <div className="workspace">
        {/* Canvas Window */}
        <DraggableWindow
          title="Image Editor"
          defaultX={50}
          defaultY={50}
          defaultWidth={600}
          defaultHeight={500}
          zIndex={10}
        >
          <ImageCanvas
            originalImage={originalImage}
            filters={filters}
            rgbShift={rgbShift}
            effects={effects}
            stickers={stickers}
            onCanvasReady={(canvas) => {
              canvasRef.current = canvas
            }}
          />
        </DraggableWindow>

        {/* Filter Panel Window */}
        <DraggableWindow
          title="Filters & Presets"
          defaultX={700}
          defaultY={50}
          defaultWidth={350}
          defaultHeight={500}
          zIndex={9}
        >
          <FilterPanel
            filters={filters}
            selectedPreset={selectedPreset}
            onFilterChange={updateFilter}
            onPresetSelect={applyPreset}
            onReset={resetFilters}
          />
        </DraggableWindow>

        {/* Sticker Panel Window */}
        <DraggableWindow
          title="Stickers"
          defaultX={1100}
          defaultY={50}
          defaultWidth={250}
          defaultHeight={400}
          zIndex={8}
        >
          <StickerPanel onStickerSelect={addSticker} />
        </DraggableWindow>
      </div>

      {/* Keyboard event listener */}
      <input
        type="text"
        style={{ position: 'fixed', left: '-9999px' }}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  )
}

export default App
