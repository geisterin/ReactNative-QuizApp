import { useEffect, useState } from 'react';
import QuizScreen from './screens/QuizScreen';
import StartScreen, { QuizSettings } from './screens/StartScreen';
import { initDB } from './database/db';

export default function App() {
  const [settings, setSettings] = useState<QuizSettings | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();      
      } catch (error) {
        console.log('DB setup error:', error);
      }
    };

    setup();
  }, []);

  if (!settings) {
    return <StartScreen onStart={setSettings} />;
  }

  return (
    <QuizScreen
      userName={settings.userName}
      categoryId={settings.categoryId}
      categoryName={settings.categoryName}
      difficulty={settings.difficulty}
      onBackToMenu={() => setSettings(null)}
    />
  );
}