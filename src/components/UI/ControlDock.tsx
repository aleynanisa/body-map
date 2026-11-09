import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Layers,
  Camera,
  Sparkles,
  RotateCw,
  Search,
  ArrowRight,
  Filter,
  Check,
  Activity,
  Flame,
  Info,
} from 'lucide-react';
import {
  MUSCLE_DATA,
  MuscleGroup,
  Exercise,
  BODY_SPLIT_PRESETS,
} from '../../data/muscleData';
import { CAMERA_PRESETS } from '../ThreeCanvas/proceduralAnatomy';
import { VisualMode } from '../ThreeCanvas/BodyCanvas';

interface ControlDockProps {
  selectedMuscleId: string | null;
  onSelectMuscle: (id: string | null) => void;
  onSelectExercise: (exercise: Exercise) => void;
  activePresetView: keyof typeof CAMERA_PRESETS | null;
  onSelectCameraPreset: (preset: keyof typeof CAMERA_PRESETS) => void;
  visualMode: VisualMode;
  onChangeVisualMode: (mode: VisualMode) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  highlightedMuscleIds: string[];
  onSetHighlightedMuscleIds: (ids: string[]) => void;
  onOpenAiCoach: () => void;
}

type TabType = 'exercises' | 'muscles' | 'workout' | 'display';

export const ControlDock: React.FC<ControlDockProps> = ({
  selectedMuscleId,
  onSelectMuscle,
  onSelectExercise,
  activePresetView,
  onSelectCameraPreset,
  visualMode,
  onChangeVisualMode,
  autoRotate,
  onToggleAutoRotate,
  highlightedMuscleIds,
  onSetHighlightedMuscleIds,
  onOpenAiCoach,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('exercises');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('All');
  const [muscleSearch, setMuscleSearch] = useState<string>('');
  const [selectedSplitId, setSelectedSplitId] = useState<string>('all');

  const selectedMuscle: MuscleGroup | undefined = selectedMuscleId
    ? MUSCLE_DATA[selectedMuscleId]
    : undefined;

  // Filter exercises for selected muscle
  const filteredExercises = (selectedMuscle?.exercises || []).filter((ex) => {
    if (equipmentFilter === 'All') return true;
    return ex.equipment === equipmentFilter;
  });

  // Filter muscles for muscle tab
  const splitPreset = BODY_SPLIT_PRESETS.find((s) => s.id === selectedSplitId);
  const filteredMuscles = Object.values(MUSCLE_DATA).filter((m) => {
    const matchesSplit = !splitPreset || splitPreset.muscleIds.includes(m.id);
    const matchesSearch =
      m.name.toLowerCase().includes(muscleSearch.toLowerCase()) ||
      m.latinName.toLowerCase().includes(muscleSearch.toLowerCase()) ||
      m.region.toLowerCase().includes(muscleSearch.toLowerCase());
    return matchesSplit && matchesSearch;
  });

  // Handle split selection
  const handleSelectSplit = (splitId: string) => {
    setSelectedSplitId(splitId);
    const split = BODY_SPLIT_PRESETS.find((s) => s.id === splitId);
    if (split) {
      onSetHighlightedMuscleIds(split.muscleIds);
      if (!split.muscleIds.includes(selectedMuscleId || '')) {
        onSelectMuscle(split.muscleIds[0]);
      }
    }
  };

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ease-out select-none ${
        isCollapsed ? 'bottom-0 translate-y-[calc(100%-36px)]' : 'bottom-5'
      }`}
      style={{
        width: 'min(940px, 94vw)',
      }}
    >
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-t-xl border-t border-x border-slate-700/80 text-xs font-semibold shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Toggle Dock Visibility (Key: H)"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Show Muscle &amp; Exercise Dock</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Controls (Zen View)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col text-slate-200">
        {/* Navigation Tab Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveTab('exercises');
                setIsCollapsed(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'exercises'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Exercise Guide</span>
              {selectedMuscle && (
                <span className="w-2 h-2 rounded-full bg-slate-950/70" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('muscles');
                setIsCollapsed(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'muscles'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Muscle Directory</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('workout');
                setIsCollapsed(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'workout'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Routine Generator</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('display');
                setIsCollapsed(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'display'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera &amp; View</span>
            </button>
          </div>

          {/* AI Coach Action Button */}
          <button
            onClick={onOpenAiCoach}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 shrink-0 ml-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">AI Biomechanics Coach</span>
            <span className="sm:hidden">AI Coach</span>
          </button>
        </div>

        {/* Tab 1: Exercises for Selected Muscle */}
        {activeTab === 'exercises' && (
          <div className="p-4 space-y-3">
            {selectedMuscle ? (
              <>
                {/* Active Muscle Info Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md"
                      style={{ backgroundColor: selectedMuscle.accentColor }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {selectedMuscle.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ({selectedMuscle.latinName})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        <strong className="text-slate-300">Biomechanical Action:</strong>{' '}
                        {selectedMuscle.actions.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Equipment Quick Filter */}
                  <div className="flex items-center gap-1 self-start sm:self-auto overflow-x-auto no-scrollbar">
                    {['All', 'Barbell', 'Dumbbell', 'Cable', 'Bodyweight'].map((eq) => (
                      <button
                        key={eq}
                        onClick={() => setEquipmentFilter(eq)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          equipmentFilter === eq
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {eq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exercises Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      onClick={() => onSelectExercise(exercise)}
                      className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            {exercise.name}
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {exercise.targetSubregion}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            exercise.difficulty === 'Beginner'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : exercise.difficulty === 'Intermediate'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {exercise.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2.5 pt-2 border-t border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-slate-900 rounded text-cyan-300 text-[10px] font-mono">
                            {exercise.equipment}
                          </span>
                          <span className="text-slate-400">
                            Hypertrophy: <strong className="text-white">{exercise.repRange.hypertrophy}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-semibold group-hover:underline">
                          Inspect Guide →
                        </span>
                      </div>
                    </div>
                  ))}

                  {filteredExercises.length === 0 && (
                    <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
                      No exercises found with equipment &quot;{equipmentFilter}&quot;. Try selecting &quot;All&quot;.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-3 bg-slate-950/40 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-300">
                  Click on any muscle region on the 3D body map or select a muscle below to reveal targeted exercises:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {['chest', 'lats', 'deltoids', 'quads', 'biceps', 'glutes'].map((id) => {
                    const m = MUSCLE_DATA[id];
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          onSelectMuscle(id);
                          if (m.view === 'back') onSelectCameraPreset('back');
                          else onSelectCameraPreset('front');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: m.accentColor }}
                        />
                        <span>{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Muscle Directory */}
        {activeTab === 'muscles' && (
          <div className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              {/* Split filter */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {BODY_SPLIT_PRESETS.map((split) => (
                  <button
                    key={split.id}
                    onClick={() => handleSelectSplit(split.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedSplitId === split.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {split.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter muscle anatomy..."
                  value={muscleSearch}
                  onChange={(e) => setMuscleSearch(e.target.value)}
                  className="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Muscle Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredMuscles.map((muscle) => {
                const isSelected = selectedMuscleId === muscle.id;
                return (
                  <button
                    key={muscle.id}
                    onClick={() => {
                      onSelectMuscle(muscle.id);
                      if (muscle.view === 'back') onSelectCameraPreset('back');
                      else if (muscle.view === 'front') onSelectCameraPreset('front');
                      setActiveTab('exercises');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: muscle.accentColor }}
                        />
                        <span className="text-xs font-semibold">{muscle.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {muscle.exercises.length} Exercises
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Workout Routine Generator */}
        {activeTab === 'workout' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Structured Workout Routine Generator
                </h4>
                <p className="text-xs text-slate-400">
                  Select a training protocol to generate an optimal hypertrophy routine:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'push',
                  title: 'Push Day (Chest, Shoulders, Triceps)',
                  muscles: ['chest', 'deltoids', 'triceps'],
                  desc: 'Focus on horizontal pressing, vertical pressing, and elbow extension.',
                },
                {
                  id: 'pull',
                  title: 'Pull Day (Back, Lats, Biceps)',
                  muscles: ['lats', 'traps', 'biceps', 'lower_back'],
                  desc: 'Focus on vertical pulldowns, horizontal rows, and elbow flexion.',
                },
                {
                  id: 'legs',
                  title: 'Leg Day (Quads, Hamstrings, Glutes)',
                  muscles: ['quads', 'hamstrings', 'glutes', 'calves'],
                  desc: 'Quad knee extension, hamstring hip hinges, and calf plantarflexion.',
                },
              ].map((routine) => (
                <div
                  key={routine.id}
                  onClick={() => {
                    onSetHighlightedMuscleIds(routine.muscles);
                    onSelectMuscle(routine.muscles[0]);
                    setActiveTab('exercises');
                  }}
                  className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/60 rounded-xl transition-all cursor-pointer group"
                >
                  <h5 className="text-xs font-bold text-white group-hover:text-cyan-300">
                    {routine.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {routine.desc}
                  </p>
                  <div className="mt-2 text-[10px] font-semibold text-cyan-400 flex items-center gap-1">
                    <span>Load Routine &amp; Highlight 3D Muscles →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Camera & Display Visual Modes */}
        {activeTab === 'display' && (
          <div className="p-4 space-y-4">
            {/* Camera View Angle Presets */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Camera Angle Presets (Smooth Motion Interpolation)
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'front', label: 'Front View (Anterior)' },
                  { key: 'back', label: 'Back View (Posterior)' },
                  { key: 'left', label: 'Left Flank' },
                  { key: 'right', label: 'Right Flank' },
                  { key: 'upper', label: 'Upper Torso Closeup' },
                  { key: 'lower', label: 'Legs &amp; Feet Closeup' },
                  { key: 'iso', label: 'Reset Camera' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onSelectCameraPreset(item.key as keyof typeof CAMERA_PRESETS)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      activePresetView === item.key
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Shader & Lighting Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Rendering Shader Mode
                </span>
                <div className="flex gap-2">
                  {[
                    { id: 'anatomic', label: 'Human Muscle Tissue' },
                    { id: 'xray', label: 'Holographic X-Ray' },
                    { id: 'neon', label: 'Color Regional' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => onChangeVisualMode(mode.id as VisualMode)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium border transition-all text-center ${
                        visualMode === mode.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Turntable Auto-Rotate */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Turntable Animation
                </span>
                <button
                  onClick={onToggleAutoRotate}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                    autoRotate
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                  <span>{autoRotate ? 'Auto-Rotate: Enabled' : 'Auto-Rotate: Paused'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
