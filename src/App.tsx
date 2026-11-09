import React, { useState, useEffect, useCallback } from 'react';
import { BodyCanvas, VisualMode } from './components/ThreeCanvas/BodyCanvas';
import { CAMERA_PRESETS } from './components/ThreeCanvas/proceduralAnatomy';
import { ControlDock } from './components/UI/ControlDock';
import { ExerciseDetailModal } from './components/UI/ExerciseDetailModal';
import { AiCoachModal } from './components/UI/AiCoachModal';
import { TopHeader } from './components/UI/TopHeader';
import { Exercise, MUSCLE_DATA } from './data/muscleData';

export default function App() {
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>('chest');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [activePresetView, setActivePresetView] = useState<keyof typeof CAMERA_PRESETS | null>('front');
  const [visualMode, setVisualMode] = useState<VisualMode>('anatomic');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [highlightedMuscleIds, setHighlightedMuscleIds] = useState<string[]>([]);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState<boolean>(false);

  // When a muscle is selected, smartly align the camera to its primary anatomical view
  const handleSelectMuscle = useCallback((muscleId: string | null) => {
    setSelectedMuscleId(muscleId);
    if (muscleId && MUSCLE_DATA[muscleId]) {
      const data = MUSCLE_DATA[muscleId];
      if (data.view === 'back') {
        setActivePresetView('back');
      } else if (data.view === 'front') {
        setActivePresetView('front');
      }
    }
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (activeExercise) {
          setActiveExercise(null);
        } else if (isAiCoachOpen) {
          setIsAiCoachOpen(false);
        } else if (selectedMuscleId) {
          setSelectedMuscleId(null);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        setAutoRotate((prev) => !prev);
      } else if (e.key === '1') {
        setActivePresetView('front');
      } else if (e.key === '2') {
        setActivePresetView('back');
      } else if (e.key === '3') {
        setActivePresetView('upper');
      } else if (e.key === '4') {
        setActivePresetView('lower');
      } else if (e.key === '0') {
        setActivePresetView('iso');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeExercise, isAiCoachOpen, selectedMuscleId]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070a13] select-none font-sans">
      {/* Top Branding & Spec Overlay */}
      <TopHeader
        selectedMuscleId={selectedMuscleId}
        onClearSelection={() => setSelectedMuscleId(null)}
        onOpenAiCoach={() => setIsAiCoachOpen(true)}
      />

      {/* Primary 3D Musculoskeletal Viewport */}
      <main className="w-full h-full">
        <BodyCanvas
          selectedMuscleId={selectedMuscleId}
          onSelectMuscle={handleSelectMuscle}
          activePresetView={activePresetView}
          visualMode={visualMode}
          autoRotate={autoRotate}
          highlightedMuscleIds={highlightedMuscleIds}
        />
      </main>

      {/* Ergonomic Bottom Control Dock (Collapsible, zero viewport occlusion) */}
      <ControlDock
        selectedMuscleId={selectedMuscleId}
        onSelectMuscle={handleSelectMuscle}
        onSelectExercise={(exercise) => setActiveExercise(exercise)}
        activePresetView={activePresetView}
        onSelectCameraPreset={(preset) => setActivePresetView(preset)}
        visualMode={visualMode}
        onChangeVisualMode={(mode) => setVisualMode(mode)}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        highlightedMuscleIds={highlightedMuscleIds}
        onSetHighlightedMuscleIds={setHighlightedMuscleIds}
        onOpenAiCoach={() => setIsAiCoachOpen(true)}
      />

      {/* Detailed Exercise Kinetic Modal & Cadence Metronome */}
      <ExerciseDetailModal
        exercise={activeExercise}
        onClose={() => setActiveExercise(null)}
      />

      {/* AI Biomechanical & Injury Coach Modal */}
      <AiCoachModal
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        selectedMuscleId={selectedMuscleId}
        onSelectMuscle={handleSelectMuscle}
      />
    </div>
  );
}
