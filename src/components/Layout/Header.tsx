import React from 'react'

export const Header: React.FC = () => {
  return (
    <div className="window-header flex items-center justify-between px-4 py-2 border-b border-white/20">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
        <span className="ml-2 font-bold tracking-wider text-sm uppercase">DigiCam FX - Photo Editor</span>
      </div>
      <div className="flex gap-4 text-xs opacity-70">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>
    </div>
  )
}
