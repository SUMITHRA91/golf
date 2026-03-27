import { useEffect, useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  is_featured: boolean;
}

interface UserCharity {
  id: string;
  charity_id: string;
  contribution_percentage: number;
  is_active: boolean;
}

interface CharitySelectionProps {
  userId: string;
}

export function CharitySelection({ userId }: CharitySelectionProps) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [userCharity, setUserCharity] = useState<UserCharity | null>(null);
  const [selectedCharityId, setSelectedCharityId] = useState<string | null>(null);
  const [contributionPercentage, setContributionPercentage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    const [charitiesRes, userCharityRes] = await Promise.all([
      supabase.from('charities').select('*').order('is_featured', { ascending: false }).order('name'),
      supabase.from('user_charities').select('*').eq('user_id', userId).eq('is_active', true).maybeSingle()
    ]);

    if (charitiesRes.data) setCharities(charitiesRes.data);
    if (userCharityRes.data) {
      setUserCharity(userCharityRes.data);
      setSelectedCharityId(userCharityRes.data.charity_id);
      setContributionPercentage(userCharityRes.data.contribution_percentage);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!selectedCharityId) {
      setMessage('Please select a charity');
      return;
    }

    setSaving(true);
    setMessage('');

    if (userCharity) {
      if (userCharity.charity_id === selectedCharityId) {
        const { error } = await supabase
          .from('user_charities')
          .update({ contribution_percentage: contributionPercentage })
          .eq('id', userCharity.id);

        if (!error) {
          setMessage('Contribution percentage updated successfully!');
          await loadData();
        }
      } else {
        await supabase.from('user_charities').update({ is_active: false }).eq('id', userCharity.id);

        const { error } = await supabase.from('user_charities').insert({
          user_id: userId,
          charity_id: selectedCharityId,
          contribution_percentage: contributionPercentage,
          is_active: true,
        });

        if (!error) {
          setMessage('Charity selection updated successfully!');
          await loadData();
        }
      }
    } else {
      const { error } = await supabase.from('user_charities').insert({
        user_id: userId,
        charity_id: selectedCharityId,
        contribution_percentage: contributionPercentage,
        is_active: true,
      });

      if (!error) {
        setMessage('Charity selected successfully!');
        await loadData();
      }
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 5000);
  };

  if (loading) {
    return <div className="text-center py-8">Loading charities...</div>;
  }

  const selectedCharity = charities.find(c => c.id === selectedCharityId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Charity Selection</h3>
        <p className="text-gray-600">
          Choose a charity to support with at least 10% of your subscription fee
        </p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {selectedCharity && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Currently Supporting</h4>
              <p className="text-lg font-medium text-blue-900">{selectedCharity.name}</p>
              <p className="text-blue-700 mt-2">
                {contributionPercentage}% of your subscription goes to this charity
              </p>
            </div>
            <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Contribution Percentage (minimum 10%)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="10"
            max="100"
            value={contributionPercentage}
            onChange={(e) => setContributionPercentage(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="w-20 text-center">
            <span className="text-2xl font-bold text-blue-600">{contributionPercentage}%</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Select a Charity</h4>
        <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {charities.map((charity) => (
            <button
              key={charity.id}
              onClick={() => setSelectedCharityId(charity.id)}
              className={`text-left p-4 rounded-lg border-2 transition ${
                selectedCharityId === charity.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-1">{charity.name}</h5>
                  <p className="text-sm text-gray-600 line-clamp-2">{charity.description}</p>
                </div>
                {selectedCharityId === charity.id && (
                  <Check className="w-6 h-6 text-blue-600 ml-2 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !selectedCharityId}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Save Selection'}
      </button>
    </div>
  );
}
