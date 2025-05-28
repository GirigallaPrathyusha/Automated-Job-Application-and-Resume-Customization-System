import requests
import time
import spacy
from supabase import create_client

# ✅ Supabase config
SUPABASE_URL = "https://cjftrualbdceboadyieg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqZnRydWFsYmRjZWJvYWR5aWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NzY0MzIsImV4cCI6MjA2MDU1MjQzMn0.c3WmjKL-y4TNAO-YtSyMUutwrzq_Un-GvrtV9UpygME"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ✅ JSearch API config
JSEARCH_API_KEY = "0402f54bc1mshaa51200e8153a83p1f8b56jsn936393477654"
HEADERS = {
    "X-RapidAPI-Key": JSEARCH_API_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}

# ✅ Load NLP model
# Make sure to install it using: python -m spacy download en_core_web_md
nlp = spacy.load("en_core_web_md")

def fetch_resume_skills():
    """Fetch all skills and user_id from resume_skills table"""
    try:
        res = supabase.table("resume_skills").select("*").execute()
        skill_map = {}
        for entry in res.data:
            skill_map[entry["resume_id"]] = {
                "skills": entry["skills"],
                "user_id": entry["user_id"]
            }
        return skill_map
    except Exception as e:
        print(f"❌ Error fetching resume skills: {e}")
        return {}

def match_skills_spacy(text, skills):
    text_doc = nlp(text.lower())
    skill_docs = [nlp(skill.lower()) for skill in skills]
    matched = set()

    for skill, skill_doc in zip(skills, skill_docs):
        if skill.lower() in text.lower():
            matched.add(skill)
            continue

        for token in text_doc:
            if token.similarity(skill_doc) > 0.85:
                matched.add(skill)
                break

        if len(skill.split()) == 1 and len(skill) <= 4:
            for token in text_doc:
                if token.text == skill.lower() and any(
                    word.lower().startswith(skill.lower()) 
                    for word in skills if word != skill
                ):
                    matched.add(skill)
                    break
    return matched

def search_jobs(skill, limit=10):
    """Search for jobs using JSearch API with LinkedIn filtering"""
    try:
        url = "https://jsearch.p.rapidapi.com/search"
        querystring = {
            "query": f"{skill} jobs on LinkedIn",
            "num_pages": "1",
            "page": "1"
        }
        
        response = requests.get(url, headers=HEADERS, params=querystring)
        response.raise_for_status()  # Raise exception for bad status codes
        
        jobs = response.json().get("data", [])
        
        # Filter for LinkedIn jobs
        linkedin_jobs = [
            job for job in jobs 
            if "linkedin.com" in job.get("job_apply_link", "").lower()
        ]
        
        # Additional filtering for quality
        filtered_jobs = []
        for job in linkedin_jobs[:limit]:
            # Skip jobs with missing critical information
            if not all([
                job.get("job_title"),
                job.get("employer_name"),
                job.get("job_description"),
                job.get("job_apply_link")
            ]):
                continue
                
            # Skip jobs with invalid apply links
            if job.get("job_apply_link", "").strip() == "#":
                continue
                
            filtered_jobs.append(job)
            
        return filtered_jobs
        
    except requests.exceptions.RequestException as e:
        print(f"⚠ API request error: {str(e)}")
        return []
    except Exception as e:
        print(f"⚠ Error searching jobs: {str(e)}")
        return []

def find_and_store_jobs():
    skill_map = fetch_resume_skills()
    total_jobs_stored = 0

    for resume_id, data in skill_map.items():
        skills = data["skills"]
        user_id = data["user_id"]
        matched_jobs = []
        matched_count = 0

        for skill in skills:
            if matched_count >= 3:
                break
                
            try:
                jobs = search_jobs(skill)
                time.sleep(1)  # Prevent API rate limit

                for job in jobs:
                    if matched_count >= 3:
                        break

                    desc = job.get("job_description", "")
                    matched = match_skills_spacy(desc, skills)
                    
                    if matched:
                        job_data = {
                            "user_id": user_id,
                            "resume_id": resume_id,
                            "title": job.get("job_title", "N/A"),
                            "company": job.get("employer_name", "N/A"),
                            "description": desc,
                            "job_link": job.get("job_apply_link"),
                            "created_at": job.get("job_posted_at_datetime_utc")
                        }
                        matched_jobs.append(job_data)
                        matched_count += 1
                        
            except Exception as e:
                print(f"⚠ Error processing skill {skill}: {str(e)}")
                continue

        if matched_jobs:
            try:
                supabase.table("jobs").insert(matched_jobs).execute()
                total_jobs_stored += len(matched_jobs)
                print(f"✅ Stored {len(matched_jobs)} LinkedIn jobs for resume ID {resume_id}")
            except Exception as e:
                print(f"❌ Error storing jobs: {e}")
        else:
            print(f"⚠ No LinkedIn jobs matched for resume ID {resume_id}")

    print(f"\n🎯 Total LinkedIn jobs stored: {total_jobs_stored}")

if __name__ == "__main__":
    find_and_store_jobs()