import { Heart, Trophy, Users, TrendingUp } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-[#f5f3ef] text-gray-900">

      {/* ================= HERO ================= */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0">
          <img src="/golf-bg.jpg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Play Golf.
            <br />
            <span className="text-yellow-400">Make a Difference.</span>
          </h1>

          <p className="mt-6 text-xl text-gray-200">
            Track your scores, support charities you care about, and win monthly prizes.
            Every round makes an impact.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("signup")}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold"
            >
              Start Your Journey
            </button>

            <button
              onClick={() => onNavigate("how-it-works")}
              className="border border-white px-6 py-3 rounded-lg"
            >
              Learn How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 bg-[#f5f3ef]">
        <h2 className="text-4xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-4">
          {[
            {
              icon: Users,
              title: "Subscribe",
              text: "Choose monthly or yearly plan and join our community",
            },
            {
              icon: TrendingUp,
              title: "Track Scores",
              text: "Enter your latest 5 golf scores in Stableford format",
            },
            {
              icon: Trophy,
              title: "Win Prizes",
              text: "Monthly draws with 3, 4, and 5-number match prizes",
            },
            {
              icon: Heart,
              title: "Give Back",
              text: "Support your chosen charity with every subscription",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <item.icon className="mx-auto mb-4 text-green-800" size={40} />
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRIZE DISTRIBUTION ================= */}
      <section className="py-20 bg-green-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center px-4">
          <div>
            <div className="text-5xl font-bold text-yellow-400">40%</div>
            <p className="text-gray-300 mt-2">to 5-Match Jackpot</p>
          </div>

          <div>
            <div className="text-5xl font-bold text-yellow-400">35%</div>
            <p className="text-gray-300 mt-2">to 4-Match Winners</p>
          </div>

          <div>
            <div className="text-5xl font-bold text-yellow-400">25%</div>
            <p className="text-gray-300 mt-2">to 3-Match Winners</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-[#f5f3ef] text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Make an Impact?
        </h2>

        <p className="text-xl text-gray-600 mb-8">
          Join thousands of golfers who are turning their passion into purpose
        </p>

        <button
          onClick={() => onNavigate("signup")}
          className="px-8 py-4 bg-green-800 hover:bg-green-900 text-white text-lg font-semibold rounded-xl shadow-lg"
        >
          Get Started Today
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-green-950 text-gray-300 py-10 text-center">
        <p>© 2026 Birdie for Good. All rights reserved.</p>
      </footer>

    </div>
  );
}