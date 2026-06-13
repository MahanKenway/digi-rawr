import React from 'react'
import { Image as ImageIcon } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <div className="h-10 bg-[#1a1a1e] border-b border-white/10 flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        <ImageIcon size={16} className="text-cyan-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">DigiCam FX - Photo Editor</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-white/40 uppercase tracking-widest">File</span>
        <span className="text-[10px] text-white/40 uppercase tracking-widest">Edit</span>
        <span className="text-[10px] text-white/40 uppercase tracking-widest">View</span>
        <span className="text-[10px] text-white/40 uppercase tracking-widest">Help</span>
      </div>
    </div>
  )
}
