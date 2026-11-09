import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldAlert,
  Send,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  ChevronRight,
} from 'lucide-react';
import { MUSCLE_DATA } from '../../data/muscleData';

interface AiCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMuscleId: string | null;
  onSelectMuscle: (muscleId: string) => void;
}

interface BiomechanicsAdvice {
  title: string;
  analysis: string;
  safeAlternatives: {
    name: string;
    whyItWorks: string;
    targetMuscleId: string;
  }[];
  formModifications: string[];
}

export const AiCoachModal: React.FC<AiCoachModalProps> = ({
  isOpen,
  onClose,
  selectedMuscleId,
  onSelectMuscle,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<string>('lower-back');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advice, setAdvice] = useState<BiomechanicsAdvice | null>(null);

  if (!isOpen) return null;

  const currentMuscle = selectedMuscleId ? MUSCLE_DATA[selectedMuscleId] : null;

  const presetQuestions = [
    {
      label: 'Lower Back Safe Chest & Legs',
      issue: 'lower-back',
      query: 'What are the best chest and leg exercises that eliminate axial spinal loading?',
    },
    {
      label: 'Shoulder Impingement Friendly',
      issue: 'shoulder-impingement',
      query: 'Give me shoulder and chest exercises that prevent anterior capsule impingement.',
    },
    {
      label: 'Knee Pain / Patellar Friendly',
      issue: 'knee-pain',
      query: 'How to build quads and glutes with zero patellar tendon aggravation.',
    },
    {
      label: 'Lats Mind-Muscle Connection',
      issue: 'form-cue',
      query: 'How do I stop my forearms and biceps from taking over on lat pulldowns and rows?',
    },
  ];

  const handleGenerateAdvice = (queryText = customQuery) => {
    setIsLoading(true);

    setTimeout(() => {
      // Biomechanical reasoning engine generating targeted anatomy solutions
      if (selectedIssue === 'lower-back' || queryText.toLowerCase().includes('back')) {
        setAdvice({
          title: 'Axial De-loaded Biomechanical Protocol',
          analysis:
            'Standard squats and conventional deadlifts impart heavy vertical compressive forces (axial shear) across L4-S1 lumbar vertebrae. To maximize muscular tension on targeted quads, glutes, or chest while sparing the spine, we utilize chest-supported setups and deficit unilateral levers.',
          safeAlternatives: [
            {
              name: 'Chest-Supported Dumbbell Incline Row',
              whyItWorks: 'Eliminates 100% of lumbar erector isometric fatigue, channeling pure latissimus dorsi and rhomboid recruitment.',
              targetMuscleId: 'lats',
            },
            {
              name: 'Deficit Bulgarian Split Squat (Torso Braced)',
              whyItWorks: 'Cuts spinal compressive load in half compared to bilateral barbell back squats while doubling single-leg quad/glute tension.',
              targetMuscleId: 'quads',
            },
            {
              name: 'Floor Press or Low-Incline Dumbbell Press',
              whyItWorks: 'Floor stops elbow descent at 90°, preventing excessive lumbar arching and shoulder anterior glide.',
              targetMuscleId: 'chest',
            },
          ],
          formModifications: [
            'Maintain a 360° intra-abdominal brace by exhaling forcefully into the oblique wall before every rep.',
            'Substitute standing overhead barbell presses with seated high-incline dumbbell presses.',
            'Utilize 45-degree back extension isometrics to rebuild posterior chain endurance with zero spinal flexion.',
          ],
        });
      } else if (selectedIssue === 'shoulder-impingement' || queryText.toLowerCase().includes('shoulder')) {
        setAdvice({
          title: 'Subacromial Space Protection Protocol',
          analysis:
            'When pressing with elbows flared at 90°, the supraspinatus tendon is pinched against the acromion process. Rotating to a neutral or 45° tucked grip clears the subacromial passage and shifts tension into the sternal pec fibers and lateral deltoid bellies.',
          safeAlternatives: [
            {
              name: 'Neutral Grip Dumbbell Incline Press',
              whyItWorks: 'Palms facing creates external humerus rotation, maximizing clearance under the clavicle.',
              targetMuscleId: 'chest',
            },
            {
              name: 'Leaning Cable Lateral Raise (Behind Body)',
              whyItWorks: 'Continuous resistance matching the deltoid length-tension curve without supraspinatus friction.',
              targetMuscleId: 'deltoids',
            },
            {
              name: 'Face Pull with Double External Rotation',
              whyItWorks: 'Strengthens infraspinatus and lower traps to depress the humeral head during pressing.',
              targetMuscleId: 'deltoids',
            },
          ],
          formModifications: [
            'Avoid flaring elbows perpendicular to torso on any pressing exercise.',
            'Retract and depress scapulae into bench pad before racking/unracking weights.',
            'Warm up rotator cuffs with 2 sets of light external rotations.',
          ],
        });
      } else if (selectedIssue === 'knee-pain' || queryText.toLowerCase().includes('knee')) {
        setAdvice({
          title: 'Patellofemoral Shear Reduction Protocol',
          analysis:
            'Deep forward knee travel beyond toes without adequate hip hinge places peak shear stresses on the patellar tendon. Increasing hip hinge angle and elevating heels or using box pauses redirects force vectors safely into the glutes and posterior chain.',
          safeAlternatives: [
            {
              name: 'Reverse Lunges from Deficit',
              whyItWorks: 'Shin stays vertical, keeping knee shear near zero while delivering high glute and hamstring stimulus.',
              targetMuscleId: 'glutes',
            },
            {
              name: 'Barbell Romanian Deadlift (RDL)',
              whyItWorks: 'Focuses strictly on hip hinge mechanics, developing massive posterior chain power without knee stress.',
              targetMuscleId: 'hamstrings',
            },
            {
              name: 'High-Foot-Placement Leg Press',
              whyItWorks: 'Places feet near the top edge of the sled to emphasize hip extension rather than pure knee flexion.',
              targetMuscleId: 'quads',
            },
          ],
          formModifications: [
            'Perform a 2-second isometric pause at the bottom of reps to eliminate tendon spring rebound.',
            'Warm up with 3 minutes of backward walking on treadmill or reverse sled dragging to increase synovial fluid.',
          ],
        });
      } else {
        setAdvice({
          title: 'Mind-Muscle Motor Unit Neuromuscular Tuning',
          analysis:
            'When pulling with the hands, the forearms and biceps act as the primary lever, prematurely fatiguing before the large latissimus dorsi fibers receive adequate mechanical tension. We implement the "hook grip" cue and elbow-path driving.',
          safeAlternatives: [
            {
              name: 'Thumbless Grip Neutral Lat Pulldown',
              whyItWorks: 'Removing thumbs from the bar relaxes the forearm flexor reflex, transferring tension directly to lats.',
              targetMuscleId: 'lats',
            },
            {
              name: 'Straight Arm Cable Lat Pushdown',
              whyItWorks: 'Locks out elbow joint, completely eliminating biceps from the pulling movement.',
              targetMuscleId: 'lats',
            },
          ],
          formModifications: [
            'Mentally visualize pulling your elbows towards your hip pockets, not pulling the bar to your chest.',
            'Hold the peak concentric contraction for a strict 2-second count to build neural motor patterns.',
          ],
        });
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-violet-950/40 via-slate-900 to-cyan-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">AI Biomechanics &amp; Injury Coach</h3>
              <p className="text-xs text-slate-400">
                Tailored exercise modifications based on joint mechanics &amp; injury history
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Active Muscle Context */}
          {currentMuscle && (
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentMuscle.accentColor }}
                />
                <span className="text-slate-300">Currently Focused Muscle:</span>
                <strong className="text-white">{currentMuscle.name}</strong>
              </div>
              <span className="text-cyan-400 font-mono text-[11px]">{currentMuscle.region}</span>
            </div>
          )}

          {/* Quick preset scenarios */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Common Joint Considerations &amp; Movement Goals:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetQuestions.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedIssue(preset.issue);
                    setCustomQuery(preset.query);
                    handleGenerateAdvice(preset.query);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between group ${
                    selectedIssue === preset.issue
                      ? 'bg-violet-950/50 border-violet-500/60 text-violet-200'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <span className="font-semibold">{preset.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              Or Describe Your Specific Joint Issue / Training Goal:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Wrist pain during bench press, or safe lats exercises with shoulder stiffness..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateAdvice()}
                className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={() => handleGenerateAdvice()}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Advice Output Panel */}
          {advice && (
            <div className="bg-slate-950/70 p-4 rounded-xl border border-violet-500/40 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <h4 className="font-bold text-white text-sm">{advice.title}</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {advice.analysis}
              </p>

              {/* Safe Alternatives */}
              <div>
                <span className="text-xs font-bold text-cyan-400 block mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Biomechanical Substitutes:
                </span>
                <div className="space-y-2">
                  {advice.safeAlternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{alt.name}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{alt.whyItWorks}</p>
                      </div>
                      <button
                        onClick={() => {
                          onSelectMuscle(alt.targetMuscleId);
                          onClose();
                        }}
                        className="px-2 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg text-[10px] font-semibold hover:bg-cyan-500/30 transition-colors shrink-0"
                      >
                        Inspect 3D →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Cues */}
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Key Safety Rules:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {advice.formModifications.map((cue, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
