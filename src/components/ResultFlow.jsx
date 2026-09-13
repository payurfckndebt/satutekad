import { useState } from 'react';
import ResultCard from './ResultCard';
import ReviewScreen from '../screens/ReviewScreen';

export default function ResultFlow({ result, onRetry, onExit }) {
  const [reviewing, setReviewing] = useState(false);

  if (reviewing && result.questions) {
    return (
      <ReviewScreen
        questions={result.questions}
        answers={result.answers}
        onBack={() => setReviewing(false)}
      />
    );
  }

  return (
    <ResultCard
      result={result}
      onRetry={onRetry}
      onExit={onExit}
      onReview={() => setReviewing(true)}
    />
  );
}
