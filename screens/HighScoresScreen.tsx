import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { getHighScores } from '../database/db';

interface HighScoreItem {
  id: number;
  player_name: string;
  score: number;
  total: number;
  percentage: number;
  duration_seconds: number;
  category: string;
  difficulty: string;
  created_at: string;
}

interface Props {
  onBack: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function HighScoresScreen({ onBack }: Props) {
  const [scores, setScores] = useState<HighScoreItem[]>([]);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const result = await getHighScores();
        setScores(result as HighScoreItem[]);
      } catch (error) {
        console.log('High score load error:', error);
      }
    };

    loadScores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>

      <FlatList
        data={scores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              {index + 1}. {item.player_name || 'Player'}
            </Text>

            <Text style={styles.text}>
              Score: {item.score}/{item.total}
            </Text>

            <Text style={styles.text}>Percentage: {item.percentage}%</Text>

            <Text style={styles.text}>
              Time: {formatTime(item.duration_seconds ?? 0)}
            </Text>

            <Text style={styles.text}>
              {item.category || 'General'} • {item.difficulty || 'Mixed'}
            </Text>

            <Text style={styles.date}>{item.created_at}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No results yet</Text>}
      />

      <Pressable style={styles.button} onPress={onBack}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f7f6fb',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#20173a',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.2,
    borderRadius: 14,
    borderColor: '#c9b8f3',
    backgroundColor: '#ffffff',
    shadowColor: '#8a63d2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    color: '#2d2542',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#7f7796',
    marginTop: 8,
  },
  empty: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#2d2542',
  },
  button: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#9a7ae0',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
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