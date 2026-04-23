import { View, Text, StyleSheet, Pressable } from 'react-native';

interface Props {
  score: number;
  total: number;
  wrong: number;
  percentage: number;
  durationSeconds: number;
  onRestart: () => void;
  onShowHighScores: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function ResultScreen({
  score,
  total,
  wrong,
  percentage,
  durationSeconds,
  onRestart,
  onShowHighScores,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Finished!</Text>

      <Text style={styles.result}>Correct answers: {score}</Text>
      <Text style={styles.result}>Wrong answers: {wrong}</Text>
      <Text style={styles.result}>Total questions: {total}</Text>
      <Text style={styles.result}>Percentage: {percentage}%</Text>
      <Text style={styles.result}>Time: {formatTime(durationSeconds)}</Text>

      <Pressable style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Restart Quiz</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={onShowHighScores}>
        <Text style={styles.buttonText}>Show High Scores</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f7f6fb',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#20173a',
  },
  result: {
    fontSize: 22,
    marginBottom: 10,
    color: '#2d2542',
  },
  button: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#9a7ae0',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 14,
    alignItems: 'center',
    shadowColor: '#8a63d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#5f3db2',
    fontSize: 20,
    fontWeight: '600',
  },
});