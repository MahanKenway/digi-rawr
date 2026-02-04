import { useState, useRef, useEffect } from 'react'
import { 
  Upload, Download, RotateCcw, Image as ImageIcon, 
  Sparkles, Moon, Heart, Zap,
  Sliders, Sticker, X, Minus, Square
} from 'lucide-react'
import './App.css'

// Types
interface FilterSettings {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  grayscale: number
  sepia: number
  invert: number
}

interface RGBShift {
  r: number
  g: number
  b: number
}

interface StickerData {
  id: string
  emoji: string
  x: number
  y: number
  scale: number
  rotation: number
}

interface Preset {
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

// Presets
const PRESETS: Preset[] = [
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

// Stickers
const STICKERS = [
  { emoji: '✨', name: 'Sparkles' },
  { emoji: '💀', name: 'Skull' },
  { emoji: '💔', name: 'Broken Heart' },
  { emoji: '☠️', name: 'Skull Cross' },
  { emoji: '🔴', name: 'Red Circle' },
  { emoji: '💙', name: 'Blue Heart' },
  { emoji: '💜', name: 'Purple Heart' },
  { emoji: '⚡', name: 'Lightning' },
  { emoji: '🌙', name: 'Moon' },
  { emoji: '⭐', name: 'Star' },
  { emoji: '🕷️', name: 'Spider' },
  { emoji: '🔱', name: 'Cross' },
  { emoji: '🔮', name: 'Crystal' },
  { emoji: '🎭', name: 'Mask' },
  { emoji: '🐉', name: 'Dragon' },
  { emoji: '🧠', name: 'Brain' },
  { emoji: '💾', name: 'Disk' },
  { emoji: '💻', name: 'Computer' },
  { emoji: '📷', name: 'Camera' },
  { emoji: '🎧', name: 'Headphones' },
  { emoji: '💎', name: 'Diamond' },
  { emoji: '🔪', name: 'Knife' },
  { emoji: '🌀', name: 'Cyclone' },
  { emoji: '⚔️', name: 'Swords' },
]

function App() {
  // State
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'filters' | 'adjust' | 'effects' | 'stickers'>('filters')
  const [selectedPreset, setSelectedPreset] = useState<string>('Normal')
  const [showStickerPanel, setShowStickerPanel] = useState(false)
  const [stickers, setStickers] = useState<StickerData[]>([])
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null)
  
  // Filter settings
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0
  })
  
  // RGB Shift
  const [rgbShift, setRgbShift] = useState<RGBShift>({ r: 0, g: 0, b: 0 })
  
  // Effects
  const [effects, setEffects] = useState({
    grain: 0,
    vignette: 0,
    rgbSplit: 0,
    pixelate: 0
  })

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

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

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    dropZoneRef.current?.classList.add('dragover')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dropZoneRef.current?.classList.remove('dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dropZoneRef.current?.classList.remove('dragover')
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  // Apply preset
  const applyPreset = (preset: Preset) => {
    setSelectedPreset(preset.name)
    setFilters(prev => ({ ...prev, ...preset.settings }))
    if (preset.rgbShift) setRgbShift(preset.rgbShift)
    if (preset.effects) setEffects(preset.effects)
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0
    })
    setRgbShift({ r: 0, g: 0, b: 0 })
    setEffects({ grain: 0, vignette: 0, rgbSplit: 0, pixelate: 0 })
    setStickers([])
    setSelectedPreset('Normal')
  }

  // Add sticker
  const addSticker = (emoji: string) => {
    const newSticker: StickerData = {
      id: Date.now().toString(),
      emoji,
      x: 150,
      y: 150,
      scale: 1,
      rotation: 0
    }
    setStickers([...stickers, newSticker])
    setShowStickerPanel(false)
  }

  // Remove sticker
  const removeSticker = (id: string) => {
    setStickers(stickers.filter(s => s.id !== id))
  }

  // Download image
  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const link = document.createElement('a')
    link.download = `digicam-edit-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Render canvas with filters
  useEffect(() => {
    if (!originalImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width
      canvas.height = img.height
      
      // Clear canvas
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
        
        // Red channel offset
        ctx.fillStyle = '#ff0000'
        ctx.drawImage(canvas, -offset, 0)
        
        // Blue channel offset
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

  // Handle canvas mouse events for dragging
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggedSticker || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    setStickers(stickers.map(s => 
      s.id === draggedSticker ? { ...s, x, y } : s
    ))
  }

  const handleCanvasMouseUp = () => {
    setDraggedSticker(null)
  }

  // Sticker keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedSticker) return
      
      setStickers(stickers.map(s => {
        if (s.id !== selectedSticker) return s
        
        switch(e.key) {
          case 'Delete':
          case 'Backspace':
            return null as unknown as StickerData
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
            return { ...s, rotation: s.rotation - 15 }
          case ']':
            return { ...s, rotation: s.rotation + 15 }
          default:
            return s
        }
      }).filter(Boolean) as StickerData[])
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setSelectedSticker(null)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedSticker, stickers])

  return (
    <div className="min-h-screen p-2 md:p-4" style={{ background: 'linear-gradient(135deg, #008080 0%, #006666 100%)' }}>
      {/* Main Window */}
      <div className="win98-window max-w-7xl mx-auto">
        {/* Title Bar */}
        <div className="win98-title-bar">
          <div className="win98-title-text">
            <ImageIcon size={14} />
            <span>DigiCam FX - Photo Editor</span>
          </div>
          <div className="win98-window-controls">
            <button className="win98-btn-window">
              <Minus size={10} />
            </button>
            <button className="win98-btn-window">
              <Square size={8} />
            </button>
            <button className="win98-btn-window">
              <X size={10} />
            </button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="win98-menu-bar">
          <span className="win98-menu-item">File</span>
          <span className="win98-menu-item">Edit</span>
          <span className="win98-menu-item">View</span>
          <span className="win98-menu-item">Help</span>
        </div>

        {/* Main Content */}
        <div className="p-2 flex flex-col lg:flex-row gap-2">
          {/* Left Panel - Canvas */}
          <div className="flex-1">
            <div className="win98-group" style={{ minHeight: '400px' }}>
              <span className="win98-group-title">Preview</span>
              
              {!originalImage ? (
                <div 
                  ref={dropZoneRef}
                  className="drop-zone h-80 flex flex-col items-center justify-center cursor-pointer"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={48} className="mb-4" style={{ color: 'var(--win-dark)' }} />
                  <p className="text-sm mb-2">Drag & drop an image here</p>
                  <p className="text-xs" style={{ color: 'var(--win-dark)' }}>or click to browse</p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="canvas-container relative" style={{ minHeight: '350px' }}>
                  <canvas 
                    ref={canvasRef}
                    className="max-w-full h-auto cursor-crosshair"
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    onClick={() => setSelectedSticker(null)}
                  />
                  {selectedSticker && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded">
                      Arrow keys: move | +/-: scale | [/]: rotate | Delete: remove
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-2 flex-wrap">
              <button 
                className="win98-btn win98-btn-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                Upload
              </button>
              <button 
                className="win98-btn"
                onClick={resetFilters}
                disabled={!originalImage}
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button 
                className="win98-btn win98-btn-primary"
                onClick={downloadImage}
                disabled={!originalImage}
              >
                <Download size={14} />
                Save As...
              </button>
              <button 
                className="win98-btn"
                onClick={() => setShowStickerPanel(true)}
                disabled={!originalImage}
              >
                <Sticker size={14} />
                Stickers
              </button>
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="w-full lg:w-80">
            {/* Tabs */}
            <div className="flex">
              <button 
                className={`win98-tab ${activeTab === 'filters' ? 'active' : ''}`}
                onClick={() => setActiveTab('filters')}
              >
                <Sparkles size={12} className="inline mr-1" />
                Presets
              </button>
              <button 
                className={`win98-tab ${activeTab === 'adjust' ? 'active' : ''}`}
                onClick={() => setActiveTab('adjust')}
              >
                <Sliders size={12} className="inline mr-1" />
                Adjust
              </button>
              <button 
                className={`win98-tab ${activeTab === 'effects' ? 'active' : ''}`}
                onClick={() => setActiveTab('effects')}
              >
                <Zap size={12} className="inline mr-1" />
                FX
              </button>
            </div>

            {/* Tab Content */}
            <div className="win98-window" style={{ borderTop: 'none' }}>
              <div className="p-3 h-96 overflow-y-auto win98-scroll">
                
                {/* Presets Tab */}
                {activeTab === 'filters' && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold mb-3">Y2K & Retro</div>
                    {PRESETS.filter(p => p.style === 'y2k' || p.style === 'normal').map(preset => (
                      <button
                        key={preset.name}
                        className={`win98-btn w-full justify-between ${selectedPreset === preset.name ? 'font-bold' : ''}`}
                        onClick={() => applyPreset(preset)}
                      >
                        <span>{preset.name}</span>
                        {selectedPreset === preset.name && <span>✓</span>}
                      </button>
                    ))}
                    
                    <div className="text-xs font-bold mb-3 mt-4">Goth</div>
                    {PRESETS.filter(p => p.style === 'goth').map(preset => (
                      <button
                        key={preset.name}
                        className={`win98-btn w-full justify-between ${selectedPreset === preset.name ? 'font-bold' : ''}`}
                        onClick={() => applyPreset(preset)}
                      >
                        <Moon size={12} className="mr-2" />
                        <span className="flex-1 text-left">{preset.name}</span>
                        {selectedPreset === preset.name && <span>✓</span>}
                      </button>
                    ))}
                    
                    <div className="text-xs font-bold mb-3 mt-4">Emo</div>
                    {PRESETS.filter(p => p.style === 'emo').map(preset => (
                      <button
                        key={preset.name}
                        className={`win98-btn w-full justify-between ${selectedPreset === preset.name ? 'font-bold' : ''}`}
                        onClick={() => applyPreset(preset)}
                      >
                        <Heart size={12} className="mr-2" />
                        <span className="flex-1 text-left">{preset.name}</span>
                        {selectedPreset === preset.name && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Adjust Tab */}
                {activeTab === 'adjust' && (
                  <div className="space-y-4">
                    {Object.entries(filters).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize">{key}</span>
                          <span>{value}{key !== 'hue' && key !== 'blur' ? '%' : key === 'blur' ? 'px' : '°'}</span>
                        </div>
                        <input
                          type="range"
                          className="win98-slider"
                          min={key === 'hue' ? -180 : key === 'blur' ? 0 : 0}
                          max={key === 'hue' ? 180 : key === 'blur' ? 20 : 200}
                          value={value}
                          onChange={(e) => setFilters({...filters, [key]: Number(e.target.value)})}
                        />
                      </div>
                    ))}
                    
                    <div className="win98-separator" />
                    
                    <div className="text-xs font-bold mb-2">RGB Tint</div>
                    {Object.entries(rgbShift).map(([channel, value]) => (
                      <div key={channel}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="uppercase" style={{ color: channel === 'r' ? '#800000' : channel === 'g' ? '#006000' : '#000080' }}>
                            {channel}
                          </span>
                          <span>{value}</span>
                        </div>
                        <input
                          type="range"
                          className="win98-slider"
                          min={-50}
                          max={50}
                          value={value}
                          onChange={(e) => setRgbShift({...rgbShift, [channel]: Number(e.target.value)})}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Effects Tab */}
                {activeTab === 'effects' && (
                  <div className="space-y-4">
                    {Object.entries(effects).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize">{key === 'rgbSplit' ? 'RGB Split' : key}</span>
                          <span>{value}{key === 'pixelate' ? 'px' : '%'}</span>
                        </div>
                        <input
                          type="range"
                          className="win98-slider"
                          min={0}
                          max={key === 'pixelate' ? 20 : 100}
                          value={value}
                          onChange={(e) => setEffects({...effects, [key]: Number(e.target.value)})}
                        />
                      </div>
                    ))}
                    
                    <div className="win98-separator" />
                    
                    <div className="text-xs" style={{ color: 'var(--win-dark)' }}>
                      <p className="mb-2"><strong>Tips:</strong></p>
                      <p>• Grain adds film noise</p>
                      <p>• Vignette darkens edges</p>
                      <p>• RGB Split creates glitch effect</p>
                      <p>• Pixelate for retro look</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="win98-status-bar">
          <div className="win98-status-panel">
            {originalImage ? 'Ready' : 'No image loaded'}
          </div>
          <div className="win98-status-panel" style={{ flex: '0 0 120px' }}>
            {stickers.length} sticker{stickers.length !== 1 ? 's' : ''}
          </div>
          <div className="win98-status-panel" style={{ flex: '0 0 80px' }}>
            100%
          </div>
        </div>
      </div>

      {/* Sticker Panel Popup */}
      {showStickerPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="win98-window w-full max-w-md">
            <div className="win98-title-bar">
              <div className="win98-title-text">
                <Sticker size={12} />
                <span>Sticker Pack</span>
              </div>
              <button 
                className="win98-btn-window"
                onClick={() => setShowStickerPanel(false)}
              >
                <X size={10} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs mb-3">Click a sticker to add it to your image. Click on the image to place it.</p>
              <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto win98-scroll p-2">
                {STICKERS.map((sticker) => (
                  <button
                    key={sticker.name}
                    className="sticker-item glitch-hover"
                    onClick={() => addSticker(sticker.emoji)}
                    title={sticker.name}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="win98-btn"
                  onClick={() => setShowStickerPanel(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticker List Panel */}
      {originalImage && stickers.length > 0 && (
        <div className="fixed bottom-4 left-4 win98-window z-40">
          <div className="win98-title-bar" style={{ padding: '2px 4px' }}>
            <span className="text-xs">Active Stickers</span>
          </div>
          <div className="p-2 max-h-32 overflow-y-auto win98-scroll">
            {stickers.map(sticker => (
              <div 
                key={sticker.id}
                className={`flex items-center justify-between gap-2 p-1 cursor-pointer text-xs ${selectedSticker === sticker.id ? 'bg-blue-800 text-white' : ''}`}
                onClick={() => setSelectedSticker(sticker.id)}
              >
                <span>{sticker.emoji}</span>
                <span className="text-xs opacity-70">({Math.round(sticker.x)}, {Math.round(sticker.y)})</span>
                <button 
                  className="win98-btn-window"
                  onClick={(e) => { e.stopPropagation(); removeSticker(sticker.id); }}
                >
                  <X size={8} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Icons */}
      <div className="fixed top-4 left-4 flex flex-col gap-4 pointer-events-none">
        <div className="win98-window pointer-events-auto" style={{ width: '64px' }}>
          <div className="p-2 text-center cursor-pointer hover:bg-blue-800 hover:text-white">
            <div className="text-2xl mb-1">📥</div>
            <div className="text-xs">Inbox</div>
          </div>
        </div>
        <div className="win98-window pointer-events-auto" style={{ width: '64px' }}>
          <div className="p-2 text-center cursor-pointer hover:bg-blue-800 hover:text-white">
            <div className="text-2xl mb-1">📁</div>
            <div className="text-xs">Files</div>
          </div>
        </div>
        <div className="win98-window pointer-events-auto" style={{ width: '64px' }}>
          <div className="p-2 text-center cursor-pointer hover:bg-blue-800 hover:text-white">
            <div className="text-2xl mb-1">💾</div>
            <div className="text-xs">Save</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#c0c0c0] border-t-2 border-white p-1 flex justify-between items-center text-xs z-30">
        <div className="flex items-center gap-2">
          <button className="win98-btn">
            <span className="font-bold">Start</span>
          </button>
          <span className="win98-separator" style={{ margin: 0, height: '20px', width: '2px' }} />
          <span>DigiCam FX v1.0</span>
        </div>
        <div className="win98-status-panel" style={{ flex: '0 0 80px' }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

export default App
