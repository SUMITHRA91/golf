import { CreditCard, Calendar, Check } from 'lucide-react';

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  current_period_end: string;
  amount: number;
  cancel_at_period_end: boolean;
}

interface SubscriptionStatusProps {
  subscription: Subscription | null;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscription</h3>
          <p className="text-gray-600">Choose a plan to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition">
            <div className="mb-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-1">Monthly Plan</h4>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$19</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Enter monthly draws
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Support your chosen charity
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Track unlimited scores
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Cancel anytime
              </li>
            </ul>

            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
              Subscribe Monthly
            </button>
          </div>

          <div className="border-2 border-blue-500 rounded-xl p-6 relative bg-blue-50">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Best Value
              </span>
            </div>

            <div className="mb-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-1">Yearly Plan</h4>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$199</span>
                <span className="text-gray-600 ml-2">/year</span>
              </div>
              <p className="text-green-600 font-medium mt-1">Save $29 per year!</p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Enter monthly draws
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Support your chosen charity
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Track unlimited scores
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                2 months free
              </li>
            </ul>

            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
              Subscribe Yearly
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> All plans include automatic entry into monthly draws and support for your chosen charity.
            A minimum of 10% of your subscription goes directly to your selected charity.
          </p>
        </div>
      </div>
    );
  }

  const renewalDate = new Date(subscription.current_period_end).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscription</h3>
        <p className="text-gray-600">Manage your active subscription</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-900">Active Subscription</h4>
              <p className="text-green-700 capitalize">{subscription.plan_type} Plan</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-900">${subscription.amount}</p>
            <p className="text-sm text-green-700">/{subscription.plan_type === 'monthly' ? 'month' : 'year'}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Next Billing Date</h4>
          </div>
          <p className="text-lg text-gray-700">{renewalDate}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Payment Status</h4>
          </div>
          <p className="text-lg text-green-600 font-medium">Active</p>
        </div>
      </div>

      {subscription.cancel_at_period_end && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            Your subscription is set to cancel on {renewalDate}. You will continue to have access until this date.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition">
          Update Payment Method
        </button>
        <button className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition">
          {subscription.cancel_at_period_end ? 'Reactivate Subscription' : 'Cancel Subscription'}
        </button>
      </div>
    </div>
  );
}
