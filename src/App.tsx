import { useState, useRef, useEffect } from 'react'
import { 
  Upload, Download, RotateCcw, Image as ImageIcon, 
  Sparkles, Moon, Heart, Zap,
  Sliders, Sticker, X, Minus, Square
} from 'lucide-react'
import './App.css'

// Modular Imports
import { Header } from './components/Layout/Header'
import { PresetButtons } from './components/Filters/PresetButtons'
import { FilterSlider } from './components/Filters/FilterSlider'
import { useImageFilters } from './hooks/useImageFilters'
import { useStickers } from './hooks/useStickers'
import { STICKERS } from './constants/stickers'

function App() {
  // State
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'filters' | 'adjust' | 'effects' | 'stickers'>('filters')
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null)
  
  // Hooks
  const { 
    filters, rgbShift, effects, selectedPreset, 
    updateFilter, updateEffect, updateRGBShift, applyPreset, resetFilters 
  } = useImageFilters()
  
  const {
    stickers, showStickerPanel, setShowStickerPanel,
    selectedSticker, setSelectedSticker,
    addSticker, removeSticker, updateSticker, resetStickers
  } = useStickers()

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

  // Reset all
  const handleReset = () => {
    resetFilters()
    resetStickers()
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
      canvas.width = img.width
      canvas.height = img.height
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
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
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]
        
        r *= filters.brightness / 100
        g *= filters.brightness / 100
        b *= filters.brightness / 100
        
        const contrastFactor = (filters.contrast / 100) * (filters.contrast / 100)
        r = ((r - 128) * contrastFactor) + 128
        g = ((g - 128) * contrastFactor) + 128
        b = ((b - 128) * contrastFactor) + 128
        
        const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
        r = gray + (r - gray) * (filters.saturation / 100)
        g = gray + (g - gray) * (filters.saturation / 100)
        b = gray + (b - gray) * (filters.saturation / 100)
        
        if (filters.grayscale > 0) {
          const grayVal = 0.2989 * r + 0.5870 * g + 0.1140 * b
          r = r * (1 - filters.grayscale / 100) + grayVal * (filters.grayscale / 100)
          g = g * (1 - filters.grayscale / 100) + grayVal * (filters.grayscale / 100)
          b = b * (1 - filters.grayscale / 100) + grayVal * (filters.grayscale / 100)
        }
        
        if (filters.sepia > 0) {
          const s = filters.sepia / 100
          const tr = 0.393 * r + 0.769 * g + 0.189 * b
          const tg = 0.349 * r + 0.686 * g + 0.168 * b
          const tb = 0.272 * r + 0.534 * g + 0.131 * b
          r = r * (1 - s) + tr * s
          g = g * (1 - s) + tg * s
          b = b * (1 - s) + tb * s
        }
        
        if (filters.invert > 0) {
          const inv = filters.invert / 100
          r = r * (1 - inv) + (255 - r) * inv
          g = g * (1 - inv) + (255 - g) * inv
          b = b * (1 - inv) + (255 - b) * inv
        }
        
        r += rgbShift.r
        g += rgbShift.g
        b += rgbShift.b
        
        if (effects.grain > 0) {
          const noise = (Math.random() - 0.5) * effects.grain
          r += noise
          g += noise
          b += noise
        }
        
        data[i] = Math.min(255, Math.max(0, r))
        data[i + 1] = Math.min(255, Math.max(0, g))
        data[i + 2] = Math.min(255, Math.max(0, b))
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      if (effects.vignette > 0) {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2))
        )
        const v = effects.vignette / 100
        gradient.addColorStop(0, 'rgba(0,0,0,0)')
        gradient.addColorStop(1, \`rgba(0,0,0,\${v})\`)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      if (effects.rgbSplit > 0) {
        const shift = effects.rgbSplit / 2
        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const newData = ctx.createImageData(canvas.width, canvas.height)
        
        for (let i = 0; i < currentData.data.length; i += 4) {
          const x = (i / 4) % canvas.width
          const y = Math.floor((i / 4) / canvas.width)
          
          const rX = Math.min(canvas.width - 1, Math.max(0, x + shift))
          const bX = Math.min(canvas.width - 1, Math.max(0, x - shift))
          
          const rIdx = (y * canvas.width + Math.floor(rX)) * 4
          const bIdx = (y * canvas.width + Math.floor(bX)) * 4
          
          newData.data[i] = currentData.data[rIdx]
          newData.data[i + 1] = currentData.data[i + 1]
          newData.data[i + 2] = currentData.data[bIdx]
          newData.data[i + 3] = currentData.data[i + 3]
        }
        ctx.putImageData(newData, 0, 0)
      }
      
      stickers.forEach(sticker => {
        ctx.save()
        ctx.translate(sticker.x, sticker.y)
        ctx.rotate((sticker.rotation * Math.PI) / 180)
        ctx.scale(sticker.scale, sticker.scale)
        ctx.font = '40px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(sticker.emoji, 0, 0)
        ctx.restore()
      })
    }
    img.src = originalImage
  }, [originalImage, filters, rgbShift, effects, stickers])

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 font-mono selection:bg-cyan-500/30">
      <div className="scanline"></div>
      
      <div className="main-window w-full max-w-5xl bg-[#1a1a1e] border border-white/10 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative">
        <Header />

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-16 border-r border-white/5 bg-[#141417] flex flex-col items-center py-6 gap-8">
            <button className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <ImageIcon size={20} />
              <span className="text-[8px] block mt-1 uppercase font-bold">Inbox</span>
            </button>
            <button className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-colors">
              <Sliders size={20} />
              <span className="text-[8px] block mt-1 uppercase font-bold">Files</span>
            </button>
            <button className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-colors">
              <Download size={20} />
              <span className="text-[8px] block mt-1 uppercase font-bold">Save</span>
            </button>
          </div>

          <div className="flex-1 bg-[#0f0f12] p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-widest text-white/50">
                  Preview Mode
                </div>
                <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[10px] uppercase tracking-widest text-cyan-400 animate-pulse">
                  Live
                </div>
              </div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest">
                Resolution: {originalImage ? 'Custom' : 'N/A'}
              </div>
            </div>

            <div 
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="flex-1 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden group transition-all duration-500"
            >
              {!originalImage ? (
                <div className="text-center space-y-4 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all">
                    <Upload className="text-white/20 group-hover:text-cyan-400 transition-colors" size={32} />
                  </div>
                  <div>
                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Drag & drop an image here</p>
                    <p className="text-white/20 text-[10px] mt-1 uppercase">or click to browse</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <canvas 
                    ref={canvasRef}
                    className="max-w-full max-h-full shadow-2xl rounded-sm"
                    onMouseDown={(e) => {
                      const rect = canvasRef.current?.getBoundingClientRect()
                      if (!rect) return
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      
                      const clickedSticker = [...stickers].reverse().find(s => {
                        const dist = Math.sqrt(Math.pow(s.x - x, 2) + Math.pow(s.y - y, 2))
                        return dist < 30
                      })
                      
                      if (clickedSticker) {
                        setSelectedSticker(clickedSticker.id)
                        setDraggedSticker(clickedSticker.id)
                      } else {
                        setSelectedSticker(null)
                      }
                    }}
                    onMouseMove={(e) => {
                      if (draggedSticker) {
                        const rect = canvasRef.current?.getBoundingClientRect()
                        if (!rect) return
                        const x = e.clientX - rect.left
                        const y = e.clientY - rect.top
                        updateSticker(draggedSticker, { x, y })
                      }
                    }}
                    onMouseUp={() => setDraggedSticker(null)}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Upload size={16} className="text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw size={16} className="text-purple-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Reset</span>
              </button>
              <button 
                onClick={downloadImage}
                disabled={!originalImage}
                className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Download size={16} className="text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Save As...</span>
              </button>
              <button 
                onClick={() => setActiveTab('stickers')}
                className={\`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 \${activeTab === 'stickers' ? 'bg-pink-500/20 border-pink-400 text-pink-400' : 'bg-white/5 border-white/10 text-white/70'}\`}
              >
                <Sticker size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Stickers</span>
              </button>
            </div>

            <div className="h-8 border-t border-white/5 flex items-center px-2 justify-between">
              <div className="text-[9px] text-white/20 uppercase tracking-widest">
                {originalImage ? 'Image loaded' : 'No image loaded'}
              </div>
              <div className="flex gap-4">
                <div className="text-[9px] text-white/20 uppercase tracking-widest">
                  {stickers.length} stickers
                </div>
                <div className="text-[9px] text-cyan-500/50 uppercase tracking-widest">
                  100%
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-72 border-l border-white/5 bg-[#141417] flex flex-col">
            <div className="flex border-b border-white/5">
              <button 
                onClick={() => setActiveTab('filters')}
                className={\`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all \${activeTab === 'filters' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5' : 'text-white/30 hover:text-white/60'}\`}
              >
                Presets
              </button>
              <button 
                onClick={() => setActiveTab('adjust')}
                className={\`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all \${activeTab === 'adjust' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5' : 'text-white/30 hover:text-white/60'}\`}
              >
                Adjust
              </button>
              <button 
                onClick={() => setActiveTab('effects')}
                className={\`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all \${activeTab === 'effects' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5' : 'text-white/30 hover:text-white/60'}\`}
              >
                FX
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeTab === 'filters' && (
                <PresetButtons selectedPreset={selectedPreset} onApplyPreset={applyPreset} />
              )}

              {activeTab === 'adjust' && (
                <div className="space-y-6">
                  <FilterSlider label="Brightness" value={filters.brightness} min={0} max={200} onChange={(v) => updateFilter('brightness', v)} unit="%" />
                  <FilterSlider label="Contrast" value={filters.contrast} min={0} max={200} onChange={(v) => updateFilter('contrast', v)} unit="%" />
                  <FilterSlider label="Saturation" value={filters.saturation} min={0} max={200} onChange={(v) => updateFilter('saturation', v)} unit="%" />
                  <FilterSlider label="Hue Rotate" value={filters.hue} min={0} max={360} onChange={(v) => updateFilter('hue', v)} unit="°" />
                  <FilterSlider label="Blur" value={filters.blur} min={0} max={20} onChange={(v) => updateFilter('blur', v)} unit="px" />
                  <FilterSlider label="Grayscale" value={filters.grayscale} min={0} max={100} onChange={(v) => updateFilter('grayscale', v)} unit="%" />
                  <FilterSlider label="Sepia" value={filters.sepia} min={0} max={100} onChange={(v) => updateFilter('sepia', v)} unit="%" />
                  <FilterSlider label="Invert" value={filters.invert} min={0} max={100} onChange={(v) => updateFilter('invert', v)} unit="%" />
                  
                  <div className="pt-4 border-t border-white/5 space-y-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">RGB Shift</h3>
                    <FilterSlider label="Red" value={rgbShift.r} min={-100} max={100} onChange={(v) => updateRGBShift('r', v)} />
                    <FilterSlider label="Green" value={rgbShift.g} min={-100} max={100} onChange={(v) => updateRGBShift('g', v)} />
                    <FilterSlider label="Blue" value={rgbShift.b} min={-100} max={100} onChange={(v) => updateRGBShift('b', v)} />
                  </div>
                </div>
              )}

              {activeTab === 'effects' && (
                <div className="space-y-6">
                  <FilterSlider label="Film Grain" value={effects.grain} min={0} max={100} onChange={(v) => updateEffect('grain', v)} />
                  <FilterSlider label="Vignette" value={effects.vignette} min={0} max={100} onChange={(v) => updateEffect('vignette', v)} />
                  <FilterSlider label="RGB Split" value={effects.rgbSplit} min={0} max={50} onChange={(v) => updateEffect('rgbSplit', v)} />
                  <FilterSlider label="Pixelate" value={effects.pixelate} min={0} max={20} onChange={(v) => updateEffect('pixelate', v)} />
                </div>
              )}

              {activeTab === 'stickers' && (
                <div className="grid grid-cols-4 gap-2">
                  {STICKERS.map(sticker => (
                    <button
                      key={sticker.name}
                      onClick={() => addSticker(sticker.emoji)}
                      className="aspect-square bg-white/5 border border-white/10 rounded flex items-center justify-center text-2xl hover:bg-white/10 transition-all active:scale-90"
                    >
                      {sticker.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-10 bg-[#1a1a1e] border-t border-white/10 flex items-center px-4 justify-between">
          <div className="flex items-center gap-4">
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
              Start
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">DigiCam FX v1.0</div>
          </div>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold tabular-nums">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {selectedSticker && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-[#1a1a1e] border border-cyan-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-6 z-50 backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] uppercase font-bold text-white/40">Scale</span>
            <div className="flex items-center gap-3">
              <button onClick={() => updateSticker(selectedSticker, { scale: Math.max(0.1, stickers.find(s => s.id === selectedSticker)!.scale - 0.1) })} className="p-1 bg-white/5 rounded hover:bg-white/10"><Minus size={14}/></button>
              <span className="text-xs min-w-[30px] text-center">{Math.round(stickers.find(s => s.id === selectedSticker)!.scale * 100)}%</span>
              <button onClick={() => updateSticker(selectedSticker, { scale: stickers.find(s => s.id === selectedSticker)!.scale + 0.1 })} className="p-1 bg-white/5 rounded hover:bg-white/10"><Plus size={14}/></button>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="text-[8px] uppercase font-bold text-white/40">Rotate</span>
            <input 
              type="range" min="0" max="360" 
              value={stickers.find(s => s.id === selectedSticker)!.rotation}
              onChange={(e) => updateSticker(selectedSticker, { rotation: parseInt(e.target.value) })}
              className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
          <button 
            onClick={() => removeSticker(selectedSticker)}
            className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
}

export default App
