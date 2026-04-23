import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('quiz.db');

export const initDB = async (): Promise<void> => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY NOT NULL,
      question TEXT,
      optionA TEXT,
      optionB TEXT,
      optionC TEXT,
      correct TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS high_scores (
      id INTEGER PRIMARY KEY NOT NULL,
      score INTEGER,
      total INTEGER,
      percentage REAL,
      duration_seconds INTEGER DEFAULT 0,
      created_at TEXT
    );
  `);

  try {
    await db.execAsync(`
      ALTER TABLE high_scores ADD COLUMN duration_seconds INTEGER DEFAULT 0;
    `);
  } catch (error) {
    // колонка уже есть — это нормально
  }
};

export const insertQuestions = async (): Promise<void> => {
  const result = await db.getAllAsync('SELECT * FROM questions');

  if (result.length === 0) {
    await db.execAsync(`
      INSERT INTO questions (question, optionA, optionB, optionC, correct) VALUES
      ('What is the capital of France?', 'Paris', 'Lyon', 'Marseille', 'Paris'),
      ('What is the capital of Germany?', 'Berlin', 'Munich', 'Cologne', 'Berlin'),
      ('What is the capital of Spain?', 'Madrid', 'Barcelona', 'Valencia', 'Madrid'),
      ('What is the capital of Italy?', 'Rome', 'Milan', 'Venice', 'Rome'),
      ('What is the capital of Estonia?', 'Tallinn', 'Tartu', 'Narva', 'Tallinn')
    `);
  }
};

export const saveHighScore = async (
  score: number,
  total: number,
  percentage: number,
  durationSeconds: number
): Promise<void> => {
  const createdAt = new Date().toLocaleString();

  await db.runAsync(
    `INSERT INTO high_scores (score, total, percentage, duration_seconds, created_at) VALUES (?, ?, ?, ?, ?)`,
    [score, total, percentage, durationSeconds, createdAt]
  );
};

export const getHighScores = async () => {
  return await db.getAllAsync(
    `SELECT * FROM high_scores ORDER BY percentage DESC, score DESC, duration_seconds ASC LIMIT 5`
  );
};