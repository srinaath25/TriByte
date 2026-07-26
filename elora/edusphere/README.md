# EduSphere — Personalized AI Learning Platform
### NEXTGEN 26'1 · Track A: Future of Education

**Building a Better Tomorrow** through adaptive, cross-subject learning for the Indian school syllabus.

---

## What is EduSphere?

EduSphere is a fully functional web-based personalized learning platform designed for students in Classes 9–12. It focuses on **Mathematics, Physics, Chemistry, and Biology** aligned with the Indian (CBSE-inspired) curriculum.

Unlike traditional learning apps, EduSphere:

1. **Diagnoses** the student’s strengths and weaknesses via a short adaptive quiz
2. **Personalizes** the learning path based on class and subject preferences (changeable anytime)
3. **Teaches weak topics using the student’s strong subjects** as reference points and analogies
4. Makes learning **fun** with XP, streaks, badges, and interactive quizzes

---

## Key Features Implemented

| Feature | Status |
|---------|--------|
| Class selection (9–12) | ✅ |
| Subject preference selection & editing | ✅ |
| Diagnostic assessment (12 questions) | ✅ |
| Strength / Weakness radar chart | ✅ |
| Cross-subject learning modules | ✅ (8 modules) |
| Gamification (XP, streaks, badges) | ✅ |
| Local progress saving (localStorage) | ✅ |
| Fully responsive modern UI | ✅ |
| Profile management | ✅ |

---

## How Cross-Subject Learning Works

Example modules:

- **Quadratic Equations through Forces** (Math ← Physics)
- **Trigonometry via Light Waves** (Math ← Physics)
- **Mole Concept through Cell Biology** (Chemistry ← Biology)
- **Acids & Bases via Digestion** (Chemistry ← Biology)
- **Forces & Motion in the Human Body** (Physics ← Biology)
- **Photosynthesis as a Chemical Reaction** (Biology ← Chemistry)
- **Percentage Composition via Nutrition** (Math ← Chemistry)
- **Cell Division & Exponential Growth** (Biology ← Math)

---

## How to Run / Demo

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
2. No installation or internet required after first load (CDN assets load once).
3. Click **“Start Learning Free”** and complete the short onboarding + diagnostic.
4. Explore the personalized dashboard and modules.

**For the live demo at the event:**  
Simply open the `index.html` file on a laptop. Everything runs client-side.

---

## Project Structure

```
edusphere/
├── index.html          # Main application (single-page app)
├── js/
│   ├── app.js          # All application logic & state
│   └── data.js         # Questions, modules, curriculum content
├── css/                # (reserved for future custom styles)
├── assets/             # (reserved for images)
└── README.md
```

---

## Technical Notes for Judges

- **Pure frontend** (HTML + Tailwind CSS + Vanilla JS + Chart.js)
- **No backend / no API keys** required — perfect for offline demonstration
- Progress is stored in `localStorage` so judges can reset via Profile → “Reset all data”
- Designed for **live testing** and clear technical explanation
- Emphasizes **implementation & functionality** over pure ideas (as required by NEXTGEN 26'1 rules)

---

## Team Notes

This project demonstrates:

- Original implementation (not a tutorial kit)
- Real problem-solving (personalized learning gap for Indian board students)
- Functional live demo capability
- Clear technical architecture that can be explained

Good luck at NEXTGEN 26'1!
