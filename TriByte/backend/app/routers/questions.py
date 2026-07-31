from fastapi import APIRouter, HTTPException
from supabase_client import supabase

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.get("/")
def get_questions(class_level: int):
    try:
        # The "subjects(slug)" part joins in the subject's slug via the subject_id foreign key
        res = (
            supabase.table("questions")
            .select("*, subjects(slug)")
            .eq("class_level", class_level)
            .execute()
        )

        # Flatten the nested subjects.slug into a top-level "subject" field
        # so the frontend doesn't need to know about the join structure
        questions = []
        for row in res.data:
            subject_slug = row.get("subjects", {}).get("slug") if row.get("subjects") else None
            questions.append({
                "id": row["id"],
                "subject": subject_slug,
                "question": row["question_text"],
                "options": row["options"],
                "correct": int(row["correct_answer"]),
                "explanation": row.get("explanation"),
            })

        return {"questions": questions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))