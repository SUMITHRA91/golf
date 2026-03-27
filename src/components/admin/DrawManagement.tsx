import { useState } from 'react';
import { Plus, Play, Eye } from 'lucide-react';

export function DrawManagement() {
  const [drawType, setDrawType] = useState<'random' | 'algorithmic'>('random');
  const [creating, setCreating] = useState(false);

  const handleCreateDraw = () => {
    setCreating(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Draw Management</h3>
        <p className="text-gray-600">Configure and run monthly draws</p>
      </div>

      {!creating ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Create New Draw</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Draw Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDrawType('random')}
                    className={`p-4 border-2 rounded-lg transition ${
                      drawType === 'random'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">Random Draw</div>
                    <div className="text-sm text-gray-600 mt-1">Standard lottery-style</div>
                  </button>
                  <button
                    onClick={() => setDrawType('algorithmic')}
                    className={`p-4 border-2 rounded-lg transition ${
                      drawType === 'algorithmic'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">Algorithmic Draw</div>
                    <div className="text-sm text-gray-600 mt-1">Weighted by frequency</div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreateDraw}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Draw</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Recent Draws</h4>
            <div className="text-center py-8 text-gray-500">
              No draws created yet. Create your first draw above.
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Draw Simulation</h4>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Winning Numbers</div>
              <div className="flex space-x-2">
                {[12, 23, 34, 38, 42].map((num, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">5-Match Winners</div>
                <div className="text-2xl font-bold text-gray-900">0</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">4-Match Winners</div>
                <div className="text-2xl font-bold text-gray-900">3</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">3-Match Winners</div>
                <div className="text-2xl font-bold text-gray-900">12</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                <Play className="w-5 h-5" />
                <span>Publish Draw</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                <Eye className="w-5 h-5" />
                <span>Run Simulation Again</span>
              </button>
              <button
                onClick={() => setCreating(false)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
