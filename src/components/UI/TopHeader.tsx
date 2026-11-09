import React, { useState } from 'react';
import {
  Activity,
  Sparkles,
  HelpCircle,
  Eye,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { MUSCLE_DATA } from '../../data/muscleData';

interface TopHeaderProps {
  selectedMuscleId: string | null;
  onClearSelection: () => void;
  onOpenAiCoach: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  selectedMuscleId,
  onClearSelection,
  onOpenAiCoach,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const selectedMuscle = selectedMuscleId ? MUSCLE_DATA[selectedMuscleId] : null;

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between">
        {/* Left: Branding & Active Muscle Spec Badge */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-tight text-white">
                  KINEO<span className="text-cyan-400">3D</span>
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                  Musculoskeletal Atlas
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Interactive 3D Body Map &amp; Exercise Engine
              </p>
            </div>
          </div>

          {/* Active Muscle Badge */}
          {selectedMuscle && (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/90 border border-cyan-500/50 rounded-2xl shadow-xl backdrop-blur-md animate-in fade-in">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedMuscle.accentColor }}
              />
              <span className="text-xs font-bold text-white">
                {selectedMuscle.name}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({selectedMuscle.latinName})
              </span>
              <button
                onClick={onClearSelection}
                className="ml-1 text-[11px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
                title="Deselect Muscle (Esc)"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick actions & Keyboard hints */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 text-xs font-semibold shadow-lg backdrop-blur-md transition-all"
            title="Interactive Controls Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Hotkeys &amp; Controls</span>
          </button>
        </div>
      </header>

      {/* Hotkeys & Navigation Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                3D Navigation &amp; Interaction Guide
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Rotate 3D Body</span>
                <span className="font-mono bg-slate-900 px-2 py-1 rounded text-cyan-300">
                  Left Click + Drag
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Zoom In / Out</span>
                <span className="font-mono bg-slate-900 px-2 py-1 rounded text-cyan-300">
                  Mouse Scroll / Pinch
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Pan Camera</span>
                <span className="font-mono bg-slate-900 px-2 py-1 rounded text-cyan-300">
                  Right Click + Drag
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Highlight Muscle &amp; View Exercises</span>
                <span className="font-mono bg-slate-900 px-2 py-1 rounded text-cyan-300">
                  Click on Muscle Mesh
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Toggle Zen / Cinema Dock</span>
                <span className="font-mono bg-slate-900 px-2 py-1 rounded text-cyan-300">
                  [ H ] or Collapse Arrow
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Deselect Active Muscle</span>
                <span className="font-mono bg-slate-900 px-2 py-1 rounded text-cyan-300">
                  [ Esc ]
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              Got it, let&apos;s explore!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
