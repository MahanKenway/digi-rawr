import React, { useState, useRef } from 'react'
import { Minus, Square, X } from 'lucide-react'
import './DraggableWindow.css'

interface DraggableWindowProps {
  title: string
  children: React.ReactNode
  onClose?: () => void
  defaultX?: number
  defaultY?: number
  defaultWidth?: number
  defaultHeight?: number
  zIndex?: number
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
  title,
  children,
  onClose,
  defaultX = 100,
  defaultY = 100,
  defaultWidth = 400,
  defaultHeight = 300,
  zIndex = 1
}) => {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY })
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isMinimized, setIsMinimized] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return
    
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={windowRef}
      className="draggable-window"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
        zIndex,
        userSelect: isDragging ? 'none' : 'auto'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Title Bar */}
      <div
        className="window-titlebar"
        onMouseDown={handleMouseDown}
      >
        <span className="window-title">{title}</span>
        <div className="window-controls">
          <button
            className="window-btn minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title="Minimize"
          >
            <Minus size={16} />
          </button>
          <button
            className="window-btn maximize-btn"
            title="Maximize"
          >
            <Square size={16} />
          </button>
          <button
            className="window-btn close-btn"
            onClick={onClose}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="window-content">
          {children}
        </div>
      )}
    </div>
  )
}
