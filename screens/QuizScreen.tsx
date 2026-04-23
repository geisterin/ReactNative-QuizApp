import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { db, saveHighScore } from '../database/db';
import { Question } from '../types/Question';
import ResultScreen from './ResultScreen';
import HighScoresScreen from './HighScoresScreen';

const QUESTION_TIME = 20;

interface QuizQuestion extends Question {
  options: string[];
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

function prepareQuestions(data: Question[]): QuizQuestion[] {
  const withShuffledOptions = data.map((q) => ({
    ...q,
    options: shuffleArray([q.optionA, q.optionB, q.optionC]),
  }));

  return shuffleArray(withShuffledOptions);
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function QuizScreen() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progress = useRef(new Animated.Value(1)).current;

  const loadQuestions = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM questions');
      const prepared = prepareQuestions(result as Question[]);
      setQuestions(prepared);
    } catch (error) {
      console.log('Load error:', error);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    progress.stopAnimation();
  };

  const startTimer = () => {
    stopTimer();
    setTimeLeft(QUESTION_TIME);
    progress.setValue(1);

    Animated.timing(progress, {
      toValue: 0,
      duration: QUESTION_TIME * 1000,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          setTimeout(() => {
            answer('');
          }, 0);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    loadQuestions();
    return () => stopTimer();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !finished && !showHighScores) {
      startTimer();
    }
  }, [questions, index, finished, showHighScores]);

  const restartQuiz = async () => {
    stopTimer();
    await loadQuestions();
    setIndex(0);
    setScore(0);
    setFinished(false);
    setShowHighScores(false);
    setTotalTimeSpent(0);
    setTimeLeft(QUESTION_TIME);
  };

  if (questions.length === 0) {
    return <Text style={styles.loading}>Laadimine...</Text>;
  }

  if (showHighScores) {
    return <HighScoresScreen onBack={() => setShowHighScores(false)} />;
  }

  if (finished) {
    const wrong = questions.length - score;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <ResultScreen
        score={score}
        total={questions.length}
        wrong={wrong}
        percentage={percentage}
        durationSeconds={totalTimeSpent}
        onRestart={restartQuiz}
        onShowHighScores={() => setShowHighScores(true)}
      />
    );
  }

  const current = questions[index];

  const answer = async (selected: string) => {
    stopTimer();

    const usedTime = QUESTION_TIME - timeLeft;
    const safeUsedTime = usedTime < 0 ? 0 : usedTime;
    const newTotalTime = totalTimeSpent + safeUsedTime;

    setTotalTimeSpent(newTotalTime);

    let newScore = score;

    if (selected === current.correct) {
      newScore = score + 1;
    }

    if (index < questions.length - 1) {
      setScore(newScore);
      setIndex(index + 1);
    } else {
      const percentage = Math.round((newScore / questions.length) * 100);
      await saveHighScore(newScore, questions.length, percentage, newTotalTime);
      setScore(newScore);
      setFinished(true);
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>
        Question {index + 1} / {questions.length}
      </Text>

      <Text style={styles.timerText}>
        Time left: {timeLeft}s | Total: {formatTime(totalTimeSpent)}
      </Text>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>

      <Text style={styles.question}>{current.question}</Text>

      {current.options.map((option, optionIndex) => (
        <Pressable
          style={styles.answerButton}
          key={optionIndex}
          onPress={() => answer(option)}
        >
          <Text style={styles.answerText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f6fb',
  },
  loading: {
    marginTop: 60,
    marginLeft: 20,
    fontSize: 28,
  },
  counter: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#5a4b81',
  },
  timerText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#6f5aa5',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e7dffc',
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8a63d2',
    borderRadius: 999,
  },
  question: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    color: '#20173a',
  },
  answerButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#9a7ae0',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#8a63d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  answerText: {
    color: '#5f3db2',
    fontSize: 20,
    fontWeight: '600',
  },
});