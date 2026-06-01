import React from 'react'
import { Upload, Download, RotateCcw } from 'lucide-react'
import './Toolbar.css'

interface ToolbarProps {
  onUpload: (file: File) => void
  onDownload: () => void
  onReset: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onUpload,
  onDownload,
  onReset
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
  }

  return (
    <div className="toolbar">
      <button
        className="toolbar-btn"
        onClick={() => fileInputRef.current?.click()}
        title="Upload Image"
      >
        <Upload size={20} />
        <span>Upload</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <button
        className="toolbar-btn"
        onClick={onDownload}
        title="Download Image"
      >
        <Download size={20} />
        <span>Download</span>
      </button>

      <div className="toolbar-separator" />

      <button
        className="toolbar-btn"
        onClick={onReset}
        title="Reset All"
      >
        <RotateCcw size={20} />
        <span>Reset</span>
      </button>
    </div>
  )
}
