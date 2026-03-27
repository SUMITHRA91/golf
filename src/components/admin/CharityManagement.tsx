import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Charity {
  id: string;
  name: string;
  description: string;
  website: string | null;
  is_featured: boolean;
}

export function CharityManagement() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCharity, setNewCharity] = useState({
    name: '',
    description: '',
    website: '',
  });

  useEffect(() => {
    loadCharities();
  }, []);

  const loadCharities = async () => {
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('name');

    if (!error && data) {
      setCharities(data);
    }
    setLoading(false);
  };

  const handleAddCharity = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('charities').insert({
      name: newCharity.name,
      description: newCharity.description,
      website: newCharity.website || null,
      is_featured: false,
    });

    if (!error) {
      setNewCharity({ name: '', description: '', website: '' });
      setShowAddForm(false);
      await loadCharities();
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('charities')
      .update({ is_featured: !currentStatus })
      .eq('id', id);

    await loadCharities();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this charity?')) {
      await supabase.from('charities').delete().eq('id', id);
      await loadCharities();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading charities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Charity Management</h3>
          <p className="text-gray-600">Add and manage charities available for selection</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Charity</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCharity} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Add New Charity</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Charity Name
              </label>
              <input
                type="text"
                value={newCharity.name}
                onChange={(e) => setNewCharity({ ...newCharity, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="The Golf Foundation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newCharity.description}
                onChange={(e) => setNewCharity({ ...newCharity, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="A brief description of the charity and its mission..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (optional)
              </label>
              <input
                type="url"
                value={newCharity.website}
                onChange={(e) => setNewCharity({ ...newCharity, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Add Charity
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCharity({ name: '', description: '', website: '' });
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {charities.map((charity) => (
          <div
            key={charity.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{charity.name}</h4>
                  {charity.is_featured && (
                    <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{charity.description}</p>
                {charity.website && (
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {charity.website}
                  </a>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleFeatured(charity.id, charity.is_featured)}
                  className={`p-2 rounded-lg transition ${
                    charity.is_featured
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={charity.is_featured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star className="w-5 h-5" fill={charity.is_featured ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(charity.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {charities.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No charities added yet. Add your first charity above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
