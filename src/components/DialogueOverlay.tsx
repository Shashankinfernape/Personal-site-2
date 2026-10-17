// src/components/DialogueOverlay.tsx
import React, { useEffect } from 'react';
import { usePlayableWorldStore } from '../store/usePlayableWorldStore';
import { Bot, User, BookOpen, Compass, ChevronRight, X, Sparkles, Terminal } from 'lucide-react';

export const DialogueOverlay: React.FC = () => {
  const { activeDialogue, advanceDialogue, closeDialogue } = usePlayableWorldStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeDialogue) return;
      if (e.key === ' ' || e.key === 'Enter') {
        advanceDialogue();
      } else if (e.key === 'Escape') {
        closeDialogue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDialogue, advanceDialogue, closeDialogue]);

  if (!activeDialogue) return null;

  const { character, currentNodeIndex } = activeDialogue;
  const currentNode = character.initialDialogue[currentNodeIndex] || character.initialDialogue[0];
  const isLastNode = currentNodeIndex === character.initialDialogue.length - 1;

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'excited':
        return '#FFD800';
      case 'scholarly':
        return '#00F5D4';
      case 'solemn':
        return '#A855F7';
      case 'curious':
        return '#FF9776';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <div className="pointer-events-auto fixed bottom-8 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 px-4 font-mono select-none animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="relative rounded-2xl border-2 border-white/20 bg-[#121B17]/95 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        {/* Character Header Strip */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            {/* Illustrated Character Avatar Emblem */}
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl shadow-md border"
              style={{
                backgroundColor: character.secondaryColor,
                borderColor: character.primaryColor,
              }}
            >
              <Bot className="h-6 w-6" style={{ color: character.primaryColor }} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black uppercase text-white tracking-wide">
                  {character.name}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${character.primaryColor}20`,
                    color: character.primaryColor,
                    border: `1px solid ${character.primaryColor}40`,
                  }}
                >
                  {character.title}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">
                Emotion: <span style={{ color: getEmotionColor(currentNode.emotion) }}>{currentNode.emotion || 'friendly'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={closeDialogue}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
            title="Close Dialogue [ESC]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dialogue Text Content */}
        <div className="my-4 min-h-[64px] text-sm leading-relaxed text-[#F4F4ED]">
          <p className="font-sans text-base sm:text-lg">{currentNode.text}</p>
        </div>

        {/* Action Controls & Next Button */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
          <div className="text-[11px] text-zinc-400">
            {currentNodeIndex + 1} / {character.initialDialogue.length}
          </div>

          <div className="flex items-center gap-3">
            {/* If node has a direct project or research action prompt */}
            {currentNode.actionPrompt && (
              <button
                onClick={advanceDialogue}
                className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-black uppercase text-black shadow-md transition hover:brightness-110 active:scale-95"
                style={{ backgroundColor: character.primaryColor }}
              >
                <Sparkles className="h-4 w-4" />
                <span>{currentNode.actionPrompt}</span>
              </button>
            )}

            {/* Next / Finish Dialogue Button */}
            <button
              onClick={advanceDialogue}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-bold uppercase text-white transition hover:bg-white hover:text-black active:scale-95"
            >
              <span>{isLastNode ? 'Finish [SPACE]' : 'Next [SPACE]'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
