import Link from "next/link";
import { Wrench, Heart, Hammer, ArrowRight, Gamepad2, Utensils, Users } from "lucide-react";

export default function Home() {
  const topics = [
    {
      id: "hubplate",
      title: "HubPlate",
      subtitle: "For Restaurateurs",
      description: "Unlock the secrets to running a better restaurant. Discover expert tips and tricks for menu engineering, staff scheduling, and leveraging AI to maximize your venue's profitability.",
      icon: Utensils,
      gradient: "from-red-600 via-orange-500 to-red-600",
      iconColor: "text-red-500",
    },
    {
      id: "baybolt",
      title: "Baybolt",
      subtitle: "For Mechanics",
      description: "Master automotive repair with expert guides, diagnostic tips, and industry insights from seasoned professionals.",
      icon: Wrench,
      gradient: "from-orange-500 via-orange-600 to-blue-900",
      iconColor: "text-orange-500",
    },
    {
      id: "hugloom",
      title: "HugLoom",
      subtitle: "For Caretakers",
      description: "Compassionate caregiving strategies, wellness resources, and emotional support for healthcare heroes.",
      icon: Heart,
      gradient: "from-pink-400 via-rose-400 to-red-400",
      iconColor: "text-pink-400",
    },
    {
      id: "hangroom",
      title: "Hangroom",
      subtitle: "For Creators",
      description: "Stop asking for algorithm permission. Own your brand, audience, and revenue with the ultimate content creator platform.",
      icon: Users,
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      iconColor: "text-violet-500",
    },
    {
      id: "raidmemegen",
      title: "Raid Generator",
      subtitle: "For Gamers",
      description: "Generate squad-specific raid plans for Helldivers 2, WoW, and more. Add Meme Chaos for the ultimate strategy.",
      icon: Gamepad2,
      gradient: "from-[#00FF41] via-[#008F11] to-[#003B00]",
      iconColor: "text-[#00FF41]",
    },
    {
      id: "daylabor",
      title: "Day Labor on Demand",
      subtitle: "For Contractors",
      description: "Scale your contracting business with project management tactics, labor insights, and growth strategies.",
      icon: Hammer,
      gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="pt-[32px] pb-8 px-8">
        <div className="container text-center">
          <h1 className="font-black mb-[32px] gradient-text text-4xl md:text-5xl">
            Welcome to MK Tool Nest
          </h1>

          <div className="mb-[16px]">
            <span className="text-xl font-medium text-gray-400">Your Professional Resource Hub</span>
          </div>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-[96px] leading-relaxed">
            Empowering professionals with <span className="text-white font-semibold">expert insights</span>,
            <span className="text-white font-semibold"> actionable tools</span>, and
            <span className="text-white font-semibold"> industry knowledge</span> across four specialized fields.
          </p>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="pt-[4px] pb-[32px] px-[4px]">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[32px] max-w-7xl mx-auto">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <Link href={`/${topic.id}`} key={topic.id}>
                  <div className={`card p-8 h-full group cursor-pointer flex flex-col items-center text-center ${topic.id === 'hubplate' ? 'hubplate-card' : topic.id === 'baybolt' ? 'baybolt-card' : topic.id === 'hugloom' ? 'hugloom-card' : topic.id === 'daylabor' ? 'daylabor-card' : topic.id === 'raidmemegen' ? 'raidmemegen-card' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                    {/* Icon with Gradient Background */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                        <Icon className="text-white" size={36} strokeWidth={2.5} />
                      </div>
                      <div className={`absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${topic.gradient} blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <h2 className={`text-2xl font-bold mb-1 ${topic.id === 'hubplate' ? 'text-red-500' : topic.id === 'baybolt' ? 'text-orange-500' : topic.id === 'raidmemegen' ? 'text-[#00FF41]' : 'text-white'}`}>{topic.title}</h2>
                      <p className={`text-sm font-medium ${topic.id === 'hubplate' ? 'text-red-400' : topic.id === 'baybolt' ? 'text-orange-400' : topic.id === 'raidmemegen' ? 'text-[#00FF41]' : 'text-gray-500'}`}>{topic.subtitle}</p>
                    </div>

                    <p className={`mb-6 leading-relaxed ${topic.id === 'hubplate' ? 'text-red-300/90' : topic.id === 'baybolt' ? 'text-orange-300/90' : topic.id === 'raidmemegen' ? 'text-[#00FF41]/80' : 'text-gray-400'}`}>
                      {topic.description}
                    </p>

                    {/* CTA */}
                    <div className={`flex items-center justify-center ${topic.iconColor} font-semibold text-sm group-hover:gap-3 transition-all duration-300`}>
                      <span>Explore Articles</span>
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
            Your Premier Destination for Professional Growth
          </h2>
          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p>
              At <strong className="text-white">MK Tool Nest</strong>, we are the ultimate <strong className="text-white">professional resource hub</strong> dedicated to serving the backbone of our economy.
              Whether you are looking for the <strong className="text-white">best restaurant POS system</strong> and <strong className="text-white">restaurant management tips</strong> in our
              <span className="text-orange-500"> HubPlate</span> section, exploring <strong className="text-white">automotive diagnostic tools</strong> in
              <span className="text-orange-400"> Baybolt</span>, seeking <strong className="text-white">caregiver support</strong> through
              <span className="text-pink-400"> HugLoom</span>, or searching for <strong className="text-white">construction project management</strong> strategies in
              <span className="text-purple-400"> Day Labor on Demand</span>, we have curated resources just for you.
            </p>
            <p>
              Now catering to the gaming community, our <span className="text-[#00FF41]">Raid Generator</span> section offers the ultimate <strong className="text-white">squad-specific raid plans</strong>.
              Whether you need a <strong className="text-white">Destiny 2 raid generator</strong> for complex strategies or a <strong className="text-white">WoW raid strategy generator</strong> for mythic bosses,
              our &quot;Meme Chaos&quot; vibe ensures you have a laugh while you strategize for <strong className="text-white">Helldivers 2 squad plans</strong> and <strong className="text-white">MMO encounters</strong>.
            </p>
            <p>
              Our mission is to empower individuals with <strong className="text-white">expert industry insights</strong> and the tools they need to succeed.
              From <strong className="text-white">ASE certification tips</strong> for mechanics to <strong className="text-white">patient advocacy resources</strong> for caretakers,
              and <strong className="text-white">contractor business growth</strong> strategies to <strong className="text-white">winning raid tactics</strong>,
              MK Tool Nest is your partner in professional excellence. Explore our specialized topics today and discover why we are the top choice for <strong className="text-white">career growth for trades</strong> and <strong className="text-white">gaming strategy</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-20 pb-[64px] px-4">
        <div className="container">
          <div className="card built-for-pros-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Built for Professionals</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                Whether you&apos;re running a restaurant, turning wrenches, caring for others, building the future, or leading a raid—we&apos;ve got the insights you need to excel.
              </p>
              <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
                <div>
                  <div className="text-4xl font-black gradient-text mb-2">5</div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">Industries</div>
                </div>
                <div>
                  <div className="text-4xl font-black gradient-text mb-2">∞</div>
                  <div className="text-sm text-gray-500 font-medium">Insights</div>
                </div>
                <div>
                  <div className="text-4xl font-black gradient-text mb-2">24/7</div>
                  <div className="text-sm text-gray-500 font-medium">Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
