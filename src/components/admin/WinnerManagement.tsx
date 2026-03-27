export function WinnerManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Winner Management</h3>
        <p className="text-gray-600">Verify winners and manage payouts</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No pending winner verifications</p>
          <p className="text-sm text-gray-400">
            Winners will appear here after draws are published
          </p>
        </div>
      </div>
    </div>
  );
}
