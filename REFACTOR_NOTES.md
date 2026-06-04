# DigiRawr - Y2K Photo Editor Refactoring Notes

## 📋 Project Overview

**DigiRawr** is a retro Y2K-inspired photo editor built with React, TypeScript, and Vite. It features Windows 95/98-style UI with draggable windows, advanced photo filters, sticker overlays, and preset effects.

## 🔧 Architecture Refactoring

### Previous State (Monolithic)
- **Single file**: `App.tsx` with 883+ lines
- **Mixed concerns**: UI, state management, canvas rendering all in one component
- **Difficult to maintain**: Hard to locate and modify specific features
- **Performance issues**: All state updates triggered full re-renders

### New State (Modular)
```
src/
├── types/
│   └── index.ts              # All TypeScript interfaces
├── constants/
│   ├── presets.ts            # Filter presets
│   └── stickers.ts           # Sticker emojis
├── hooks/
│   ├── useImageFilters.ts    # Filter state management
│   ├── useStickers.ts        # Sticker state management
│   └── useCanvas.ts          # Canvas rendering logic
├── components/
│   ├── Windows/
│   │   ├── DraggableWindow.tsx
│   │   └── DraggableWindow.css
│   ├── Canvas/
│   │   ├── ImageCanvas.tsx
│   │   └── ImageCanvas.css
│   ├── Panels/
│   │   ├── FilterPanel.tsx
│   │   ├── FilterPanel.css
│   │   ├── StickerPanel.tsx
│   │   └── StickerPanel.css
│   └── Toolbar/
│       ├── Toolbar.tsx
│       └── Toolbar.css
├── App.tsx                   # Main component (now ~110 lines)
└── App.css                   # Global styles
```

## 🎯 Key Improvements

### 1. **Separation of Concerns**
- **Types**: Centralized type definitions for better type safety
- **Constants**: Extracted presets and stickers for easier maintenance
- **Hooks**: Reusable logic for filters, stickers, and canvas rendering
- **Components**: Focused, single-responsibility components

### 2. **Custom Hooks**
- `useImageFilters()`: Manages filter state and preset application
- `useStickers()`: Handles sticker management and selection
- `useCanvas()`: Encapsulates canvas rendering logic

### 3. **Component Structure**
- `DraggableWindow`: Reusable Y2K-style window component with drag support
- `ImageCanvas`: Canvas rendering with filter/effect application
- `FilterPanel`: Filter controls and preset selection
- `StickerPanel`: Sticker picker interface
- `Toolbar`: Main toolbar with upload/download/reset buttons

### 4. **Y2K Windows 95/98 Styling**
- Authentic Windows UI with beveled buttons and borders
- Classic blue title bars with gradient
- Proper scrollbar styling
- Retro color scheme (#008080 teal background)
- Pixel-perfect rendering

### 5. **Performance Optimizations**
- Memoized callbacks with `useCallback`
- Separated concerns reduce unnecessary re-renders
- Canvas rendering isolated in custom hook
- Efficient state updates

## 📊 Code Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Main file size | 883 lines | 110 lines | -87.5% |
| Number of files | 3 | 18 | +500% |
| Maintainability | Low | High | ⬆️ |
| Testability | Poor | Good | ⬆️ |
| Reusability | None | High | ⬆️ |

## 🚀 Features

### Photo Editing
- **8 Filter Types**: Brightness, Contrast, Saturation, Hue, Blur, Grayscale, Sepia, Invert
- **4 Advanced Effects**: Grain, Vignette, RGB Split, Pixelate
- **9 Presets**: Normal, Digicam, Y2K Aesthetic, Goth Dark, Goth Noir, Emo Purple, Emo Red, Glitch Core, Pixel Dreams
- **RGB Shift**: Independent R, G, B channel manipulation

### Stickers & Decorations
- **24 Emoji Stickers**: Skulls, hearts, lightning, moons, stars, and more
- **Sticker Controls**: 
  - Arrow keys to move
  - +/- to scale
  - [/] to rotate
  - Delete/Backspace to remove

### User Interface
- **Draggable Windows**: Y2K-style windows with minimize/maximize/close buttons
- **Windows 95/98 Styling**: Authentic retro look and feel
- **Responsive Layout**: Multiple panels can be arranged freely

## 🛠️ Development

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

### Linting
```bash
npm run lint
```

## 📦 Dependencies

### Core
- **React 19.2.0**: UI framework
- **TypeScript 5.9.3**: Type safety
- **Vite 7.2.4**: Build tool
- **Tailwind CSS 4.1.18**: Utility-first CSS

### UI & Animation
- **Framer Motion 12.29.2**: Smooth animations
- **Lucide React 0.563.0**: Icon library

### Routing & Deployment
- **React Router DOM 7.13.0**: Client-side routing
- **gh-pages 6.3.0**: GitHub Pages deployment

## 🎨 Design System

### Colors
- **Primary**: #000080 (Windows blue)
- **Secondary**: #c0c0c0 (Windows gray)
- **Accent**: #008080 (Teal)
- **Text**: #000000 (Black)

### Typography
- **Font Family**: 'MS Sans Serif', Arial, sans-serif
- **Font Size**: 11px (Windows 95/98 standard)

### Components
- **Buttons**: Beveled, 3D effect with inset/outset borders
- **Windows**: Gradient title bars, draggable headers
- **Scrollbars**: Classic Windows styling

## 🔄 Migration Guide

### For Developers
If you need to add new features:

1. **Add types** in `src/types/index.ts`
2. **Create constants** in `src/constants/`
3. **Create custom hooks** in `src/hooks/` if needed
4. **Create components** in `src/components/`
5. **Use in App.tsx**

### Example: Adding a New Filter
```typescript
// 1. Update types
interface FilterSettings {
  // ... existing filters
  newFilter: number
}

// 2. Update useImageFilters hook
const updateFilter = (key: keyof FilterSettings, value: number) => {
  // Already handles new filters automatically
}

// 3. Add to FilterPanel
<input
  type="range"
  value={filters.newFilter}
  onChange={(e) => onFilterChange('newFilter', parseInt(e.target.value))}
/>
```

## 🐛 Known Issues & Future Improvements

### Current Limitations
- Text layer support not yet implemented
- Frame/border effects not yet implemented
- No undo/redo functionality
- Single image editing only

### Planned Features
- [ ] Text tool with custom fonts and colors
- [ ] Frame/border decorations
- [ ] Undo/redo stack
- [ ] Multiple image support
- [ ] Export presets
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements

## 📝 File Structure Summary

```
digi-rawr/
├── src/
│   ├── types/index.ts                    # Type definitions
│   ├── constants/
│   │   ├── presets.ts                    # Filter presets
│   │   └── stickers.ts                   # Sticker data
│   ├── hooks/
│   │   ├── useImageFilters.ts            # Filter management
│   │   ├── useStickers.ts                # Sticker management
│   │   └── useCanvas.ts                  # Canvas rendering
│   ├── components/
│   │   ├── Windows/DraggableWindow.tsx   # Draggable window
│   │   ├── Canvas/ImageCanvas.tsx        # Canvas component
│   │   ├── Panels/FilterPanel.tsx        # Filter controls
│   │   ├── Panels/StickerPanel.tsx       # Sticker picker
│   │   └── Toolbar/Toolbar.tsx           # Main toolbar
│   ├── App.tsx                           # Main app component
│   ├── App.css                           # Global styles
│   ├── index.css                         # Base styles
│   └── main.tsx                          # Entry point
├── public/
│   └── vite.svg
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🎓 Learning Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 📄 License

This project is open source and available under the MIT License.

---

**Last Updated**: June 2026  
**Version**: 2.0.0 (Refactored)  
**Status**: ✅ Production Ready
