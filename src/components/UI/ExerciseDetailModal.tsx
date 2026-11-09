import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Dumbbell,
  Target,
  Flame,
  Award,
} from 'lucide-react';
import { Exercise } from '../../data/muscleData';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onSelectMuscleRegion?: (muscleId: string) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
}) => {
  // Metronome & Cadence State
  const [isPlayingCadence, setIsPlayingCadence] = useState(false);
  const [currentRep, setCurrentRep] = useState(1);
  const [targetReps, setTargetReps] = useState(10);
  const [tempoPhase, setTempoPhase] = useState<'eccentric' | 'hold' | 'concentric' | 'top'>('eccentric');
  const [secondsRemaining, setSecondsRemaining] = useState(3);
  const [completedSets, setCompletedSets] = useState<{ weight: number; reps: number }[]>([]);
  const [inputWeight, setInputWeight] = useState(60);
  const [inputReps, setInputReps] = useState(10);

  // Audio Context for procedural cadence sound
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = (freq = 440, duration = 0.08) => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch {
      // Audio autoplay may be suppressed if no direct gesture, ignore gracefully
    }
  };

  // Reset cadence if exercise changes
  useEffect(() => {
    setIsPlayingCadence(false);
    setCurrentRep(1);
    setTempoPhase('eccentric');
    setSecondsRemaining(3);
  }, [exercise]);

  // Tempo Cadence Timer Engine
  useEffect(() => {
    if (!isPlayingCadence || !exercise) return;

    // Parse tempo string like "3-1-1-0"
    const parts = exercise.tempo.split('-').map((n) => parseInt(n, 10) || 1);
    const [eccentricSec = 3, holdSec = 1, concentricSec = 1, topSec = 0] = parts;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          playBeep(tempoPhase === 'concentric' ? 660 : 350, 0.06);
          return prev - 1;
        }

        // Phase Transition
        if (tempoPhase === 'eccentric') {
          if (holdSec > 0) {
            setTempoPhase('hold');
            playBeep(520, 0.1);
            return holdSec;
          } else {
            setTempoPhase('concentric');
            playBeep(700, 0.12);
            return concentricSec;
          }
        } else if (tempoPhase === 'hold') {
          setTempoPhase('concentric');
          playBeep(750, 0.12);
          return concentricSec;
        } else if (tempoPhase === 'concentric') {
          if (topSec > 0) {
            setTempoPhase('top');
            playBeep(880, 0.15);
            return topSec;
          } else {
            // Rep completed
            handleRepCompleted(eccentricSec);
            return eccentricSec;
          }
        } else {
          // 'top' -> new rep
          handleRepCompleted(eccentricSec);
          return eccentricSec;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlayingCadence, tempoPhase, exercise, currentRep, targetReps]);

  const handleRepCompleted = (nextEccentricTime: number) => {
    setCurrentRep((prev) => {
      if (prev >= targetReps) {
        setIsPlayingCadence(false);
        playBeep(920, 0.3);
        return 1;
      }
      playBeep(880, 0.18);
      return prev + 1;
    });
    setTempoPhase('eccentric');
  };

  const logSet = () => {
    setCompletedSets([...completedSets, { weight: inputWeight, reps: inputReps }]);
  };

  if (!exercise) return null;

  const phaseColors = {
    eccentric: 'text-amber-400 bg-amber-500/15 border-amber-500/40',
    hold: 'text-blue-400 bg-blue-500/15 border-blue-500/40',
    concentric: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
    top: 'text-purple-400 bg-purple-500/15 border-purple-500/40',
  };

  const phaseLabels = {
    eccentric: 'Lowering (Eccentric Stretch)',
    hold: 'Isometric Pause / Stretch',
    concentric: 'Lifting (Concentric Drive)',
    top: 'Peak Contraction Squeeze',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {exercise.equipment}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                {exercise.type}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                  exercise.difficulty === 'Beginner'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : exercise.difficulty === 'Intermediate'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {exercise.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              {exercise.name}
            </h2>
            <p className="text-sm text-cyan-400 font-mono mt-0.5">
              Targeting: {exercise.targetSubregion}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overview text */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 text-slate-300 text-sm leading-relaxed">
            {exercise.description}
          </div>

          {/* Interactive Cadence & Tempo Metronome */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900 p-5 rounded-2xl border border-cyan-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white text-base">
                  Interactive Cadence &amp; Tempo Metronome
                </h3>
              </div>
              <div className="text-xs font-mono px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
                Prescribed Tempo: <span className="text-cyan-400 font-bold">{exercise.tempo}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Cadence Circle / Visual Timer */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Repetition {currentRep} / {targetReps}
                </div>
                <div
                  className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 ${phaseColors[tempoPhase]}`}
                >
                  <span className="text-3xl font-extrabold font-mono">{secondsRemaining}s</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest mt-0.5">
                    {tempoPhase}
                  </span>
                </div>
                <div className="text-xs text-center font-medium mt-2 text-slate-300">
                  {phaseLabels[tempoPhase]}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-medium">Target Reps:</label>
                  <select
                    value={targetReps}
                    onChange={(e) => setTargetReps(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
                  >
                    {[5, 6, 8, 10, 12, 15, 20].map((r) => (
                      <option key={r} value={r}>
                        {r} Reps
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingCadence(!isPlayingCadence)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-md ${
                      isPlayingCadence
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {isPlayingCadence ? (
                      <>
                        <Pause className="w-4 h-4" /> Pause Cadence
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Start Form Cadence
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsPlayingCadence(false);
                      setCurrentRep(1);
                      setSecondsRemaining(3);
                      setTempoPhase('eccentric');
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
                    title="Reset Metronome"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Audio &amp; visual pulse guides you to maintain controlled eccentric time-under-tension for optimal hypertrophy.
                </p>
              </div>

              {/* Set Logger */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Log Completed Set</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Weight (kg/lbs)</label>
                    <input
                      type="number"
                      value={inputWeight}
                      onChange={(e) => setInputWeight(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Reps Completed</label>
                    <input
                      type="number"
                      value={inputReps}
                      onChange={(e) => setInputReps(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={logSet}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-cyan-300 transition-colors"
                >
                  + Add to Set History ({completedSets.length} sets logged)
                </button>
              </div>
            </div>
          </div>

          {/* Step-by-Step Execution Guide */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Step-by-Step Biomechanical Execution
            </h3>
            <div className="space-y-2.5">
              {exercise.stepByStep.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 border border-cyan-500/30">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Tips & Common Mistakes (Side-by-Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form Tips */}
            <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/30">
              <h4 className="text-sm font-semibold text-emerald-400 mb-2.5 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Coaching Cues for Maximum Growth
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {exercise.formTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="p-4 bg-rose-950/20 rounded-xl border border-rose-500/30">
              <h4 className="text-sm font-semibold text-rose-400 mb-2.5 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Critical Mistakes to Avoid
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rep Range & Prescription Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Raw Strength (1-5 RPE 9)
              </span>
              <span className="text-base font-bold text-white font-mono">
                {exercise.repRange.strength}
              </span>
            </div>
            <div className="p-3.5 bg-cyan-950/30 rounded-xl border border-cyan-500/40 text-center">
              <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider block mb-1 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Hypertrophy (Muscle Mass)
              </span>
              <span className="text-base font-bold text-cyan-200 font-mono">
                {exercise.repRange.hypertrophy}
              </span>
            </div>
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Rest Between Sets
              </span>
              <span className="text-base font-bold text-white font-mono">
                {exercise.restSeconds} Seconds
              </span>
            </div>
          </div>

          {/* Muscle Recruitment Tags */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              Active Anatomical Recruits
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.primaryMuscles.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                >
                  Primary: {m}
                </span>
              ))}
              {exercise.secondaryMuscles.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
                >
                  Synergist: {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            <span>Optimal progressive overload: Increase weight or reps weekly while maintaining form.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors border border-slate-700"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};
