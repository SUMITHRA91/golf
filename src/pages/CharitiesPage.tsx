import { useEffect, useState } from 'react';
import { Heart, ExternalLink, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  website: string | null;
  is_featured: boolean;
  upcoming_events: any;
}

export function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredCharities = charities.filter(charity =>
    charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredCharities = filteredCharities.filter(c => c.is_featured);
  const otherCharities = filteredCharities.filter(c => !c.is_featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading charities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Charities</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a cause that matters to you. Every subscription makes a difference.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search charities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {featuredCharities.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Heart className="w-8 h-8 text-red-500 mr-3" fill="currentColor" />
              Featured Charities
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCharities.map(charity => (
                <CharityCard key={charity.id} charity={charity} featured />
              ))}
            </div>
          </div>
        )}

        {otherCharities.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">All Charities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCharities.map(charity => (
                <CharityCard key={charity.id} charity={charity} />
              ))}
            </div>
          </div>
        )}

        {filteredCharities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No charities found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CharityCard({ charity, featured = false }: { charity: Charity; featured?: boolean }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition ${featured ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        {charity.image_url ? (
          <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
        ) : (
          <Heart className="w-16 h-16 text-blue-600" />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{charity.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{charity.description}</p>

        {charity.upcoming_events && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Upcoming Event</p>
            <p className="text-sm text-blue-700">{charity.upcoming_events.title || 'Golf Day Fundraiser'}</p>
          </div>
        )}

        {charity.website && (
          <a
            href={charity.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Visit Website
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
}
