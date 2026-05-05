import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export interface QuizSettings {
  userName: string;
  categoryId: number;
  categoryName: string;
  difficulty: string;
}

interface Props {
  onStart: (settings: QuizSettings) => void;
}

const categories = [
  { id: 9, name: 'General Knowledge' },
  { id: 17, name: 'Science & Nature' },
  { id: 18, name: 'Computers' },
  { id: 23, name: 'History' },
  { id: 25, name: 'Art' },
];

const difficulties = ['easy', 'medium', 'hard'];

export default function StartScreen({ onStart }: Props) {
  const [userName, setUserName] = useState('Player');
  const [category, setCategory] = useState(categories[0]);
  const [difficulty, setDifficulty] = useState('easy');
  const [showCategories, setShowCategories] = useState(false);
  const [showDifficulties, setShowDifficulties] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz App</Text>

      <Text style={styles.label}>Player name</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Category</Text>
      <Pressable
        style={styles.select}
        onPress={() => setShowCategories(!showCategories)}
      >
        <Text style={styles.selectText}>{category.name}</Text>
      </Pressable>

      {showCategories &&
        categories.map((item) => (
          <Pressable
            key={item.id}
            style={styles.option}
            onPress={() => {
              setCategory(item);
              setShowCategories(false);
            }}
          >
            <Text style={styles.optionText}>{item.name}</Text>
          </Pressable>
        ))}

      <Text style={styles.label}>Difficulty</Text>
      <Pressable
        style={styles.select}
        onPress={() => setShowDifficulties(!showDifficulties)}
      >
        <Text style={styles.selectText}>{difficulty}</Text>
      </Pressable>

      {showDifficulties &&
        difficulties.map((item) => (
          <Pressable
            key={item}
            style={styles.option}
            onPress={() => {
              setDifficulty(item);
              setShowDifficulties(false);
            }}
          >
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}

      <Pressable
        style={styles.button}
        onPress={() =>
          onStart({
            userName: userName.trim() || 'Player',
            categoryId: category.id,
            categoryName: category.name,
            difficulty,
          })
        }
      >
        <Text style={styles.buttonText}>Start Quiz</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f7f6fb',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 34,
    color: '#20173a',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#5a4b81',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#9a7ae0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    fontSize: 18,
  },
  select: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#9a7ae0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  selectText: {
    fontSize: 18,
    color: '#20173a',
  },
  option: {
    backgroundColor: '#eee7ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  optionText: {
    fontSize: 17,
    color: '#5f3db2',
  },
  button: {
    marginTop: 26,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#9a7ae0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8a63d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#5f3db2',
    fontSize: 22,
    fontWeight: 'bold',
  },
});