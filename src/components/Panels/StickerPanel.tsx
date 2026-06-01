import React from 'react'
import { STICKERS } from '../../constants/stickers'
import './StickerPanel.css'

interface StickerPanelProps {
  onStickerSelect: (emoji: string) => void
}

export const StickerPanel: React.FC<StickerPanelProps> = ({ onStickerSelect }) => {
  return (
    <div className="sticker-panel">
      <h3 className="panel-title">Stickers</h3>
      <div className="stickers-grid">
        {STICKERS.map((sticker, index) => (
          <button
            key={index}
            className="sticker-btn"
            onClick={() => onStickerSelect(sticker.emoji)}
            title={sticker.name}
          >
            {sticker.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
