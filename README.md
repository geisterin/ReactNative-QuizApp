# 📱 React Native Quiz App

## 📌 Project Description

This is a mobile quiz application built with **React Native (Expo)**.  
The app allows users to take quizzes using questions loaded from the **Open Trivia Database API**.

Users can:
- choose a category
- choose difficulty level
- answer questions with a time limit
- see results after completing the quiz
- save and view high scores

---

## 🚀 Features

### 🧠 Quiz Functionality
- Questions loaded from **Open Trivia DB API**
- Multiple choice questions
- Category selection
- Difficulty selection (easy, medium, hard)

### ⏱ Timer
- Each question has a time limit
- Total quiz time is tracked

### 📊 Results Screen
- Number of correct answers
- Number of wrong answers
- Percentage score
- Total time spent

### 🏆 Leaderboard (High Scores)
- Top 5 results stored in SQLite
- Sorted by:
  - highest percentage
  - fastest time
- Includes:
  - player name
  - score
  - percentage
  - duration
  - category
  - difficulty
  - date & time

### 💾 SQLite Database
Stored fields:
- player name
- score
- total questions
- correct answers
- wrong answers
- percentage
- duration (seconds)
- category
- difficulty
- timestamp

---

## 🛠 Technologies Used

- React Native (Expo)
- TypeScript
- SQLite (expo-sqlite)
- Open Trivia DB API
- React Hooks (useState, useEffect)

---

## ▶️ How to Run

1. Install dependencies:
```bash
npm install