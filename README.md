# UV-Wise

UV-Wise is a web application designed to help young generation in Australia stay safe in the sun. It provides real-time UV index updates, personalized sun protection advice, and educational resources to prevent skin cancer.

**Website:** [https://uv-wise.vercel.app/](https://uv-wise.vercel.app/)
- **API (Render):** [https://uv-wise.onrender.com](https://uv-wise.onrender.com)
- **API Docs (Swagger):** [https://uv-wise.onrender.com/docs](https://uv-wise.onrender.com/docs)

---

## Key Features

- **Real-time UV Index:** Accurate UV level tracking by city, suburb, or postcode.
- **Personalized Advice:** Tailored sunscreen (dosage/SPF) and clothing advice based on Fitzpatrick skin types.
- **Protection Timer:** Smart reminders for sunscreen reapplication every 2 hours.
- **Awareness Dashboard:** Visualization of UV trends and skin cancer statistics in Australia.

## Tech Stack

- **Frontend:** Vue.js 3 (Vite)
- **Backend:** Python (FastAPI), Uvicorn
- **Infrastructure:** Render (Backend), Vercel (Frontend)
- **Data:** OpenWeather API, Cancer Council guidelines

## Project Structure

- `/frontend`: Vue.js frontend code.
- `/backend`: Python FastAPI logic, services, and schemas.
- `/docs`: Requirement documents and API specifications.

## Running Locally

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create a `.env` file with your `OPENWEATHER_API_KEY`.
4. `uvicorn app.main:app --reload`

### Frontend
1. `cd frontend/web-app`
2. `npm install`
3. `npm run dev`

---
*Developed by Monash University FIT5120 Team TP32.*