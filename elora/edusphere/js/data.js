// EduSphere - Curriculum Data & Content
// Tailored for Indian school syllabus (CBSE-inspired) Classes 9-12

const SUBJECTS = {
  math: {
    id: 'math',
    name: 'Mathematics',
    icon: 'fa-square-root-alt',
    color: 'violet',
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    border: 'border-violet-300'
  },
  physics: {
    id: 'physics',
    name: 'Physics',
    icon: 'fa-atom',
    color: 'blue',
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-300'
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'fa-flask',
    color: 'emerald',
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    border: 'border-emerald-300'
  },
  biology: {
    id: 'biology',
    name: 'Biology',
    icon: 'fa-dna',
    color: 'amber',
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    border: 'border-amber-300'
  }
};

// ========== CLASS-SPECIFIC DIAGNOSTIC QUESTIONS ==========

const QUESTIONS_BY_CLASS = {
  9: [
    { id: 'm9-1', subject: 'math', question: 'If a quadratic equation is written as ax² + bx + c = 0, the sum of its roots is equal to:', options: ['c/a', '-b/a', 'b/a', '-c/a'], correct: 1, explanation: 'For ax² + bx + c = 0, sum of roots = -b/a.' },
    { id: 'm9-2', subject: 'math', question: 'The value of sin²θ + cos²θ is always equal to:', options: ['0', '1', '2', 'Depends on θ'], correct: 1, explanation: 'Fundamental Pythagorean identity.' },
    { id: 'm9-3', subject: 'math', question: 'In a right-angled triangle with base 3 cm and height 4 cm, the hypotenuse is:', options: ['5 cm', '6 cm', '7 cm', '12 cm'], correct: 0, explanation: 'Pythagoras: √(9+16)=5 cm.' },
    { id: 'p9-1', subject: 'physics', question: 'Newton\'s second law states that Force equals:', options: ['Mass × Velocity', 'Mass × Acceleration', 'Mass / Acceleration', 'Acceleration / Mass'], correct: 1, explanation: 'F = ma.' },
    { id: 'p9-2', subject: 'physics', question: 'The SI unit of electric current is:', options: ['Volt', 'Ohm', 'Ampere', 'Watt'], correct: 2, explanation: 'Current is measured in Amperes.' },
    { id: 'p9-3', subject: 'physics', question: 'Light travels fastest in:', options: ['Water', 'Glass', 'Vacuum / Air', 'Diamond'], correct: 2, explanation: 'Maximum speed in vacuum.' },
    { id: 'c9-1', subject: 'chemistry', question: 'The chemical formula of water is:', options: ['H₂O', 'HO₂', 'H₂O₂', 'OH'], correct: 0, explanation: 'Two hydrogen + one oxygen.' },
    { id: 'c9-2', subject: 'chemistry', question: 'Which of the following is an acid?', options: ['NaOH', 'HCl', 'NaCl', 'KOH'], correct: 1, explanation: 'HCl is hydrochloric acid.' },
    { id: 'c9-3', subject: 'chemistry', question: 'Elements in the modern periodic table are arranged by increasing:', options: ['Atomic mass', 'Atomic number', 'Neutrons', 'Density'], correct: 1, explanation: 'Based on atomic number.' },
    { id: 'b9-1', subject: 'biology', question: 'The powerhouse of the cell is the:', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], correct: 1, explanation: 'Mitochondria produce ATP.' },
    { id: 'b9-2', subject: 'biology', question: 'Photosynthesis mainly occurs in the:', options: ['Roots', 'Stem', 'Leaves (chloroplasts)', 'Flowers'], correct: 2, explanation: 'Chloroplasts contain chlorophyll.' },
    { id: 'b9-3', subject: 'biology', question: 'DNA stands for:', options: ['Deoxyribonucleic Acid', 'Diribonucleic Acid', 'Deoxyribose Nucleic Acid', 'Both A and C'], correct: 0, explanation: 'Deoxyribonucleic Acid.' }
  ],
  10: [
    { id: 'm10-1', subject: 'math', question: 'Sum of roots of ax² + bx + c = 0 is:', options: ['c/a', '-b/a', 'b/a', '-c/a'], correct: 1, explanation: 'Sum of roots = -b/a.' },
    { id: 'm10-2', subject: 'math', question: 'Distance between points (2,3) and (6,6) is:', options: ['5', '4', '√13', '3'], correct: 0, explanation: '√[(4)²+(3)²]=5.' },
    { id: 'm10-3', subject: 'math', question: 'If tan θ = 1, θ in first quadrant is:', options: ['30°', '45°', '60°', '90°'], correct: 1, explanation: 'tan 45° = 1.' },
    { id: 'p10-1', subject: 'physics', question: 'Resistance of a conductor is given by:', options: ['R = V/I', 'R = I/V', 'R = V×I', 'R = V²/I'], correct: 0, explanation: 'Ohm\'s law: R = V/I.' },
    { id: 'p10-2', subject: 'physics', question: 'Power of a lens is measured in:', options: ['Watt', 'Dioptre', 'Joule', 'Newton'], correct: 1, explanation: 'P = 1/f (metres) → Dioptre.' },
    { id: 'p10-3', subject: 'physics', question: 'Mirror used as rear-view mirror in vehicles:', options: ['Concave', 'Convex', 'Plane', 'None'], correct: 1, explanation: 'Convex gives wider field of view.' },
    { id: 'c10-1', subject: 'chemistry', question: 'pH of a neutral solution is:', options: ['0', '7', '14', '1'], correct: 1, explanation: 'pH = 7 at 25°C.' },
    { id: 'c10-2', subject: 'chemistry', question: 'Gas evolved when metals react with dilute acids:', options: ['Oxygen', 'Hydrogen', 'Nitrogen', 'CO₂'], correct: 1, explanation: 'Metal + acid → salt + H₂.' },
    { id: 'c10-3', subject: 'chemistry', question: 'Functional group in alcohols is:', options: ['–CHO', '–COOH', '–OH', '–CO'], correct: 2, explanation: 'Alcohols contain –OH group.' },
    { id: 'b10-1', subject: 'biology', question: 'Process by which plants prepare food:', options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Digestion'], correct: 1, explanation: 'Photosynthesis.' },
    { id: 'b10-2', subject: 'biology', question: 'Blood vessel carrying oxygenated blood from lungs to heart:', options: ['Pulmonary artery', 'Pulmonary vein', 'Aorta', 'Vena cava'], correct: 1, explanation: 'Pulmonary vein.' },
    { id: 'b10-3', subject: 'biology', question: 'Basic unit of classification is:', options: ['Genus', 'Species', 'Family', 'Order'], correct: 1, explanation: 'Species.' }
  ],
  11: [
    { id: 'm11-1', subject: 'math', question: 'If A = {1,2,3} and B = {3,4,5}, then A ∩ B is:', options: ['{1,2,3,4,5}', '{3}', '{1,2}', 'Empty set'], correct: 1, explanation: 'Intersection = common elements = {3}.' },
    { id: 'm11-2', subject: 'math', question: 'Value of i² (i = √−1) is:', options: ['1', '−1', 'i', '−i'], correct: 1, explanation: 'i² = −1.' },
    { id: 'm11-3', subject: 'math', question: 'Number of solutions of sin x = 1/2 in [0, 2π]:', options: ['1', '2', '3', '4'], correct: 1, explanation: 'x = π/6 and 5π/6.' },
    { id: 'p11-1', subject: 'physics', question: 'Dimensional formula of force is:', options: ['[MLT⁻²]', '[ML²T⁻²]', '[MLT⁻¹]', '[M⁰LT⁻²]'], correct: 0, explanation: 'F = ma → [MLT⁻²].' },
    { id: 'p11-2', subject: 'physics', question: 'Work done is zero when angle between force and displacement is:', options: ['0°', '45°', '90°', '180°'], correct: 2, explanation: 'W = Fs cosθ; cos90° = 0.' },
    { id: 'p11-3', subject: 'physics', question: 'Acceleration due to gravity is maximum at:', options: ['Equator', 'Poles', 'Centre of Earth', 'Same everywhere'], correct: 1, explanation: 'g is maximum at poles.' },
    { id: 'c11-1', subject: 'chemistry', question: 'Number of moles in 22 g of CO₂ (C=12, O=16):', options: ['0.25', '0.5', '1', '2'], correct: 1, explanation: 'Molar mass 44 g → 22/44 = 0.5 mol.' },
    { id: 'c11-2', subject: 'chemistry', question: 'Quantum number that determines shape of orbital:', options: ['Principal (n)', 'Azimuthal (l)', 'Magnetic (m)', 'Spin (s)'], correct: 1, explanation: 'l determines shape (s,p,d,f).' },
    { id: 'c11-3', subject: 'chemistry', question: 'Bond angle in water molecule is approximately:', options: ['180°', '120°', '109.5°', '104.5°'], correct: 3, explanation: 'Due to lone-pair repulsion ≈ 104.5°.' },
    { id: 'b11-1', subject: 'biology', question: 'Five-kingdom classification was proposed by:', options: ['Linnaeus', 'Whittaker', 'Haeckel', 'Copeland'], correct: 1, explanation: 'R.H. Whittaker (1969).' },
    { id: 'b11-2', subject: 'biology', question: 'Which is a prokaryote?', options: ['Amoeba', 'Bacteria', 'Yeast', 'Chlamydomonas'], correct: 1, explanation: 'Bacteria lack true nucleus.' },
    { id: 'b11-3', subject: 'biology', question: 'Powerhouse of the cell is:', options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Ribosome'], correct: 1, explanation: 'Mitochondria generate ATP.' }
  ],
  12: [
    { id: 'm12-1', subject: 'math', question: 'If A is a 3×3 matrix and |A| = 5, then |adj A| is:', options: ['5', '25', '125', '1/5'], correct: 1, explanation: '|adj A| = |A|ⁿ⁻¹ = 5² = 25.' },
    { id: 'm12-2', subject: 'math', question: 'Degree of the differential equation (d²y/dx²)³ + (dy/dx)² + y = 0 is:', options: ['1', '2', '3', 'Not defined'], correct: 2, explanation: 'Power of highest order derivative is 3.' },
    { id: 'm12-3', subject: 'math', question: '∫ (1/x) dx equals:', options: ['x + C', 'log|x| + C', '1/x² + C', 'eˣ + C'], correct: 1, explanation: 'Integral of 1/x is log|x| + C.' },
    { id: 'p12-1', subject: 'physics', question: 'SI unit of electric flux is:', options: ['N/C', 'N·m²/C', 'C/N', 'V/m'], correct: 1, explanation: 'φ = E·A → N·m²/C.' },
    { id: 'p12-2', subject: 'physics', question: 'Kirchhoff\'s junction rule is based on conservation of:', options: ['Energy', 'Charge', 'Momentum', 'Mass'], correct: 1, explanation: 'ΣI = 0 from charge conservation.' },
    { id: 'p12-3', subject: 'physics', question: 'In a step-up transformer, turns in secondary are:', options: ['Less than primary', 'Equal to primary', 'More than primary', 'Zero'], correct: 2, explanation: 'Ns > Np for step-up.' },
    { id: 'c12-1', subject: 'chemistry', question: 'Unit of rate constant for a first-order reaction is:', options: ['mol L⁻¹ s⁻¹', 's⁻¹', 'mol⁻¹ L s⁻¹', 'mol L⁻¹'], correct: 1, explanation: 'First-order k has unit time⁻¹.' },
    { id: 'c12-2', subject: 'chemistry', question: 'Which is a primary alcohol?', options: ['CH₃CH₂OH', '(CH₃)₂CHOH', '(CH₃)₃COH', 'C₆H₅OH'], correct: 0, explanation: 'Ethanol has –OH on primary carbon.' },
    { id: 'c12-3', subject: 'chemistry', question: 'Hybridization of central atom in [Ni(CN)₄]²⁻ is:', options: ['sp³', 'dsp²', 'sp³d', 'sp³d²'], correct: 1, explanation: 'Square planar → dsp².' },
    { id: 'b12-1', subject: 'biology', question: 'Transfer of pollen from anther to stigma is called:', options: ['Fertilization', 'Pollination', 'Germination', 'Emasculation'], correct: 1, explanation: 'Pollination.' },
    { id: 'b12-2', subject: 'biology', question: 'Number of chromosomes in a human sperm cell is:', options: ['46', '23', '44', '22'], correct: 1, explanation: 'Gametes are haploid (23).' },
    { id: 'b12-3', subject: 'biology', question: 'Enzyme used to cut DNA at specific sites in genetic engineering:', options: ['DNA ligase', 'Restriction endonuclease', 'DNA polymerase', 'Helicase'], correct: 1, explanation: 'Restriction enzymes cut at recognition sites.' }
  ]
};

// Helper
function getQuestionsForClass(cls) {
  const c = parseInt(cls);
  if (QUESTIONS_BY_CLASS[c]) return QUESTIONS_BY_CLASS[c];
  if (c >= 12) return QUESTIONS_BY_CLASS[12];
  if (c >= 11) return QUESTIONS_BY_CLASS[11];
  return QUESTIONS_BY_CLASS[10];
}

// ========== LEARNING MODULES ==========

const MODULES = [
  {
    id: 'mod-quad-force',
    title: 'Quadratic Equations through Forces',
    weakSubject: 'math',
    strongSubject: 'physics',
    topic: 'Quadratic Equations',
    difficulty: 'Medium',
    xp: 50,
    duration: '12 min',
    minClass: 9,
    description: 'See how the motion of a ball thrown upwards creates a quadratic equation — and solve it the physics way!',
    content: {
      intro: `You already understand forces and motion well. Let's use that superpower to master quadratic equations!`,
      sections: [
        { heading: 'The Physics Story', body: `Imagine you throw a ball straight up with initial velocity 20 m/s. Gravity ≈ 10 m/s².\n\nh = ut − ½gt² = 20t − 5t²\n\nThis is a quadratic: 5t² − 20t + h = 0` },
        { heading: 'Connecting to Algebra', body: `ax² + bx + c = 0\n\nHere a=5, b=−20, c=h.\nWhen h=0: 5t(t−4)=0 → t=0 or t=4 s.` },
        { heading: 'Your Turn', body: `Ball thrown at 30 m/s. Time in air?\nh=30t−5t²=0 → t(t−6)=0 → 6 seconds.` }
      ],
      quiz: { question: 'Ball thrown upward at 15 m/s (g=10). Total time in air?', options: ['1.5 s', '3 s', '4 s', '5 s'], correct: 1, explanation: '5t(t−3)=0 → t=3 s.' }
    }
  },
  {
    id: 'mod-matrix-transform',
    title: 'Matrices through Transformations',
    weakSubject: 'math',
    strongSubject: 'physics',
    topic: 'Matrices & Determinants',
    difficulty: 'Hard',
    xp: 60,
    duration: '14 min',
    minClass: 12,
    description: 'Matrices represent rotations and transformations — the same tools used in Physics simulations.',
    content: {
      intro: `If you are comfortable with vectors in Physics, matrices will feel natural.`,
      sections: [
        { heading: 'What a Matrix Does', body: `A 2×2 matrix can rotate or stretch a point (x,y).\nRotation by 90° clockwise:\n[0 1; −1 0] × [x;y] = [y; −x]` },
        { heading: 'Determinants & Area', body: `|det(A)| gives the area scaling factor. If det=0 the transformation collapses area to zero.` },
        { heading: 'Class 12 Link', body: `Solving AX=B using inverse matrices is the same linear algebra used in circuit analysis.` }
      ],
      quiz: { question: 'If A = [[2,0],[0,3]], det(A) is:', options: ['5', '6', '1', '0'], correct: 1, explanation: '2×3 − 0×0 = 6.' }
    }
  },
  {
    id: 'mod-trig-waves',
    title: 'Trigonometry via Light Waves',
    weakSubject: 'math',
    strongSubject: 'physics',
    topic: 'Trigonometric Identities',
    difficulty: 'Medium',
    xp: 45,
    duration: '10 min',
    minClass: 9,
    description: 'Light waves and interference are pure trigonometry in action.',
    content: {
      intro: `Your Physics strength with waves makes trig identities natural.`,
      sections: [
        { heading: 'Waves are Circles', body: `y = A sin(ωt). Amplitude A is like the radius of a circle.` },
        { heading: 'The Key Identity', body: `sin²θ + cos²θ = 1 because on a unit circle x² + y² = 1.` },
        { heading: 'Malus\'s Law', body: `I = I₀ cos²θ — intensity after polarizers.` }
      ],
      quiz: { question: 'If sinθ = 0.6, cos²θ is:', options: ['0.36', '0.64', '0.8', '1.0'], correct: 1, explanation: '0.36 + cos²θ = 1 → 0.64.' }
    }
  },
  {
    id: 'mod-integration-physics',
    title: 'Integration through Variable Force',
    weakSubject: 'math',
    strongSubject: 'physics',
    topic: 'Integrals',
    difficulty: 'Hard',
    xp: 60,
    duration: '15 min',
    minClass: 12,
    description: 'Work done by a variable force is the integral of F dx. Physics makes integration click.',
    content: {
      intro: `If you understand work and variable forces, integration stops feeling abstract.`,
      sections: [
        { heading: 'Constant vs Variable Force', body: `Constant force: W = F×s.\nSpring force F=−kx → W = ∫−kx dx = −½kx².` },
        { heading: 'Area under the Curve', body: `Work is the area under the F-x graph — that is the definite integral.` },
        { heading: 'Why It Matters', body: `Once you see integration as adding infinitely many small contributions, the techniques become tools for real quantities.` }
      ],
      quiz: { question: 'Work by spring force F=−kx from 0 to A is:', options: ['½kA²', '−½kA²', 'kA²', '0'], correct: 1, explanation: '∫−kx dx = −½kA².' }
    }
  },
  {
    id: 'mod-mole-bio',
    title: 'Mole Concept through Cell Biology',
    weakSubject: 'chemistry',
    strongSubject: 'biology',
    topic: 'Mole Concept',
    difficulty: 'Easy',
    xp: 40,
    duration: '8 min',
    minClass: 9,
    description: 'Use Biology intuition about quantities of molecules to master the mole.',
    content: {
      intro: `You understand cells and molecules. Let's conquer the mole.`,
      sections: [
        { heading: 'Counting the Uncountable', body: `One mole = 6.022 × 10²³ particles — a convenient packet size for atoms.` },
        { heading: 'In a Cell', body: `A cell may contain ~10¹⁰ proteins ≈ 1.7 × 10⁻¹⁴ moles.` },
        { heading: 'Molar Mass', body: `18 g water = 1 mole = 6.022×10²³ molecules.` }
      ],
      quiz: { question: 'Molecules in 2 moles of glucose:', options: ['6.022×10²³', '1.2044×10²⁴', '3.011×10²³', '12.044×10²³'], correct: 1, explanation: '2 × Avogadro = 1.2044×10²⁴.' }
    }
  },
  {
    id: 'mod-electrochem-nerve',
    title: 'Electrochemistry via Nerve Impulses',
    weakSubject: 'chemistry',
    strongSubject: 'biology',
    topic: 'Electrochemistry',
    difficulty: 'Hard',
    xp: 55,
    duration: '13 min',
    minClass: 12,
    description: 'Action potentials are living electrochemical cells. Biology unlocks the Nernst equation.',
    content: {
      intro: `Nerve impulses and membrane potential make electrochemistry intuitive.`,
      sections: [
        { heading: 'Resting Potential is a Battery', body: `Neuron resting potential ≈ −70 mV created by ion gradients — like a concentration cell.` },
        { heading: 'Nernst Equation', body: `E = (RT/nF) ln([ion]out/[ion]in). Same equation in Class 12 Chemistry.` },
        { heading: 'Action Potential', body: `Rapid change in potential is similar to a battery discharging; the Na⁺/K⁺ pump recharges it.` }
      ],
      quiz: { question: 'Nernst equation is used to calculate:', options: ['Rate of reaction', 'Electrode potential', 'pH only', 'Molar mass'], correct: 1, explanation: 'It gives electrode potential under non-standard conditions.' }
    }
  },
  {
    id: 'mod-acid-base-digest',
    title: 'Acids & Bases via Digestion',
    weakSubject: 'chemistry',
    strongSubject: 'biology',
    topic: 'Acids Bases pH',
    difficulty: 'Easy',
    xp: 40,
    duration: '9 min',
    minClass: 9,
    description: 'Your stomach is a living chemistry lab.',
    content: {
      intro: `Stomach acid knowledge turns into solid Chemistry.`,
      sections: [
        { heading: 'Stomach as Beaker', body: `Gastric juice pH 1.5–3.5 due to HCl. Kills pathogens and activates pepsin.` },
        { heading: 'pH Scale', body: `pH = −log[H⁺]. <7 acidic, =7 neutral, >7 basic.` },
        { heading: 'Antacids', body: `Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O.` }
      ],
      quiz: { question: 'A solution with pH = 3 is:', options: ['Strongly basic', 'Weakly basic', 'Neutral', 'Acidic'], correct: 3, explanation: 'pH < 7 is acidic.' }
    }
  },
  {
    id: 'mod-forces-cell',
    title: 'Forces & Motion in the Human Body',
    weakSubject: 'physics',
    strongSubject: 'biology',
    topic: 'Newton\'s Laws',
    difficulty: 'Medium',
    xp: 50,
    duration: '11 min',
    minClass: 9,
    description: 'Bones and muscles are living machines that obey Newton\'s laws.',
    content: {
      intro: `Your body is a masterpiece of Physics.`,
      sections: [
        { heading: 'First Law — Inertia', body: `Sudden stop → you lurch forward. Seatbelt provides the external force.` },
        { heading: 'Second Law', body: `F = ma. Accelerating a 2 kg mass at 3 m/s² needs at least 6 N.` },
        { heading: 'Third Law', body: `You push ground backward; ground pushes you forward.` }
      ],
      quiz: { question: 'When you push a wall, the wall:', options: ['Does nothing', 'Pushes you with equal force', 'Pushes harder', 'Pulls you'], correct: 1, explanation: 'Action-reaction are equal and opposite.' }
    }
  },
  {
    id: 'mod-photosyn-chem',
    title: 'Photosynthesis as a Chemical Reaction',
    weakSubject: 'biology',
    strongSubject: 'chemistry',
    topic: 'Photosynthesis',
    difficulty: 'Medium',
    xp: 45,
    duration: '10 min',
    minClass: 9,
    description: 'Photosynthesis is one of the most important redox reactions on Earth.',
    content: {
      intro: `See the Chemistry inside the chloroplast.`,
      sections: [
        { heading: 'Overall Equation', body: `6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Water is oxidized, CO₂ is reduced.` },
        { heading: 'Light & Dark Reactions', body: `Light reaction makes ATP & NADPH. Calvin cycle fixes CO₂.` },
        { heading: 'Why It Matters', body: `Every breath and meal ultimately comes from this reaction.` }
      ],
      quiz: { question: 'In photosynthesis which molecule is oxidized?', options: ['CO₂', 'Glucose', 'Water', 'Oxygen'], correct: 2, explanation: 'Water loses electrons in photolysis.' }
    }
  },
  {
    id: 'mod-genetics-prob',
    title: 'Mendelian Genetics through Probability',
    weakSubject: 'biology',
    strongSubject: 'math',
    topic: 'Principles of Inheritance',
    difficulty: 'Hard',
    xp: 55,
    duration: '12 min',
    minClass: 12,
    description: 'Punnett squares are just probability. Math makes genetics easy.',
    content: {
      intro: `Probability turns Mendelian ratios into simple calculations.`,
      sections: [
        { heading: 'Monohybrid Cross', body: `Aa × Aa → AA 1/4, Aa 1/2, aa 1/4 → phenotypic 3:1.` },
        { heading: 'Dihybrid Cross', body: `Independent traits: multiply probabilities. (3/4)×(3/4)=9/16.` },
        { heading: 'Why Math Matters', body: `Most genetics problems in exams are probability questions in disguise.` }
      ],
      quiz: { question: 'In a dihybrid cross, probability of genotype AABB is:', options: ['1/4', '1/8', '1/16', '9/16'], correct: 2, explanation: '(1/4)×(1/4)=1/16.' }
    }
  },
  {
    id: 'mod-cell-division-math',
    title: 'Cell Division & Exponential Growth',
    weakSubject: 'biology',
    strongSubject: 'math',
    topic: 'Mitosis & Growth',
    difficulty: 'Medium',
    xp: 45,
    duration: '10 min',
    minClass: 9,
    description: 'Cells follow mathematical growth laws.',
    content: {
      intro: `Mathematics describes how living things grow.`,
      sections: [
        { heading: 'Doubling is Exponential', body: `N = N₀ × 2ⁿ after n generations.` },
        { heading: 'Timeline', body: `After 10 hourly divisions: 2¹⁰ = 1024 cells.` },
        { heading: 'Cancer Link', body: `Uncontrolled division follows the same exponential pattern.` }
      ],
      quiz: { question: 'Starting with 1 cell, after 6 rounds of mitosis:', options: ['12', '32', '64', '128'], correct: 2, explanation: '2⁶ = 64.' }
    }
  },
  {
    id: 'mod-semiconductor-bio',
    title: 'Semiconductors & Biological Sensors',
    weakSubject: 'physics',
    strongSubject: 'biology',
    topic: 'Semiconductor Electronics',
    difficulty: 'Hard',
    xp: 55,
    duration: '12 min',
    minClass: 12,
    description: 'Modern biosensors rely on semiconductor physics.',
    content: {
      intro: `Biology of sensing + Physics of semiconductors.`,
      sections: [
        { heading: 'p-n Junction', body: `Allows current mainly in one direction — similar to selective membrane permeability.` },
        { heading: 'Medical Sensors', body: `Glucose sensors and pulse oximeters use semiconductor photodetectors.` },
        { heading: 'Class 12 Link', body: `Doping, depletion region and bias are essential for both boards and understanding medical tech.` }
      ],
      quiz: { question: 'Region around p-n junction depleted of free carriers is called:', options: ['Neutral region', 'Depletion region', 'Active region', 'Saturation region'], correct: 1, explanation: 'Depletion region contains uncovered ions.' }
    }
  }
];

const BADGES = [
  { id: 'first-step', name: 'First Step', icon: 'fa-shoe-prints', desc: 'Completed your first module' },
  { id: 'cross-thinker', name: 'Cross Thinker', icon: 'fa-project-diagram', desc: 'Used a strength to learn a weakness' },
  { id: 'quiz-master', name: 'Quiz Master', icon: 'fa-medal', desc: 'Scored 100% on a module quiz' },
  { id: 'streak-3', name: 'On Fire', icon: 'fa-fire', desc: '3-day learning streak' },
  { id: 'all-rounder', name: 'All-Rounder', icon: 'fa-star', desc: 'Completed a module in every subject' }
];
