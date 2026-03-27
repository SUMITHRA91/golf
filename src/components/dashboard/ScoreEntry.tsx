import { useEffect, useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Score {
  id: string;
  score_value: number;
  score_date: string;
  created_at: string;
}

interface ScoreEntryProps {
  userId: string;
}

export function ScoreEntry({ userId }: ScoreEntryProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadScores();
  }, [userId]);

  const loadScores = async () => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('score_date', { ascending: false })
      .limit(5);

    if (!error && data) {
      setScores(data);
    }
    setLoading(false);
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const scoreValue = parseInt(newScore);
    if (scoreValue < 1 || scoreValue > 45) {
      setError('Score must be between 1 and 45');
      return;
    }

    if (scores.length >= 5) {
      const oldestScore = scores[scores.length - 1];
      await supabase.from('scores').delete().eq('id', oldestScore.id);
    }

    const { error: insertError } = await supabase.from('scores').insert({
      user_id: userId,
      score_value: scoreValue,
      score_date: newDate,
    });

    if (!insertError) {
      setNewScore('');
      setNewDate(new Date().toISOString().split('T')[0]);
      setShowAddForm(false);
      await loadScores();
    } else {
      setError(insertError.message);
    }
  };

  const handleDeleteScore = async (id: string) => {
    const { error } = await supabase.from('scores').delete().eq('id', id);
    if (!error) {
      await loadScores();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading scores...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">My Scores</h3>
          <p className="text-gray-600 mt-1">
            Keep your latest 5 golf scores (Stableford format: 1-45)
          </p>
        </div>
        {!showAddForm && scores.length < 5 && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Score</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddScore} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Add New Score</h4>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Score (1-45)
              </label>
              <input
                type="number"
                min="1"
                max="45"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="36"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Add Score
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setError('');
                setNewScore('');
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition"
            >
              Cancel
            </button>
          </div>

          {scores.length >= 5 && (
            <p className="mt-3 text-sm text-blue-700">
              You have 5 scores. Adding a new score will replace the oldest one.
            </p>
          )}
        </form>
      )}

      <div className="space-y-3">
        {scores.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No scores yet. Add your first score to get started!</p>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Add Your First Score
              </button>
            )}
          </div>
        ) : (
          scores.map((score, index) => (
            <div
              key={score.id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">{score.score_value}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Score #{index + 1}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(score.score_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteScore(score.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Only your latest 5 scores are used for monthly draws. When you add a 6th score,
          the oldest one will be automatically removed.
        </p>
      </div>
    </div>
  );
}
