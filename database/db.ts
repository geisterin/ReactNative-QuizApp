import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('quiz_v2.db');

export const initDB = async (): Promise<void> => {
  try {
  

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS high_scores (
        id INTEGER PRIMARY KEY NOT NULL,
        player_name TEXT,
        score INTEGER,
        total INTEGER,
        correct_answers INTEGER,
        wrong_answers INTEGER,
        percentage REAL,
        duration_seconds INTEGER,
        category TEXT,
        difficulty TEXT,
        created_at TEXT
      );
    `);

   
  } catch (e) {
    console.log('DB init error:', e);
  }
};

export const saveHighScore = async (
  score: number,
  total: number,
  percentage: number,
  durationSeconds: number,
  playerName: string = 'Player',
  category: string = 'General',
  difficulty: string = 'Mixed'
): Promise<void> => {
  try {
    console.log('Saving:', {
      playerName,
      score,
      total,
      percentage,
      durationSeconds,
      category,
      difficulty,
    });

    const wrongAnswers = total - score;
    const createdAt = new Date().toLocaleString();

    await db.runAsync(
      `INSERT INTO high_scores (
        player_name,
        score,
        total,
        correct_answers,
        wrong_answers,
        percentage,
        duration_seconds,
        category,
        difficulty,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        playerName,
        score,
        total,
        score,
        wrongAnswers,
        percentage,
        durationSeconds,
        category,
        difficulty,
        createdAt,
      ]
    );

  } catch (e) {
    console.log('Save error:', e);
  }
};

export const getHighScores = async () => {
  try {
    const result = await db.getAllAsync(`
      SELECT *
      FROM high_scores
      ORDER BY percentage DESC, duration_seconds ASC
      LIMIT 5
    `);

    return result;
  } catch (e) {
    console.log('Load scores error:', e);
    return [];
  }
};