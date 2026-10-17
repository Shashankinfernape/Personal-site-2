// src/components/TouchControls.tsx
import React, { useState, useEffect } from 'react';
import { usePlayableWorldStore } from '../store/usePlayableWorldStore';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MessageSquare, Zap } from 'lucide-react';

export const TouchControls: React.FC = () => {
  const { nearbyNpc, startDialogue, activeDialogue } = usePlayableWorldStore();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Detect touch capability or small mobile viewport
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 840;
      setIsTouchDevice(hasTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  if (!isTouchDevice || activeDialogue) return null;

  const handleDirectionPress = (key: string, isDown: boolean) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(eventType, { key: key.toLowerCase() }));
  };

  const toggleRun = () => {
    const newRunning = !isRunning;
    setIsRunning(newRunning);
    window.dispatchEvent(new KeyboardEvent(newRunning ? 'keydown' : 'keyup', { key: 'shift' }));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-35 flex items-end justify-between p-4 sm:p-6 font-mono select-none">
      {/* Virtual D-Pad (Bottom-Left) */}
      <div className="pointer-events-auto relative h-36 w-36 rounded-full bg-[#121B17]/70 border border-white/20 p-2 backdrop-blur-md shadow-2xl">
        {/* Up */}
        <button
          onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('w', true); }}
          onTouchEnd={(e) => { e.preventDefault(); handleDirectionPress('w', false); }}
          onMouseDown={() => handleDirectionPress('w', true)}
          onMouseUp={() => handleDirectionPress('w', false)}
          className="absolute top-1 left-1/2 -translate-x-1/2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:bg-[#00F5D4] active:text-black text-white transition shadow"
          aria-label="Move Forward"
        >
          <ChevronUp className="h-6 w-6" />
        </button>

        {/* Down */}
        <button
          onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('s', true); }}
          onTouchEnd={(e) => { e.preventDefault(); handleDirectionPress('s', false); }}
          onMouseDown={() => handleDirectionPress('s', true)}
          onMouseUp={() => handleDirectionPress('s', false)}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:bg-[#00F5D4] active:text-black text-white transition shadow"
          aria-label="Move Backward"
        >
          <ChevronDown className="h-6 w-6" />
        </button>

        {/* Left */}
        <button
          onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('a', true); }}
          onTouchEnd={(e) => { e.preventDefault(); handleDirectionPress('a', false); }}
          onMouseDown={() => handleDirectionPress('a', true)}
          onMouseUp={() => handleDirectionPress('a', false)}
          className="absolute left-1 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:bg-[#00F5D4] active:text-black text-white transition shadow"
          aria-label="Move Left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Right */}
        <button
          onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('d', true); }}
          onTouchEnd={(e) => { e.preventDefault(); handleDirectionPress('d', false); }}
          onMouseDown={() => handleDirectionPress('d', true)}
          onMouseUp={() => handleDirectionPress('d', false)}
          className="absolute right-1 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:bg-[#00F5D4] active:text-black text-white transition shadow"
          aria-label="Move Right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Center Pivot Indicator */}
        <div className="absolute inset-0 m-auto h-4 w-4 rounded-full bg-white/20" />
      </div>

      {/* Action Buttons (Bottom-Right) */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Sprint Toggle */}
        <button
          onClick={toggleRun}
          className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition active:scale-90 ${
            isRunning
              ? 'border-[#FFD800] bg-[#FFD800] text-black font-black'
              : 'border-white/20 bg-[#121B17]/80 text-white'
          }`}
          title="Toggle Sprint"
        >
          <Zap className="h-5 w-5" />
        </button>

        {/* Talk Button if near NPC */}
        {nearbyNpc && (
          <button
            onClick={() => startDialogue(nearbyNpc)}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#00F5D4] bg-[#00F5D4] text-black shadow-lg animate-pulse active:scale-90 transition"
            title={`Talk to ${nearbyNpc.name}`}
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};
