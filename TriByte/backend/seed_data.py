from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("https://lgxlpengtkaqtxixbyic.supabase.co/rest/v1/")
SUPABASE_KEY = os.getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxneGxwZW5ndGthcXR4aXhieWljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA2MzM0MSwiZXhwIjoyMTAwNjM5MzQxfQ.BMHs2XYJI69A_eTvaV6r8p1_gpT84PoQQJ6T3ZoYtuk")  # use service role for insert

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ========== QUESTIONS FROM data.js ==========
QUESTIONS_BY_CLASS = {
    9: [
        {"id": "m9-1", "subject": "math", "question": "If a quadratic equation is written as ax² + bx + c = 0, the sum of its roots is equal to:", "options": ["c/a", "-b/a", "b/a", "-c/a"], "correct": 1, "explanation": "For ax² + bx + c = 0, sum of roots = -b/a."},
        {"id": "m9-2", "subject": "math", "question": "The value of sin²θ + cos²θ is always equal to:", "options": ["0", "1", "2", "Depends on θ"], "correct": 1, "explanation": "Fundamental Pythagorean identity."},
        {"id": "m9-3", "subject": "math", "question": "In a right-angled triangle with base 3 cm and height 4 cm, the hypotenuse is:", "options": ["5 cm", "6 cm", "7 cm", "12 cm"], "correct": 0, "explanation": "Pythagoras: √(9+16)=5 cm."},
        {"id": "p9-1", "subject": "physics", "question": "Newton's second law states that Force equals:", "options": ["Mass × Velocity", "Mass × Acceleration", "Mass / Acceleration", "Acceleration / Mass"], "correct": 1, "explanation": "F = ma."},
        {"id": "p9-2", "subject": "physics", "question": "The SI unit of electric current is:", "options": ["Volt", "Ohm", "Ampere", "Watt"], "correct": 2, "explanation": "Current is measured in Amperes."},
        {"id": "p9-3", "subject": "physics", "question": "Light travels fastest in:", "options": ["Water", "Glass", "Vacuum / Air", "Diamond"], "correct": 2, "explanation": "Maximum speed in vacuum."},
        {"id": "c9-1", "subject": "chemistry", "question": "The chemical formula of water is:", "options": ["H₂O", "HO₂", "H₂O₂", "OH"], "correct": 0, "explanation": "Two hydrogen + one oxygen."},
        {"id": "c9-2", "subject": "chemistry", "question": "Which of the following is an acid?", "options": ["NaOH", "HCl", "NaCl", "KOH"], "correct": 1, "explanation": "HCl is hydrochloric acid."},
        {"id": "c9-3", "subject": "chemistry", "question": "Elements in the modern periodic table are arranged by increasing:", "options": ["Atomic mass", "Atomic number", "Neutrons", "Density"], "correct": 1, "explanation": "Based on atomic number."},
        {"id": "b9-1", "subject": "biology", "question": "The powerhouse of the cell is the:", "options": ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], "correct": 1, "explanation": "Mitochondria produce ATP."},
        {"id": "b9-2", "subject": "biology", "question": "Photosynthesis mainly occurs in the:", "options": ["Roots", "Stem", "Leaves (chloroplasts)", "Flowers"], "correct": 2, "explanation": "Chloroplasts contain chlorophyll."},
        {"id": "b9-3", "subject": "biology", "question": "DNA stands for:", "options": ["Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxyribose Nucleic Acid", "Both A and C"], "correct": 0, "explanation": "Deoxyribonucleic Acid."},
    ],
    10: [
        {"id": "m10-1", "subject": "math", "question": "Sum of roots of ax² + bx + c = 0 is:", "options": ["c/a", "-b/a", "b/a", "-c/a"], "correct": 1, "explanation": "Sum of roots = -b/a."},
        {"id": "m10-2", "subject": "math", "question": "Distance between points (2,3) and (6,6) is:", "options": ["5", "4", "√13", "3"], "correct": 0, "explanation": "√[(4)²+(3)²]=5."},
        {"id": "m10-3", "subject": "math", "question": "If tan θ = 1, θ in first quadrant is:", "options": ["30°", "45°", "60°", "90°"], "correct": 1, "explanation": "tan 45° = 1."},
        {"id": "p10-1", "subject": "physics", "question": "Resistance of a conductor is given by:", "options": ["R = V/I", "R = I/V", "R = V×I", "R = V²/I"], "correct": 0, "explanation": "Ohm's law: R = V/I."},
        {"id": "p10-2", "subject": "physics", "question": "Power of a lens is measured in:", "options": ["Watt", "Dioptre", "Joule", "Newton"], "correct": 1, "explanation": "P = 1/f (metres) → Dioptre."},
        {"id": "p10-3", "subject": "physics", "question": "Mirror used as rear-view mirror in vehicles:", "options": ["Concave", "Convex", "Plane", "None"], "correct": 1, "explanation": "Convex gives wider field of view."},
        {"id": "c10-1", "subject": "chemistry", "question": "pH of a neutral solution is:", "options": ["0", "7", "14", "1"], "correct": 1, "explanation": "pH = 7 at 25°C."},
        {"id": "c10-2", "subject": "chemistry", "question": "Gas evolved when metals react with dilute acids:", "options": ["Oxygen", "Hydrogen", "Nitrogen", "CO₂"], "correct": 1, "explanation": "Metal + acid → salt + H₂."},
        {"id": "c10-3", "subject": "chemistry", "question": "Functional group in alcohols is:", "options": ["–CHO", "–COOH", "–OH", "–CO"], "correct": 2, "explanation": "Alcohols contain –OH group."},
        {"id": "b10-1", "subject": "biology", "question": "Process by which plants prepare food:", "options": ["Respiration", "Photosynthesis", "Transpiration", "Digestion"], "correct": 1, "explanation": "Photosynthesis."},
        {"id": "b10-2", "subject": "biology", "question": "Blood vessel carrying oxygenated blood from lungs to heart:", "options": ["Pulmonary artery", "Pulmonary vein", "Aorta", "Vena cava"], "correct": 1, "explanation": "Pulmonary vein."},
        {"id": "b10-3", "subject": "biology", "question": "Basic unit of classification is:", "options": ["Genus", "Species", "Family", "Order"], "correct": 1, "explanation": "Species."},
    ],
    11: [
        {"id": "m11-1", "subject": "math", "question": "If A = {1,2,3} and B = {3,4,5}, then A ∩ B is:", "options": ["{1,2,3,4,5}", "{3}", "{1,2}", "Empty set"], "correct": 1, "explanation": "Intersection = common elements = {3}."},
        {"id": "m11-2", "subject": "math", "question": "Value of i² (i = √−1) is:", "options": ["1", "−1", "i", "−i"], "correct": 1, "explanation": "i² = −1."},
        {"id": "m11-3", "subject": "math", "question": "Number of solutions of sin x = 1/2 in [0, 2π]:", "options": ["1", "2", "3", "4"], "correct": 1, "explanation": "x = π/6 and 5π/6."},
        {"id": "p11-1", "subject": "physics", "question": "Dimensional formula of force is:", "options": ["[MLT⁻²]", "[ML²T⁻²]", "[MLT⁻¹]", "[M⁰LT⁻²]"], "correct": 0, "explanation": "F = ma → [MLT⁻²]."},
        {"id": "p11-2", "subject": "physics", "question": "Work done is zero when angle between force and displacement is:", "options": ["0°", "45°", "90°", "180°"], "correct": 2, "explanation": "W = Fs cosθ; cos90° = 0."},
        {"id": "p11-3", "subject": "physics", "question": "Acceleration due to gravity is maximum at:", "options": ["Equator", "Poles", "Centre of Earth", "Same everywhere"], "correct": 1, "explanation": "g is maximum at poles."},
        {"id": "c11-1", "subject": "chemistry", "question": "Number of moles in 22 g of CO₂ (C=12, O=16):", "options": ["0.25", "0.5", "1", "2"], "correct": 1, "explanation": "Molar mass 44 g → 22/44 = 0.5 mol."},
        {"id": "c11-2", "subject": "chemistry", "question": "Quantum number that determines shape of orbital:", "options": ["Principal (n)", "Azimuthal (l)", "Magnetic (m)", "Spin (s)"], "correct": 1, "explanation": "l determines shape (s,p,d,f)."},
        {"id": "c11-3", "subject": "chemistry", "question": "Bond angle in water molecule is approximately:", "options": ["180°", "120°", "109.5°", "104.5°"], "correct": 3, "explanation": "Due to lone-pair repulsion ≈ 104.5°."},
        {"id": "b11-1", "subject": "biology", "question": "Five-kingdom classification was proposed by:", "options": ["Linnaeus", "Whittaker", "Haeckel", "Copeland"], "correct": 1, "explanation": "R.H. Whittaker (1969)."},
        {"id": "b11-2", "subject": "biology", "question": "Which is a prokaryote?", "options": ["Amoeba", "Bacteria", "Yeast", "Chlamydomonas"], "correct": 1, "explanation": "Bacteria lack true nucleus."},
        {"id": "b11-3", "subject": "biology", "question": "Powerhouse of the cell is:", "options": ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"], "correct": 1, "explanation": "Mitochondria generate ATP."},
    ],
    12: [
        {"id": "m12-1", "subject": "math", "question": "If A is a 3×3 matrix and |A| = 5, then |adj A| is:", "options": ["5", "25", "125", "1/5"], "correct": 1, "explanation": "|adj A| = |A|ⁿ⁻¹ = 5² = 25."},
        {"id": "m12-2", "subject": "math", "question": "Degree of the differential equation (d²y/dx²)³ + (dy/dx)² + y = 0 is:", "options": ["1", "2", "3", "Not defined"], "correct": 2, "explanation": "Power of highest order derivative is 3."},
        {"id": "m12-3", "subject": "math", "question": "∫ (1/x) dx equals:", "options": ["x + C", "log|x| + C", "1/x² + C", "eˣ + C"], "correct": 1, "explanation": "Integral of 1/x is log|x| + C."},
        {"id": "p12-1", "subject": "physics", "question": "SI unit of electric flux is:", "options": ["N/C", "N·m²/C", "C/N", "V/m"], "correct": 1, "explanation": "φ = E·A → N·m²/C."},
        {"id": "p12-2", "subject": "physics", "question": "Kirchhoff's junction rule is based on conservation of:", "options": ["Energy", "Charge", "Momentum", "Mass"], "correct": 1, "explanation": "ΣI = 0 from charge conservation."},
        {"id": "p12-3", "subject": "physics", "question": "In a step-up transformer, turns in secondary are:", "options": ["Less than primary", "Equal to primary", "More than primary", "Zero"], "correct": 2, "explanation": "Ns > Np for step-up."},
        {"id": "c12-1", "subject": "chemistry", "question": "Unit of rate constant for a first-order reaction is:", "options": ["mol L⁻¹ s⁻¹", "s⁻¹", "mol⁻¹ L s⁻¹", "mol L⁻¹"], "correct": 1, "explanation": "First-order k has unit time⁻¹."},
        {"id": "c12-2", "subject": "chemistry", "question": "Which is a primary alcohol?", "options": ["CH₃CH₂OH", "(CH₃)₂CHOH", "(CH₃)₃COH", "C₆H₅OH"], "correct": 0, "explanation": "Ethanol has –OH on primary carbon."},
        {"id": "c12-3", "subject": "chemistry", "question": "Hybridization of central atom in [Ni(CN)₄]²⁻ is:", "options": ["sp³", "dsp²", "sp³d", "sp³d²"], "correct": 1, "explanation": "Square planar → dsp²."},
        {"id": "b12-1", "subject": "biology", "question": "Transfer of pollen from anther to stigma is called:", "options": ["Fertilization", "Pollination", "Germination", "Emasculation"], "correct": 1, "explanation": "Pollination."},
        {"id": "b12-2", "subject": "biology", "question": "Number of chromosomes in a human sperm cell is:", "options": ["46", "23", "44", "22"], "correct": 1, "explanation": "Gametes are haploid (23)."},
        {"id": "b12-3", "subject": "biology", "question": "Enzyme used to cut DNA at specific sites in genetic engineering:", "options": ["DNA ligase", "Restriction endonuclease", "DNA polymerase", "Helicase"], "correct": 1, "explanation": "Restriction enzymes cut at recognition sites."},
    ]
}

def seed_questions():
    # First get subject ids
    subjects = supabase.table("subjects").select("id, slug").execute().data
    subject_map = {s["slug"]: s["id"] for s in subjects}

    print("Subjects found:", subject_map)

    count = 0
    for class_level, questions in QUESTIONS_BY_CLASS.items():
        for q in questions:
            subject_id = subject_map.get(q["subject"])
            if not subject_id:
                print(f"Skipping {q['id']} - subject not found")
                continue

            row = {
                "subject_id": subject_id,
                "class_level": class_level,
                "question_text": q["question"],
                "options": q["options"],
                "correct_answer": str(q["correct"]),
                "explanation": q.get("explanation"),
                "difficulty": "medium",
                "question_type": "mcq"
            }

            try:
                supabase.table("questions").insert(row).execute()
                count += 1
                print(f"Inserted: {q['id']}")
            except Exception as e:
                print(f"Error inserting {q['id']}: {e}")

    print(f"\nTotal questions inserted: {count}")

if __name__ == "__main__":
    print("Starting seed...")
    seed_questions()
    print("Done!")
