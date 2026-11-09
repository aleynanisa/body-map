export interface Exercise {
  id: string;
  name: string;
  equipment: 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight' | 'Resistance Band';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Compound' | 'Isolation';
  targetSubregion: string;
  description: string;
  stepByStep: string[];
  formTips: string[];
  commonMistakes: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  repRange: {
    strength: string;
    hypertrophy: string;
    endurance: string;
  };
  tempo: string; // e.g. "3-1-1-0" (eccentric - pause - concentric - lockout)
  restSeconds: number;
}

export interface MuscleGroup {
  id: string;
  name: string;
  latinName: string;
  region: 'chest' | 'back' | 'shoulders' | 'arms' | 'core' | 'legs';
  subregion: string;
  view: 'front' | 'back' | 'both';
  actions: string[];
  origin: string;
  insertion: string;
  accentColor: string;
  glowColor: string;
  description: string;
  meshIds: string[];
  exercises: Exercise[];
}

export const MUSCLE_DATA: Record<string, MuscleGroup> = {
  chest: {
    id: 'chest',
    name: 'Chest',
    latinName: 'Pectoralis Major & Minor',
    region: 'chest',
    subregion: 'Clavicular (Upper) & Sternal (Mid/Lower) Heads',
    view: 'front',
    actions: ['Horizontal shoulder adduction', 'Shoulder flexion (upper head)', 'Internal arm rotation'],
    origin: 'Clavicle, sternum, and cartilage of true ribs 1-6',
    insertion: 'Lateral lip of the bicipital groove of humerus',
    accentColor: '#ef4444', // Red-500
    glowColor: '#f87171',
    description: 'The primary pushing engine of the upper body, driving pressing movements, hugging mechanics, and horizontal arm adduction.',
    meshIds: ['muscle_chest_left', 'muscle_chest_right', 'muscle_chest_upper_left', 'muscle_chest_upper_right'],
    exercises: [
      {
        id: 'bench-press',
        name: 'Barbell Flat Bench Press',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        type: 'Compound',
        targetSubregion: 'Mid & Sternal Pectoralis Major',
        description: 'The golden standard upper-body push exercise for raw pressing power, structural chest density, and tricep recruitment.',
        stepByStep: [
          'Lie firmly on bench with 5 points of contact: head, upper back, glutes, and both feet planted flat.',
          'Retract and depress shoulder blades, pinching them into the bench pad to protect the rotator cuff.',
          'Grip bar slightly wider than shoulder-width with a wrapped thumb grip and wrists stacked over elbows.',
          'Unrack bar, lower under control with elbows angled at approximately 45-70° until bar touches lower sternum.',
          'Drive bar upward along a slight J-curve back over shoulder line without bouncing off the ribcage.'
        ],
        formTips: [
          'Maintain a stable thoracic arch while keeping glutes locked to the bench.',
          'Focus on driving your biceps toward each other at the apex of the press to maximize pec contraction.',
          'Keep your feet screwed into the floor for leg drive.'
        ],
        commonMistakes: [
          'Flaring elbows out at 90° (places destructive shear stress on anterior shoulder capsule).',
          'Lifting glutes off the bench to cheat weight.',
          'Bouncing the barbell off the sternum.'
        ],
        primaryMuscles: ['Pectoralis Major (Sternal & Costal)', 'Anterior Deltoid'],
        secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior'],
        repRange: { strength: '3-5 reps', hypertrophy: '6-10 reps', endurance: '12-15 reps' },
        tempo: '3-1-1-0',
        restSeconds: 120
      },
      {
        id: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press (30°)',
        equipment: 'Dumbbell',
        difficulty: 'Beginner',
        type: 'Compound',
        targetSubregion: 'Clavicular Head (Upper Chest)',
        description: 'Targeted clavicular fiber recruitment allowing natural wrist rotation and extended active range of motion.',
        stepByStep: [
          'Set adjustable bench to a 30° incline angle (too steep shifts load into the shoulders).',
          'Kick dumbbells up into starting position over upper chest with palms facing slightly inward.',
          'Lower weights slowly, feeling a deep stretch across upper chest as dumbbells reach armpit level.',
          'Press upwards along a subtle converging arc, stopping just short of banging weights together at top.'
        ],
        formTips: [
          'Keep elbows tucked at 45-60° throughout descent.',
          'Do not lock out elbows with hyperextension at top; keep tension solely on upper pecs.'
        ],
        commonMistakes: ['Setting bench angle too high (>45° turns it into an anterior delt press)', 'Dropping elbows excessively deep without shoulder mobility'],
        primaryMuscles: ['Pectoralis Major (Clavicular Head)'],
        secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
        repRange: { strength: '5-8 reps', hypertrophy: '8-12 reps', endurance: '12-15 reps' },
        tempo: '3-1-1-0',
        restSeconds: 90
      },
      {
        id: 'cable-chest-flye',
        name: 'Standing High-to-Low Cable Flye',
        equipment: 'Cable',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Lower & Sternal Pec Fibers',
        description: 'Continuous matched resistance curve offering peak contraction at full horizontal adduction.',
        stepByStep: [
          'Position cable pulleys high above head height and select D-handles.',
          'Take a staggered stance, hinge forward slightly at hips, keeping chest elevated.',
          'With a slight bend in elbows, sweep hands downward and together in a hugging arc.',
          'Cross hands slightly at bottom peak contraction and hold for a full 1-second squeeze.'
        ],
        formTips: ['Imagine hugging a large barrel to keep arm bend constant throughout movement.'],
        commonMistakes: ['Turning flye into a pressing motion by bending and straightening elbows excessively.'],
        primaryMuscles: ['Pectoralis Major'],
        secondaryMuscles: ['Anterior Deltoid', 'Biceps (short head stabilization)'],
        repRange: { strength: '8-10 reps', hypertrophy: '10-15 reps', endurance: '15-20 reps' },
        tempo: '2-1-1-1',
        restSeconds: 60
      },
      {
        id: 'dips-chest',
        name: 'Parallel Bar Chest Dips',
        equipment: 'Bodyweight',
        difficulty: 'Advanced',
        type: 'Compound',
        targetSubregion: 'Lower Pectoralis & Serratus',
        description: 'Unrivaled bodyweight mass builder targeting lower pec fibers through extended vertical pressing.',
        stepByStep: [
          'Mount parallel dip bars and lean torso forward approximately 30° with knees bent.',
          'Elbows flare slightly outward rather than hugging tight to ribs.',
          'Descend smoothly until shoulders dip below elbow joint line (approx 90° arm angle).',
          'Drive through palms, pressing body upward to full contraction while preserving forward torso tilt.'
        ],
        formTips: ['Keep chin tucked and eyes focused 4 feet forward to maintain chest emphasis.'],
        commonMistakes: ['Staying completely vertical (converts emphasis directly onto triceps).', 'Bouncing violently at bottom.'],
        primaryMuscles: ['Pectoralis Major (Lower/Costal)', 'Triceps Brachii'],
        secondaryMuscles: ['Anterior Deltoid', 'Serratus Anterior'],
        repRange: { strength: '5-8 reps (weighted)', hypertrophy: '8-12 reps', endurance: '15+ reps' },
        tempo: '3-1-1-0',
        restSeconds: 90
      }
    ]
  },

  deltoids: {
    id: 'deltoids',
    name: 'Shoulders (Deltoids)',
    latinName: 'Deltoideus (Anterior, Lateral, Posterior)',
    region: 'shoulders',
    subregion: 'Anterior (Front), Lateral (Side), & Posterior (Rear) Heads',
    view: 'both',
    actions: ['Shoulder abduction (lateral)', 'Shoulder flexion (anterior)', 'Horizontal abduction (posterior)'],
    origin: 'Lateral clavicle, acromion, and spine of scapula',
    insertion: 'Deltoid tuberosity of humerus',
    accentColor: '#f97316', // Orange-500
    glowColor: '#fb923c',
    description: 'Forms the 3D muscular cap of the shoulder, critical for overhead pressing, arm elevation, and broad aesthetic frame.',
    meshIds: ['muscle_delt_ant_left', 'muscle_delt_ant_right', 'muscle_delt_lat_left', 'muscle_delt_lat_right', 'muscle_delt_post_left', 'muscle_delt_post_right'],
    exercises: [
      {
        id: 'overhead-press',
        name: 'Standing Barbell Overhead Press (OHP)',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        type: 'Compound',
        targetSubregion: 'Anterior Deltoid & Core Stabilizers',
        description: 'Fundamental vertical pressing benchmark testing full-body kinetic chain transfer from ground to hands.',
        stepByStep: [
          'Rack bar at collarbone height. Grip bar just outside shoulder width with forearms perfectly vertical.',
          'Squeeze glutes, tighten abs, and screw heels into ground.',
          'Pull head slightly back as you press bar vertically in a straight vertical line past your forehead.',
          'Once bar clears head, move torso forward underneath bar and lock out with shrug at top.'
        ],
        formTips: ['Do not hyperextend lumbar spine. Squeeze glutes rock-hard throughout entire lift.'],
        commonMistakes: ['Excessive backward leaning resembling an incline press', 'Elbows flared back instead of tucked forward under bar'],
        primaryMuscles: ['Anterior Deltoid', 'Lateral Deltoid'],
        secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Core Stabilizers'],
        repRange: { strength: '3-6 reps', hypertrophy: '6-10 reps', endurance: '10-12 reps' },
        tempo: '2-1-1-0',
        restSeconds: 120
      },
      {
        id: 'lateral-raises',
        name: 'Leaning Cable Lateral Raise',
        equipment: 'Cable',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Lateral Deltoid (Width Cap)',
        description: 'Continuous tension through entire range of motion to build lateral shoulder width and 3D deltoid caps.',
        stepByStep: [
          'Set cable pulley at wrist height. Stand sideways and grip upright post with inside hand.',
          'Lean torso slightly away from machine at approx 15° angle.',
          'Raise cable handle out to side leading with elbow until arm reaches parallel with floor.',
          'Lower under a controlled 3-second negative.'
        ],
        formTips: ['Keep wrist neutral and pinky slightly higher than index finger (pouring pitcher cue).'],
        commonMistakes: ['Shrugging traps up towards ears', 'Swinging torso for momentum'],
        primaryMuscles: ['Lateral Deltoid'],
        secondaryMuscles: ['Supraspinatus', 'Upper Trapezius'],
        repRange: { strength: '8-10 reps', hypertrophy: '12-16 reps', endurance: '15-25 reps' },
        tempo: '3-1-1-1',
        restSeconds: 60
      },
      {
        id: 'face-pulls',
        name: 'Rope Face Pull with External Rotation',
        equipment: 'Cable',
        difficulty: 'Beginner',
        type: 'Compound',
        targetSubregion: 'Posterior Deltoid & Rotator Cuff',
        description: 'Postural bulletproofing movement strengthening rear deltoids, infraspinatus, and mid-traps.',
        stepByStep: [
          'Attach rope attachment to cable pulley at upper chest/face level.',
          'Grip rope with neutral or overhand thumbs-back grip and step back.',
          'Pull center of rope directly toward bridge of nose while actively pulling rope ends apart.',
          'Finish with hands beside ears in a double-bicep flex pose with high elbows.'
        ],
        formTips: ['Initiate with rear delts and scapular retraction, not forearm biceps pull.'],
        commonMistakes: ['Using excessive weight and yanking torso backwards', 'Dropping elbows below wrist line'],
        primaryMuscles: ['Posterior Deltoid', 'Infraspinatus & Teres Minor'],
        secondaryMuscles: ['Rhomboids', 'Mid Trapezius'],
        repRange: { strength: '10-12 reps', hypertrophy: '12-18 reps', endurance: '20+ reps' },
        tempo: '2-1-1-1',
        restSeconds: 60
      }
    ]
  },

  biceps: {
    id: 'biceps',
    name: 'Biceps Brachii',
    latinName: 'Biceps Brachii & Brachialis',
    region: 'arms',
    subregion: 'Long Head (Outer Peak) & Short Head (Inner Thickness)',
    view: 'front',
    actions: ['Elbow flexion', 'Forearm supination (turning palm up)', 'Weak shoulder flexion'],
    origin: 'Supraglenoid tubercle (long) & coracoid process of scapula (short)',
    insertion: 'Radial tuberosity and bicipital aponeurosis',
    accentColor: '#3b82f6', // Blue-500
    glowColor: '#60a5fa',
    description: 'The anterior arm flexor responsible for curling power and forearm supination, creating the iconic arm peak.',
    meshIds: ['muscle_bicep_left', 'muscle_bicep_right'],
    exercises: [
      {
        id: 'incline-dumbbell-curl',
        name: 'Incline Dumbbell Curl (45°)',
        equipment: 'Dumbbell',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Biceps Long Head (Peak)',
        description: 'Places the long head of the bicep under maximum stretch due to shoulder hyperextension.',
        stepByStep: [
          'Sit back on an incline bench angled to 45° with arms hanging straight down.',
          'Keep elbows pinned directly under shoulders and avoid letting them swing forward.',
          'Curl weights upward while supinating (rotating palms up and slightly outward).',
          'Squeeze hard at top peak, then lower under a slow 3-second negative to full extension.'
        ],
        formTips: ['Full extension at bottom produces maximum hypertrophy via stretch-mediated muscle growth.'],
        commonMistakes: ['Letting elbows drift forward to reduce lever arm', 'Curling head and shoulders forward off pad'],
        primaryMuscles: ['Biceps Brachii (Long Head)'],
        secondaryMuscles: ['Brachialis', 'Brachioradialis'],
        repRange: { strength: '6-8 reps', hypertrophy: '8-12 reps', endurance: '12-15 reps' },
        tempo: '3-1-1-1',
        restSeconds: 75
      },
      {
        id: 'ez-bar-preacher-curl',
        name: 'EZ-Bar Preacher Curl',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        type: 'Isolation',
        targetSubregion: 'Short Head & Brachialis',
        description: 'Strict isolation locking upper arm against preacher bench to eliminate momentum entirely.',
        stepByStep: [
          'Position armpits securely over crest of preacher bench pad with triceps resting flat.',
          'Grip inner angled knurling of EZ-bar with an underhand grip.',
          'Lower bar smoothly until arms are almost fully extended (stop 5° before lockout to preserve tension).',
          'Contract biceps to curl bar upwards to perpendicular position.'
        ],
        formTips: ['Do not let hips lift off seat during concentric phase.'],
        commonMistakes: ['Hyperextending and snapping elbow joints at bottom under heavy loads'],
        primaryMuscles: ['Biceps Brachii (Short Head)', 'Brachialis'],
        secondaryMuscles: ['Pronator Teres'],
        repRange: { strength: '6-8 reps', hypertrophy: '8-12 reps', endurance: '12-16 reps' },
        tempo: '3-0-1-1',
        restSeconds: 75
      },
      {
        id: 'hammer-curls',
        name: 'Standing Neutral Grip Hammer Curl',
        equipment: 'Dumbbell',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Brachialis & Brachioradialis',
        description: 'Neutral grip shifts mechanical advantage onto the deep brachialis muscle, expanding arm girth from beneath.',
        stepByStep: [
          'Stand tall with dumbbells held at sides, palms facing each other (neutral grip).',
          'Keep upper arms stationary and elbows tucked.',
          'Curl dumbbells upward while maintaining strict neutral palm orientation.',
          'Pause and squeeze at peak before controlling the eccentric drop.'
        ],
        formTips: ['Imagine driving thumbs towards anterior delts.'],
        commonMistakes: ['Swinging torso or using hip thrust for the first 3 inches'],
        primaryMuscles: ['Brachialis', 'Brachioradialis'],
        secondaryMuscles: ['Biceps Brachii'],
        repRange: { strength: '6-8 reps', hypertrophy: '8-12 reps', endurance: '12-15 reps' },
        tempo: '2-1-1-0',
        restSeconds: 60
      }
    ]
  },

  triceps: {
    id: 'triceps',
    name: 'Triceps Brachii',
    latinName: 'Triceps Brachii (Lateral, Medial, Long Heads)',
    region: 'arms',
    subregion: 'Long Head, Lateral Head (Horseshoe), & Medial Head',
    view: 'back',
    actions: ['Elbow extension', 'Shoulder extension and adduction (long head)'],
    origin: 'Infraglenoid tubercle of scapula (long) & posterior humerus (lateral/medial)',
    insertion: 'Olecranon process of ulna',
    accentColor: '#06b6d4', // Cyan-500
    glowColor: '#22d3ee',
    description: 'Comprises approximately 65% of upper arm mass, responsible for explosive elbow lockout and pressing stability.',
    meshIds: ['muscle_tricep_left', 'muscle_tricep_right'],
    exercises: [
      {
        id: 'overhead-cable-extension',
        name: 'Overhead Rope Cable Triceps Extension',
        equipment: 'Cable',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Long Head (Maximum Stretch)',
        description: 'Places long head under deep stretch across the shoulder joint for superior stretch-induced hypertrophy.',
        stepByStep: [
          'Attach rope to pulley at hip or chest height. Turn around facing away with rope behind neck.',
          'Take a lunge stance with elbows bent and pointing forward high beside head.',
          'Extend elbows forward and outward, spreading rope ends apart at full lockout.',
          'Lower rope slowly back behind head until biceps and forearms make contact.'
        ],
        formTips: ['Keep elbows pinned in space; do not allow them to flare wide or drift up and down.'],
        commonMistakes: ['Arching lower back under load', 'Failing to achieve full stretch behind neck'],
        primaryMuscles: ['Triceps Brachii (Long Head)'],
        secondaryMuscles: ['Anconeus', 'Triceps Brachii (Lateral/Medial)'],
        repRange: { strength: '8-10 reps', hypertrophy: '10-15 reps', endurance: '15-20 reps' },
        tempo: '3-1-1-1',
        restSeconds: 60
      },
      {
        id: 'skull-crushers',
        name: 'Lying Barbell Skull Crusher (Lying Triceps Ext)',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        type: 'Isolation',
        targetSubregion: 'Lateral & Medial Heads',
        description: 'Classic mass-builder with EZ bar providing high mechanical tension at 90° elbow flexion.',
        stepByStep: [
          'Lie flat on bench holding EZ bar with narrow overhand grip over chest.',
          'Tilt arms back 10-15° behind vertical toward head so tension remains on triceps.',
          'Hinge strictly at elbows to lower bar toward crown of head or just behind bench edge.',
          'Forcefully extend elbows back to the 10° starting tilt without letting arms drift forward.'
        ],
        formTips: ['Tucking elbows slightly inward protects the elbow joint connective tissues.'],
        commonMistakes: ['Flaring elbows out sideways like chicken wings', 'Bringing bar straight down to forehead risking impact'],
        primaryMuscles: ['Triceps Brachii (All Heads)'],
        secondaryMuscles: ['Anconeus', 'Wrist Extensors'],
        repRange: { strength: '6-8 reps', hypertrophy: '8-12 reps', endurance: '12-15 reps' },
        tempo: '3-1-1-0',
        restSeconds: 75
      },
      {
        id: 'cable-pushdown',
        name: 'Straight Bar Cable Triceps Pushdown',
        equipment: 'Cable',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Lateral & Medial Heads (Horseshoe)',
        description: 'Constant resistance profile with intense peak contraction at full elbow extension.',
        stepByStep: [
          'Set high pulley with straight or angled V-bar.',
          'Pin elbows securely against rib cage with upper torso tilted slightly forward.',
          'Push bar down towards thighs until elbows lock out completely.',
          'Control bar on return up to chest height (approx 90° elbow bend) before next rep.'
        ],
        formTips: ['Keep wrists locked straight; do not let bar roll into fingertips.'],
        commonMistakes: ['Allowing elbows to drift forward and up into armpits on every rep'],
        primaryMuscles: ['Triceps Brachii (Lateral Head)'],
        secondaryMuscles: ['Triceps Brachii (Medial Head)'],
        repRange: { strength: '8-10 reps', hypertrophy: '10-15 reps', endurance: '15-20 reps' },
        tempo: '2-1-1-1',
        restSeconds: 60
      }
    ]
  },

  forearms: {
    id: 'forearms',
    name: 'Forearms & Grip',
    latinName: 'Brachioradialis, Flexor & Extensor Carpi',
    region: 'arms',
    subregion: 'Wrist Flexors, Extensors & Brachioradialis',
    view: 'both',
    actions: ['Wrist flexion and extension', 'Grip crushing & support', 'Elbow flexion with pronation'],
    origin: 'Lateral & medial epicondyles of humerus, radius, and ulna',
    insertion: 'Carpals, metacarpals, and phalanges',
    accentColor: '#14b8a6', // Teal-500
    glowColor: '#2dd4bf',
    description: 'Vital for crushing grip strength, wrist joint integrity, and stabilizing heavy pulling movements.',
    meshIds: ['muscle_forearm_left', 'muscle_forearm_right'],
    exercises: [
      {
        id: 'dead-hang',
        name: 'Active Pull-Up Bar Dead Hang',
        equipment: 'Bodyweight',
        difficulty: 'Beginner',
        type: 'Compound',
        targetSubregion: 'Deep Finger Flexors & Grip Endurance',
        description: 'Isometric decompression of spine and high-capacity forearm and grip conditioning.',
        stepByStep: [
          'Grip pull-up bar slightly wider than shoulder width with full overhand grip.',
          'Hang with arms straight, keeping shoulders packed slightly away from ears.',
          'Breathe deeply and hold for prescribed target duration (e.g. 30-60 seconds).'
        ],
        formTips: ['Keep core engaged rather than dangling limp.'],
        commonMistakes: ['Shrugging shoulders into neck'],
        primaryMuscles: ['Flexor Digitorum Profundus & Superficialis'],
        secondaryMuscles: ['Brachioradialis', 'Latissimus Dorsi (passive stretch)'],
        repRange: { strength: '20-30s (weighted)', hypertrophy: '45-60s', endurance: '60-90s' },
        tempo: 'Static Hold',
        restSeconds: 60
      },
      {
        id: 'wrist-curls',
        name: 'Seated Dumbbell Wrist Curl & Extension Superset',
        equipment: 'Dumbbell',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Wrist Flexors & Extensors',
        description: 'Complete forearm girth developer working both anterior and posterior muscle compartments.',
        stepByStep: [
          'Rest forearms along thighs with wrists hanging just over knees.',
          'For flexors: Hold dumbbells palms-up, lower fingers to roll weight down, curl wrists upward.',
          'For extensors: Flip palms-down and reverse curl wrists toward ceiling.'
        ],
        formTips: ['Perform with controlled tempo to protect wrist cartilage.'],
        commonMistakes: ['Bouncing weights explosively'],
        primaryMuscles: ['Flexor Carpi Radialis & Ulnaris', 'Extensor Carpi Radialis'],
        secondaryMuscles: ['Palmaris Longus'],
        repRange: { strength: '10-12 reps', hypertrophy: '15-20 reps', endurance: '20-25 reps' },
        tempo: '2-1-2-1',
        restSeconds: 60
      }
    ]
  },

  lats: {
    id: 'lats',
    name: 'Latissimus Dorsi (Lats)',
    latinName: 'Latissimus Dorsi',
    region: 'back',
    subregion: 'Thoracolumbar & Iliac Lat Fibers (V-Taper)',
    view: 'back',
    actions: ['Shoulder adduction', 'Shoulder extension', 'Internal rotation of arm'],
    origin: 'Spinous processes of T7-L5, thoracolumbar fascia, and iliac crest',
    insertion: 'Floor of intertubercular groove of humerus',
    accentColor: '#8b5cf6', // Violet-500
    glowColor: '#a78bfa',
    description: 'The largest muscle of the upper body, generating the broad V-taper physique and powerful pulling capability.',
    meshIds: ['muscle_lat_left', 'muscle_lat_right'],
    exercises: [
      {
        id: 'pull-ups',
        name: 'Strict Overhand Pull-Ups',
        equipment: 'Bodyweight',
        difficulty: 'Intermediate',
        type: 'Compound',
        targetSubregion: 'Upper & Outer Lat Sweep',
        description: 'The quintessential vertical pulling test of relative strength and back width development.',
        stepByStep: [
          'Grip pull-up bar with overhand grip slightly wider than shoulder width.',
          'Hang at full stretch, depress shoulder blades downward before initiating pull.',
          'Drive elbows straight down towards pockets, pulling chest up to touch bar.',
          'Lower smoothly to complete dead hang under 3-second negative.'
        ],
        formTips: ['Focus on pulling your elbows to the floor rather than pulling with your hands.'],
        commonMistakes: ['Kipping with legs and hips', 'Cutting range of motion short at bottom'],
        primaryMuscles: ['Latissimus Dorsi'],
        secondaryMuscles: ['Teres Major', 'Biceps Brachii', 'Lower Trapezius'],
        repRange: { strength: '3-6 reps (weighted)', hypertrophy: '6-12 reps', endurance: '12-20 reps' },
        tempo: '3-1-1-1',
        restSeconds: 120
      },
      {
        id: 'single-arm-dumbbell-row',
        name: 'Chest-Supported Single Arm Dumbbell Row',
        equipment: 'Dumbbell',
        difficulty: 'Beginner',
        type: 'Compound',
        targetSubregion: 'Lower Latissimus Dorsi & Thickness',
        description: 'Unilateral free-weight row eliminating lower back strain while optimizing lat line of pull.',
        stepByStep: [
          'Rest one knee and hand on flat bench or brace on incline bench.',
          'Hold dumbbell with neutral grip, arm hanging straight down with lat stretched.',
          'Row dumbbell towards your hip crest, driving elbow straight back along torso.',
          'Squeeze lat hard at top without rotating torso, then lower to full stretch.'
        ],
        formTips: ['Keep forearm perpendicular to floor; do not curl dumbbell to chest.'],
        commonMistakes: ['Twisting spine excessively at top to yank weight higher', 'Pulling elbow too high above back creating shoulder impingement'],
        primaryMuscles: ['Latissimus Dorsi', 'Teres Major'],
        secondaryMuscles: ['Rhomboids', 'Posterior Deltoid', 'Biceps'],
        repRange: { strength: '6-8 reps', hypertrophy: '8-12 reps', endurance: '12-15 reps' },
        tempo: '2-1-1-1',
        restSeconds: 90
      },
      {
        id: 'lat-pulldown',
        name: 'Neutral Grip Lat Pulldown',
        equipment: 'Cable',
        difficulty: 'Beginner',
        type: 'Compound',
        targetSubregion: 'Lats & Teres Major',
        description: 'Controlled vertical pulling with stabilized thigh pad for focused muscular mind-muscle connection.',
        stepByStep: [
          'Adjust thigh pad firmly. Grip attachment with palms facing or semi-pronated.',
          'Lean back 10-15° with proud chest and braced core.',
          'Pull handle down to upper sternum, leading with elbows driving down and back.',
          'Control return to full overhead stretch at top.'
        ],
        formTips: ['Never pull cable down behind neck; pull to clavicle/upper sternum only.'],
        commonMistakes: ['Swinging torso back and forth like a rowing machine'],
        primaryMuscles: ['Latissimus Dorsi'],
        secondaryMuscles: ['Biceps Brachii', 'Brachialis', 'Rhomboids'],
        repRange: { strength: '6-8 reps', hypertrophy: '8-12 reps', endurance: '12-15 reps' },
        tempo: '3-1-1-1',
        restSeconds: 75
      }
    ]
  },

  trapezius: {
    id: 'trapezius',
    name: 'Upper Back & Trapezius',
    latinName: 'Trapezius (Upper, Middle, Lower) & Rhomboids',
    region: 'back',
    subregion: 'Upper Traps (Neck/Shoulder), Mid/Lower Traps & Rhomboids',
    view: 'back',
    actions: ['Scapular elevation (upper)', 'Scapular retraction (mid)', 'Scapular depression (lower)'],
    origin: 'Occipital bone, ligamentum nuchae, and spinous processes of C7-T12',
    insertion: 'Lateral third of clavicle, acromion, and spine of scapula',
    accentColor: '#ec4899', // Pink-500
    glowColor: '#f472b6',
    description: 'Diamond-shaped kite muscle framing the neck, upper back, and shoulder blades, crucial for posture and scapular stability.',
    meshIds: ['muscle_trap_upper_left', 'muscle_trap_upper_right', 'muscle_trap_mid_left', 'muscle_trap_mid_right'],
    exercises: [
      {
        id: 'barbell-shrug',
        name: 'Dumbbell or Barbell Trap Shrug',
        equipment: 'Dumbbell',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Upper Trapezius',
        description: 'Direct scapular elevation under heavy vertical load to build dense upper trap collars.',
        stepByStep: [
          'Hold weights at sides with arms straight, chest up, and shoulders back.',
          'Elevate shoulders straight up towards ears as high as humanly possible.',
          'Hold peak contraction for a strict 2-second isometric squeeze.',
          'Lower smoothly to deep stretch without rolling shoulders.'
        ],
        formTips: ['Never roll shoulders in circular circles (causes acromial wear with zero muscular benefit).'],
        commonMistakes: ['Rolling shoulders forward or backward', 'Bending elbows and curling weight'],
        primaryMuscles: ['Upper Trapezius', 'Levator Scapulae'],
        secondaryMuscles: ['Forearms / Grip'],
        repRange: { strength: '6-8 reps', hypertrophy: '10-15 reps', endurance: '15-20 reps' },
        tempo: '2-2-1-0',
        restSeconds: 75
      },
      {
        id: 'barbell-row',
        name: 'Bent-Over Barbell Row (Pendlay Style)',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        type: 'Compound',
        targetSubregion: 'Mid Trapezius & Rhomboids (Back Thickness)',
        description: 'Explosive back builder pulling barbell from floor to lower ribcage with rigid hip hinge.',
        stepByStep: [
          'Stand with feet hip-width, bend at hips until torso is parallel or near 45° to floor.',
          'Grip bar with overhand grip just outside knees.',
          'Brace core, retract scapulae, and pull bar forcefully to touch lower ribs/upper abdomen.',
          'Lower under control to floor or just below knee level.'
        ],
        formTips: ['Keep lower back neutral and flat; imagine spreading floor with feet for stability.'],
        commonMistakes: ['Rounding lumbar spine under load', 'Standing more and more upright on each rep'],
        primaryMuscles: ['Mid & Lower Trapezius', 'Rhomboids'],
        secondaryMuscles: ['Latissimus Dorsi', 'Erector Spinae', 'Biceps'],
        repRange: { strength: '4-6 reps', hypertrophy: '6-10 reps', endurance: '10-12 reps' },
        tempo: '2-1-1-0',
        restSeconds: 120
      }
    ]
  },

  lower_back: {
    id: 'lower_back',
    name: 'Lower Back (Erector Spinae)',
    latinName: 'Erector Spinae (Iliocostalis, Longissimus, Spinalis)',
    region: 'back',
    subregion: 'Lumbar Spinal Erectors',
    view: 'back',
    actions: ['Spine extension', 'Lateral flexion of spine', 'Postural isometric stabilization'],
    origin: 'Iliac crest, sacrum, and lumbar spinous processes',
    insertion: 'Ribs and transverse processes of cervical/thoracic vertebrae',
    accentColor: '#a855f7', // Purple-500
    glowColor: '#c084fc',
    description: 'Twin columns running along the spine, providing bulletproof spinal stability, hinge strength, and posture.',
    meshIds: ['muscle_erector_left', 'muscle_erector_right'],
    exercises: [
      {
        id: 'conventional-deadlift',
        name: 'Conventional Barbell Deadlift',
        equipment: 'Barbell',
        difficulty: 'Advanced',
        type: 'Compound',
        targetSubregion: 'Erector Spinae & Posterior Chain',
        description: 'The king of posterior chain exercises, loading the entire musculoskeletal system from floor to lockout.',
        stepByStep: [
          'Stand with midfoot directly under bar (approx 1 inch from shins) with feet hip-width.',
          'Hinge at hips and grip bar just outside legs with double overhand or mixed grip.',
          'Bring shins to touch bar, pull chest up, flatten back, and take slack out of bar.',
          'Drive floor away through midfoot, extending hips and knees simultaneously to stand tall.'
        ],
        formTips: ['Imagine pushing the earth away with your legs rather than pulling the bar up with arms.'],
        commonMistakes: ['Cat-backing (excessive lumbar flexion) on floor break', 'Hyperextending spine backward at top'],
        primaryMuscles: ['Erector Spinae', 'Gluteus Maximus', 'Hamstrings'],
        secondaryMuscles: ['Quadriceps', 'Trapezius', 'Latissimus Dorsi', 'Forearms'],
        repRange: { strength: '3-5 reps', hypertrophy: '5-8 reps', endurance: '8-10 reps' },
        tempo: '2-0-1-1',
        restSeconds: 180
      },
      {
        id: 'back-extension-45',
        name: '45-Degree Hyperextension',
        equipment: 'Bodyweight',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Erector Spinae Conditioning',
        description: 'Safe, scalable spinal erector strengthening with minimal axial skeletal loading.',
        stepByStep: [
          'Position pelvis against pad so hip hinge is unobstructed.',
          'Cross arms over chest and lower torso forward until deep stretch in hamstrings.',
          'Contract glutes and erectors to raise torso until spine aligns with legs (do not hyperextend).',
          'Hold top for 1 second.'
        ],
        formTips: ['Keep movement smooth; avoid jerking or whipping at the top.'],
        commonMistakes: ['Hyperextending spine backward beyond neutral line'],
        primaryMuscles: ['Erector Spinae'],
        secondaryMuscles: ['Gluteus Maximus', 'Hamstrings'],
        repRange: { strength: '8-10 reps (weighted)', hypertrophy: '12-15 reps', endurance: '15-20 reps' },
        tempo: '2-1-1-1',
        restSeconds: 60
      }
    ]
  },

  abs: {
    id: 'abs',
    name: 'Abdominals & Core',
    latinName: 'Rectus Abdominis & Transversus Abdominis',
    region: 'core',
    subregion: 'Upper & Lower Rectus Abdominis, Deep Core Wall',
    view: 'front',
    actions: ['Spinal flexion (curling ribs to pelvis)', 'Pelvic posterior tilt', 'Intra-abdominal pressure bracing'],
    origin: 'Pubic crest and symphysis',
    insertion: 'Xiphoid process and 5th-7th costal cartilages',
    accentColor: '#10b981', // Emerald-500
    glowColor: '#34d4a6',
    description: 'The segmented anatomical 6-pack and deep transversal stabilizer protecting the spine and transferring core kinetic torque.',
    meshIds: ['muscle_abs_pack1_l', 'muscle_abs_pack1_r', 'muscle_abs_pack2_l', 'muscle_abs_pack2_r', 'muscle_abs_pack3_l', 'muscle_abs_pack3_r'],
    exercises: [
      {
        id: 'hanging-leg-raise',
        name: 'Hanging Leg Raise (Toes to Bar)',
        equipment: 'Bodyweight',
        difficulty: 'Intermediate',
        type: 'Compound',
        targetSubregion: 'Lower Rectus Abdominis & Hip Flexors',
        description: 'Posterior pelvic tilt under gravity providing maximal lower abdominal recruitment without neck strain.',
        stepByStep: [
          'Hang from pull-up bar with overhand grip and shoulders packed.',
          'Roll pelvis upward by flexing lower abs, raising legs straight up toward bar.',
          'Aim to curl pelvis towards chest at top of movement, not just swing thighs.',
          'Lower legs under strict control back to starting position without swinging.'
        ],
        formTips: ['The abdominal contraction occurs when the pelvis curls upward; hip flexion alone only works hip flexors.'],
        commonMistakes: ['Swinging body back and forth using momentum', 'Only bending at the hip while keeping lower back flat'],
        primaryMuscles: ['Rectus Abdominis (Lower Fibers)'],
        secondaryMuscles: ['Iliopsoas (Hip Flexors)', 'Obliques', 'Forearms'],
        repRange: { strength: '6-8 reps', hypertrophy: '8-12 reps', endurance: '15-20 reps' },
        tempo: '3-0-1-1',
        restSeconds: 75
      },
      {
        id: 'cable-ab-crunch',
        name: 'Kneeling Cable Abdominal Crunch',
        equipment: 'Cable',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Upper & Mid Rectus Abdominis',
        description: 'Direct progressive overload for abdominal hypertrophy with matched tension curve.',
        stepByStep: [
          'Kneel in front of high cable with rope attachment held at temple level.',
          'Keep hips stationary and lock pelvis in space.',
          'Crunch down by rolling sternum toward pelvis, exhaling forcefully.',
          'Slowly uncurl spine back to upright position while maintaining tension.'
        ],
        formTips: ['Do not sit back on your heels during crunch; hips must remain fixed in space.'],
        commonMistakes: ['Hinging at hips instead of curling spine (turns it into a prayer motion)'],
        primaryMuscles: ['Rectus Abdominis (Upper Fibers)'],
        secondaryMuscles: ['Internal & External Obliques'],
        repRange: { strength: '8-10 reps', hypertrophy: '12-16 reps', endurance: '16-25 reps' },
        tempo: '2-1-1-1',
        restSeconds: 60
      },
      {
        id: 'ab-wheel-rollout',
        name: 'Ab Wheel Rollout',
        equipment: 'Bodyweight',
        difficulty: 'Advanced',
        type: 'Compound',
        targetSubregion: 'Transversus Abdominis & Full Core Wall',
        description: 'Elite anti-extension core stability exercise resisting intense gravitational spinal collapse.',
        stepByStep: [
          'Kneel on pad holding wheel handles directly under shoulders with tucked pelvis.',
          'Roll wheel forward smoothly, extending body towards floor while squeezing glutes.',
          'Reach as far forward as possible without letting lumbar spine sag.',
          'Contract abs hard to pull wheel back under shoulders to starting position.'
        ],
        formTips: ['Start with partial range of motion against a wall before attempting full floor extension.'],
        commonMistakes: ['Letting lower back arch and collapse downward (can cause spinal pinch)'],
        primaryMuscles: ['Rectus Abdominis', 'Transversus Abdominis'],
        secondaryMuscles: ['Latissimus Dorsi', 'Chest', 'Hip Flexors'],
        repRange: { strength: '5-8 reps', hypertrophy: '8-12 reps', endurance: '12-15 reps' },
        tempo: '3-1-1-0',
        restSeconds: 90
      }
    ]
  },

  obliques: {
    id: 'obliques',
    name: 'Obliques & Serratus',
    latinName: 'External & Internal Obliques, Serratus Anterior',
    region: 'core',
    subregion: 'Lateral Abdominal Wall & Boxer’s Muscle (Serratus)',
    view: 'front',
    actions: ['Torso rotation', 'Lateral flexion', 'Anti-rotation stability', 'Scapular protraction (serratus)'],
    origin: 'External surfaces of ribs 5-12',
    insertion: 'Linea alba, pubic tubercle, and anterior half of iliac crest',
    accentColor: '#059669', // Emerald-600
    glowColor: '#10b981',
    description: 'Diagonal core muscle bands providing rotational sports power, anti-rotational stability, and dynamic ribcage contours.',
    meshIds: ['muscle_oblique_left', 'muscle_oblique_right'],
    exercises: [
      {
        id: 'pallof-press',
        name: 'Standing Cable Pallof Press',
        equipment: 'Cable',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Anti-Rotational Core Stability',
        description: 'Gold standard functional anti-rotation movement building ironclad core stiffness against twisting forces.',
        stepByStep: [
          'Set cable pulley at chest height. Stand sideways to machine, holding handle with both hands at chest.',
          'Establish athletic stance with feet shoulder-width, knees slightly bent.',
          'Press handle straight out in front of chest, resisting the cable’s urge to twist your torso.',
          'Hold arms locked out for 2-3 seconds, then return hands to chest.'
        ],
        formTips: ['Keep shoulders and hips square forward like headlights throughout entire rep.'],
        commonMistakes: ['Twisting toward cable machine on the press'],
        primaryMuscles: ['Internal & External Obliques', 'Transversus Abdominis'],
        secondaryMuscles: ['Gluteus Medius', 'Shoulders'],
        repRange: { strength: '6-8 reps (with 3s holds)', hypertrophy: '10-12 reps', endurance: '15 reps' },
        tempo: '2-3-1-0',
        restSeconds: 60
      },
      {
        id: 'woodchopper',
        name: 'High-to-Low Cable Woodchopper',
        equipment: 'Cable',
        difficulty: 'Intermediate',
        type: 'Compound',
        targetSubregion: 'Dynamic Rotational Torque',
        description: 'Athletic rotational power builder translating hip and oblique torque across the torso.',
        stepByStep: [
          'Set cable high. Stand sideways, grip handle with arms extended across opposite shoulder.',
          'Rotate torso diagonally downward across body toward opposite knee, pivoting on back foot.',
          'Contract obliques hard at bottom, then return under control.'
        ],
        formTips: ['Generate rotation from hips and torso rather than pulling with arms.'],
        commonMistakes: ['Rounding back or pulling purely with arm muscles'],
        primaryMuscles: ['External Oblique', 'Internal Oblique'],
        secondaryMuscles: ['Rectus Abdominis', 'Shoulders', 'Glutes'],
        repRange: { strength: '8-10 reps/side', hypertrophy: '10-15 reps/side', endurance: '15-20 reps/side' },
        tempo: '2-1-1-1',
        restSeconds: 60
      }
    ]
  },

  glutes: {
    id: 'glutes',
    name: 'Glutes (Gluteus Maximus & Medius)',
    latinName: 'Gluteus Maximus, Medius, & Minimus',
    region: 'legs',
    subregion: 'Upper Shelf (Medius) & Main Hip Extensor (Maximus)',
    view: 'back',
    actions: ['Hip extension', 'Hip abduction', 'External hip rotation', 'Pelvic stabilization'],
    origin: 'Ilium, sacrum, and coccyx',
    insertion: 'Gluteal tuberosity of femur and iliotibial (IT) tract',
    accentColor: '#e11d48', // Rose-600
    glowColor: '#f43f5e',
    description: 'The single most powerful muscle complex in the human body, generating sprinting speed, vertical jump, and heavy hip thrusts.',
    meshIds: ['muscle_glute_left', 'muscle_glute_right'],
    exercises: [
      {
        id: 'barbell-hip-thrust',
        name: 'Barbell Hip Thrust',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        type: 'Compound',
        targetSubregion: 'Gluteus Maximus Peak Contraction',
        description: 'Supreme horizontal hip extension exercise producing maximum glute activation at end-range lockout.',
        stepByStep: [
          'Sit on floor with upper back braced against bench at shoulder-blade level, loaded barbell over hips (use pad).',
          'Feet planted hip-width, shins vertical at top of movement.',
          'Drive through heels, extending hips upward until thighs and torso form a straight horizontal table.',
          'Posteriorly tilt pelvis and squeeze glutes aggressively at top for 2 full seconds before lowering.'
        ],
        formTips: ['Keep chin tucked and eyes looking forward across knees at top to prevent lumbar hyperextension.'],
        commonMistakes: ['Arching lower back instead of driving from hips', 'Feet placed too far forward or too close'],
        primaryMuscles: ['Gluteus Maximus'],
        secondaryMuscles: ['Hamstrings', 'Adductor Magnus', 'Erector Spinae'],
        repRange: { strength: '5-8 reps', hypertrophy: '8-12 reps', endurance: '12-20 reps' },
        tempo: '2-2-1-0',
        restSeconds: 120
      },
      {
        id: 'bulgarian-split-squat',
        name: 'Deficit Bulgarian Split Squat (Glute Biased)',
        equipment: 'Dumbbell',
        difficulty: 'Advanced',
        type: 'Compound',
        targetSubregion: 'Gluteus Maximus & Medius Stretch',
        description: 'Brutal unilateral builder combining deep hip stretch with hip stabilization demands.',
        stepByStep: [
          'Stand 2-3 feet in front of bench. Rest rear instep on bench surface.',
          'Hold dumbbells at sides, hinge torso forward at 30° angle over front lead thigh.',
          'Descend until rear knee touches ground gently, driving front knee slightly forward over midfoot.',
          'Drive through front heel to return to top without standing fully upright.'
        ],
        formTips: ['Forward torso lean shifts prime mover status directly onto glutes away from quads.'],
        commonMistakes: ['Staying overly vertical (focuses load onto quad instead of glute)'],
        primaryMuscles: ['Gluteus Maximus', 'Gluteus Medius'],
        secondaryMuscles: ['Quadriceps', 'Hamstrings', 'Adductors'],
        repRange: { strength: '6-8 reps/leg', hypertrophy: '8-12 reps/leg', endurance: '12-15 reps/leg' },
        tempo: '3-1-1-0',
        restSeconds: 90
      },
      {
        id: 'cable-glute-kickback',
        name: 'Standing Cable Glute Kickback',
        equipment: 'Cable',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Gluteus Maximus (Upper Fibers)',
        description: 'Unilateral isolation isolating hip extension without knee flexion involvement.',
        stepByStep: [
          'Attach ankle strap to low cable. Face machine, hinge slightly at hips.',
          'Keep working leg straight with slight knee unlock.',
          'Kick leg back and slightly outward at 30° angle, squeezing glute at top.',
          'Return slowly under control without arching lower back.'
        ],
        formTips: ['Keep torso rigid; do not swing lower back to launch leg backward.'],
        commonMistakes: ['Excessive spinal extension to fake range of motion'],
        primaryMuscles: ['Gluteus Maximus'],
        secondaryMuscles: ['Gluteus Medius', 'Hamstrings'],
        repRange: { strength: '10-12 reps', hypertrophy: '12-16 reps', endurance: '15-25 reps' },
        tempo: '2-1-1-1',
        restSeconds: 60
      }
    ]
  },

  quads: {
    id: 'quads',
    name: 'Quadriceps',
    latinName: 'Quadriceps Femoris (Rectus Femoris, Vastus Lateralis/Medialis/Intermedius)',
    region: 'legs',
    subregion: 'Vastus Medialis (Teardrop), Lateralis (Outer Sweep) & Rectus Femoris',
    view: 'front',
    actions: ['Knee extension', 'Hip flexion (rectus femoris only)', 'Patellar stabilization'],
    origin: 'Anterior inferior iliac spine (rectus femoris) and femur shaft (vastus group)',
    insertion: 'Patella and tibial tuberosity via patellar ligament',
    accentColor: '#eab308', // Yellow-500
    glowColor: '#facc15',
    description: 'Four-headed front thigh engine powering squats, sprinting acceleration, jumping, and knee joint protection.',
    meshIds: ['muscle_quad_left', 'muscle_quad_right'],
    exercises: [
      {
        id: 'barbell-back-squat',
        name: 'Barbell Back Squat (High Bar)',
        equipment: 'Barbell',
        difficulty: 'Advanced',
        type: 'Compound',
        targetSubregion: 'Full Quadriceps Complex & Core',
        description: 'The definitive lower-body compound exercise stimulating total leg hypertrophy and neural drive.',
        stepByStep: [
          'Rest barbell across upper trapezius with proud chest and elbows pulled under bar.',
          'Stance slightly wider than shoulder-width with toes angled outward 15-30°.',
          'Inhale deep diaphragmatic breath, brace core 360°, break at knees and hips simultaneously.',
          'Descend smoothly until hip crease sinks below top of patella (parallel or deeper).',
          'Drive through entire foot to ascend explosively, keeping knees tracking over middle toes.'
        ],
        formTips: ['Keep chest up and drive knees outward against the floor as you break depth.'],
        commonMistakes: ['Knee valgus collapse (knees caving inward under load)', 'Butt wink rounding of lumbar spine at bottom'],
        primaryMuscles: ['Quadriceps (All 4 heads)'],
        secondaryMuscles: ['Gluteus Maximus', 'Adductor Magnus', 'Soleus', 'Erector Spinae'],
        repRange: { strength: '3-5 reps', hypertrophy: '6-10 reps', endurance: '10-15 reps' },
        tempo: '3-1-1-0',
        restSeconds: 150
      },
      {
        id: 'leg-press',
        name: '45-Degree Leg Press (Quad Biased)',
        equipment: 'Machine',
        difficulty: 'Beginner',
        type: 'Compound',
        targetSubregion: 'Vastus Lateralis & Medialis',
        description: 'High mechanical loading on quads without axial spinal fatigue or balance constraints.',
        stepByStep: [
          'Sit firmly in seat with back and hips glued to back pad.',
          'Place feet low and shoulder-width on footplate (low foot placement increases knee flexion).',
          'Disengage safety locks, lower sled under control until knees reach 90° angle.',
          'Press sled away through balls of feet and heels, stopping just shy of bone-on-bone knee lockout.'
        ],
        formTips: ['Never lock out knees aggressively into hyperextension at top.'],
        commonMistakes: ['Letting lower back curl off pad at bottom of descent (pelvic tuck)'],
        primaryMuscles: ['Quadriceps'],
        secondaryMuscles: ['Gluteus Maximus', 'Calves'],
        repRange: { strength: '6-8 reps', hypertrophy: '10-15 reps', endurance: '15-20 reps' },
        tempo: '3-1-1-0',
        restSeconds: 90
      },
      {
        id: 'leg-extension',
        name: 'Seated Leg Extension',
        equipment: 'Machine',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Rectus Femoris & Teardrop (Vastus Medialis)',
        description: 'True open-chain knee extension isolating quads with peak tension at terminal knee extension.',
        stepByStep: [
          'Adjust machine so knee axis aligns exactly with pivot point of machine arm.',
          'Pad rests comfortably across lower shins just above ankles.',
          'Grip side handles tightly to anchor hips down into seat.',
          'Extend legs upward to horizontal, squeezing quads forcefully for 1 second at top.',
          'Lower smoothly over 3 seconds.'
        ],
        formTips: ['Squeeze thighs hard at peak contraction where squats have minimal quad tension.'],
        commonMistakes: ['Kicking weight up using hip jerk and slamming weight stack'],
        primaryMuscles: ['Quadriceps Femoris (Rectus Femoris emphasis)'],
        secondaryMuscles: ['Articularis Genu'],
        repRange: { strength: '8-10 reps', hypertrophy: '10-15 reps', endurance: '15-25 reps' },
        tempo: '3-1-1-1',
        restSeconds: 60
      }
    ]
  },

  hamstrings: {
    id: 'hamstrings',
    name: 'Hamstrings',
    latinName: 'Biceps Femoris, Semitendinosus, & Semimembranosus',
    region: 'legs',
    subregion: 'Lateral (Biceps Femoris) & Medial (Semi Group) Heads',
    view: 'back',
    actions: ['Knee flexion', 'Hip extension', 'Knee rotation (internal/external)'],
    origin: 'Ischial tuberosity (sit bones) and linea aspera of femur',
    insertion: 'Head of fibula and medial condyle of tibia',
    accentColor: '#f59e0b', // Amber-500
    glowColor: '#fbbf24',
    description: 'The posterior thigh muscular sling driving knee flexion, sprinting deceleration, and heavy hinge pull stability.',
    meshIds: ['muscle_hamstring_left', 'muscle_hamstring_right'],
    exercises: [
      {
        id: 'romanian-deadlift',
        name: 'Barbell Romanian Deadlift (RDL)',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        type: 'Compound',
        targetSubregion: 'Hamstrings Hip-Extension & Proximal Fibers',
        description: 'Supreme eccentric hamstring developer utilizing hip hinge for massive stretch-mediated hypertrophy.',
        stepByStep: [
          'Stand tall holding barbell with overhand grip at thighs, feet hip-width.',
          'Soft bend in knees (15-20° unlock), maintain this angle throughout.',
          'Push hips back horizontally as if trying to touch wall behind you with glutes.',
          'Lower bar down shins until deep stretch in hamstrings is felt (usually mid-shin).',
          'Drive hips forward to return to standing, contracting glutes and hamstrings.'
        ],
        formTips: ['Keep bar glued against legs throughout; do not let it drift forward away from shins.'],
        commonMistakes: ['Bending knees like a squat (removes hamstring tension)', 'Rounding lumbar spine'],
        primaryMuscles: ['Hamstrings (Biceps Femoris & Semitendinosus)'],
        secondaryMuscles: ['Gluteus Maximus', 'Erector Spinae', 'Forearms'],
        repRange: { strength: '5-8 reps', hypertrophy: '8-12 reps', endurance: '12-15 reps' },
        tempo: '3-1-1-0',
        restSeconds: 120
      },
      {
        id: 'seated-leg-curl',
        name: 'Seated Hamstring Leg Curl',
        equipment: 'Machine',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Knee-Flexion Hamstring Muscle Bellies',
        description: 'Places hamstrings under hip flexion (pre-stretched position) producing superior hypertrophy to lying curls.',
        stepByStep: [
          'Sit in machine with knees aligned with machine pivot axis.',
          'Lock thigh pad securely down to prevent hips from lifting.',
          'Curl heels down and back under thighs until full contraction.',
          'Hold 1 second, then resist return upward over 3 controlled seconds.'
        ],
        formTips: ['Dorsiflex ankles (point toes up towards shins) to amplify hamstring motor unit recruitment.'],
        commonMistakes: ['Letting weight stack slam down between reps'],
        primaryMuscles: ['Biceps Femoris', 'Semitendinosus', 'Semimembranosus'],
        secondaryMuscles: ['Gastrocnemius (Calves)'],
        repRange: { strength: '6-8 reps', hypertrophy: '10-15 reps', endurance: '15-20 reps' },
        tempo: '3-1-1-1',
        restSeconds: 75
      }
    ]
  },

  calves: {
    id: 'calves',
    name: 'Calves (Gastrocnemius & Soleus)',
    latinName: 'Gastrocnemius & Soleus',
    region: 'legs',
    subregion: 'Gastrocnemius (Diamond Bellies) & Soleus (Deep Endurance)',
    view: 'back',
    actions: ['Plantarflexion (pointing toes down)', 'Knee flexion assistance (gastrocnemius)'],
    origin: 'Femoral condyles (gastroc) & posterior tibia/fibula (soleus)',
    insertion: 'Calcaneus (heel bone) via Achilles tendon',
    accentColor: '#10b981', // Emerald-500
    glowColor: '#34d399',
    description: 'The dense shock absorbers of the lower leg, supporting running recoil, ankle stabilization, and plantarflexion power.',
    meshIds: ['muscle_calf_left', 'muscle_calf_right'],
    exercises: [
      {
        id: 'standing-calf-raise',
        name: 'Standing Machine Calf Raise',
        equipment: 'Machine',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Gastrocnemius (Upper Diamond)',
        description: 'Straight knee orientation places gastrocnemius under maximum mechanical stretch and load.',
        stepByStep: [
          'Place balls of feet on block with heels hanging off edge. Rest shoulder pads on shoulders.',
          'Keep knees straight with micro-unlock (do not bend knees during rep).',
          'Lower heels down until full deep stretch across Achilles and calf muscle.',
          'Pause 2 seconds in bottom stretch to eliminate Achilles tendon elastic spring recoil.',
          'Drive up onto big toes to peak plantarflexion and hold 1 second.'
        ],
        formTips: ['The 2-second dead pause at bottom is essential so the calf muscles—not the Achilles tendon—do the work.'],
        commonMistakes: ['Bouncing rapidly up and down like a pogo stick with zero muscle hypertrophy stimulus'],
        primaryMuscles: ['Gastrocnemius (Medial & Lateral heads)'],
        secondaryMuscles: ['Soleus', 'Plantaris'],
        repRange: { strength: '8-10 reps', hypertrophy: '10-15 reps', endurance: '15-25 reps' },
        tempo: '2-2-1-1',
        restSeconds: 60
      },
      {
        id: 'seated-calf-raise',
        name: 'Seated Calf Raise',
        equipment: 'Machine',
        difficulty: 'Beginner',
        type: 'Isolation',
        targetSubregion: 'Soleus (Deep Postural Muscle)',
        description: 'Bent knee position (90°) slackens the gastrocnemius, funneling 100% of load directly into the slow-twitch soleus.',
        stepByStep: [
          'Sit with thighs anchored under padded bar. Balls of feet on lower platform.',
          'Lower heels deeply below platform level to complete stretch.',
          'Raise heels as high as possible, squeezing soleus at apex.'
        ],
        formTips: ['Perform high rep ranges with slow eccentrics as soleus is up to 80% slow-twitch fibers.'],
        commonMistakes: ['Using momentum or cutting bottom stretch range'],
        primaryMuscles: ['Soleus'],
        secondaryMuscles: ['Gastrocnemius (minimal)'],
        repRange: { strength: '10-12 reps', hypertrophy: '15-20 reps', endurance: '20-30 reps' },
        tempo: '3-1-1-1',
        restSeconds: 60
      }
    ]
  }
};

export const BODY_SPLIT_PRESETS = [
  { id: 'all', label: 'Full Body', muscleIds: ['chest', 'deltoids', 'biceps', 'triceps', 'forearms', 'lats', 'traps', 'lower_back', 'abs', 'obliques', 'glutes', 'quads', 'hamstrings', 'calves'] },
  { id: 'push', label: 'Push (Chest / Delts / Triceps)', muscleIds: ['chest', 'deltoids', 'triceps'] },
  { id: 'pull', label: 'Pull (Back / Biceps / Rear Delts)', muscleIds: ['lats', 'traps', 'lower_back', 'biceps', 'forearms'] },
  { id: 'legs', label: 'Legs & Glutes', muscleIds: ['quads', 'hamstrings', 'glutes', 'calves'] },
  { id: 'core', label: 'Core & Stabilizers', muscleIds: ['abs', 'obliques', 'lower_back'] },
  { id: 'upper', label: 'Upper Body', muscleIds: ['chest', 'deltoids', 'biceps', 'triceps', 'lats', 'traps'] },
];
