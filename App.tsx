import { useEffect } from 'react';
import QuizScreen from './screens/QuizScreen';
import { initDB, insertQuestions } from './database/db';

export default function App() {
  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        await insertQuestions();
      } catch (error) {
        console.log('DB setup error:', error);
      }
    };

    setup();
  }, []);

  return <QuizScreen />;
}