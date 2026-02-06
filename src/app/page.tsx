import Link from "next/link";
import { Wrench, Heart, Hammer, ArrowRight, Gamepad2, Utensils, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import styles from "./home.module.css";

export default async function Home() {
  const supabase = await createClient();

  // Fetch specific hero settings for home and all topics
  const { data: heroSettings } = await supabase
    .from("site_settings")
    .select("setting_key, setting_value")
    .in("setting_key", [
      "hero_home",
      "hero_hubplate",
      "hero_hangroom",
      "hero_baybolt",
      "hero_hugloom",
      "hero_raidmemegen",
      "hero_daylabor"
    ]);

  // Create a map for easy lookup
  const heroMap: Record<string, string> = {};
  heroSettings?.forEach(setting => {
    heroMap[setting.setting_key] = setting.setting_value;
  });

  const heroImageUrl = heroMap["hero_home"] || null;

  const topics = [
    {
      id: "hubplate",
      title: "HubPlate",
      subtitle: "For Restaurateurs",
      description: "Unlock the secrets to running a better restaurant. Discover expert tips and tricks for menu engineering, staff scheduling, and leveraging AI to maximize your venue's profitability.",
      icon: Utensils,
      cardClass: styles.hubplateCard,
      titleClass: styles.hubplateText,
      subtitleClass: styles.hubplateSubtitle,
      descriptionClass: styles.hubplateDescription,
      gradientClass: styles.gradientHubplate,
      heroKey: "hero_hubplate"
    },
    {
      id: "hangroom",
      title: "Hangroom",
      subtitle: "For Creators",
      description: "Stop asking for algorithm permission. Own your brand, audience, and revenue with the ultimate content creator platform.",
      icon: Users,
      cardClass: styles.hangroomCard,
      titleClass: styles.hangroomText,
      subtitleClass: styles.hangroomSubtitle,
      descriptionClass: styles.hangroomDescription,
      gradientClass: styles.gradientHangroom,
      heroKey: "hero_hangroom"
    },
    {
      id: "baybolt",
      title: "Baybolt",
      subtitle: "For Mechanics",
      description: "Master automotive repair with expert guides, diagnostic tips, and industry insights from seasoned professionals.",
      icon: Wrench,
      cardClass: styles.bayboltCard,
      titleClass: styles.bayboltText,
      subtitleClass: styles.bayboltSubtitle,
      descriptionClass: styles.bayboltDescription,
      gradientClass: styles.gradientBaybolt,
      heroKey: "hero_baybolt"
    },
    {
      id: "hugloom",
      title: "HugLoom",
      subtitle: "For Caretakers",
      description: "Compassionate caregiving strategies, wellness resources, and emotional support for healthcare heroes.",
      icon: Heart,
      cardClass: styles.hugloomCard,
      titleClass: styles.hugloomText,
      subtitleClass: styles.hugloomSubtitle,
      descriptionClass: styles.hugloomDescription,
      gradientClass: styles.gradientHugloom,
      heroKey: "hero_hugloom"
    },
    {
      id: "raidmemegen",
      title: "Raid Generator",
      subtitle: "For Gamers",
      description: "Generate squad-specific raid plans for Helldivers 2, WoW, and more. Add Meme Chaos for the ultimate strategy.",
      icon: Gamepad2,
      cardClass: styles.raidmemegenCard,
      titleClass: styles.raidmemegenText,
      subtitleClass: styles.raidmemegenSubtitle,
      descriptionClass: styles.raidmemegenDescription,
      gradientClass: styles.gradientRaidmemegen,
      heroKey: "hero_raidmemegen"
    },
    {
      id: "daylabor",
      title: "Day Labor on Demand",
      subtitle: "For Contractors",
      description: "Scale your contracting business with project management tactics, labor insights, and growth strategies.",
      icon: Hammer,
      cardClass: styles.daylaborCard,
      titleClass: styles.daylaborText,
      subtitleClass: styles.daylaborSubtitle,
      descriptionClass: styles.daylaborDescription,
      gradientClass: styles.gradientDaylabor,
      heroKey: "hero_daylabor"
    },
  ];

  return (
    <>
      {/* Hero Section - Reduced height, pure separation */}
      <section className="relative py-24 px-8 overflow-hidden min-h-[600px] flex flex-col justify-center items-center text-center">
        {/* Background Image */}
        {heroImageUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={heroImageUrl}
              alt="MK Tool Nest Hero"
              className="w-full h-full object-cover opacity-50"
            />
            {/* Darker overlay as requested */}
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
          </div>
        )}

        <div className="container relative z-10 max-w-7xl mx-auto">
          <h1 className="font-black mb-8 gradient-text text-[5rem] md:text-[10rem] leading-none tracking-tighter">
            Welcome to MK Tool Nest
          </h1>

          <div className="mb-4">
            <span className="text-2xl font-medium text-gray-300">Your Professional Resource Hub</span>
          </div>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-24 leading-relaxed">
            Empowering professionals with <span className="text-white font-semibold">expert insights</span>,
            <span className="text-white font-semibold"> actionable tools</span>, and
            <span className="text-white font-semibold"> industry knowledge</span> across five specialized fields.
          </p>
        </div>
      </section>

      {/* FORCE SPACER - 300px GAP */}
      <div style={{ height: '300px', width: '100%', background: 'transparent' }}></div>

      {/* Topics Grid - Forced Separation */}
      <section className="pt-0 pb-16 px-4">
        <div className="container">
          <div
            className="grid md:grid-cols-2 lg:grid-cols-4 mx-auto"
            style={{ display: 'grid', gap: '60px', maxWidth: '1600px' }}
          >
            {topics.map((topic) => {
              const Icon = topic.icon;
              const cardHero = heroMap[topic.heroKey as keyof typeof heroMap];

              return (
                <Link href={`/${topic.id}`} key={topic.id}>
                  <div className={`${styles.topicCard} ${topic.cardClass} cursor-pointer`}>
                    {/* Card Hero Background */}
                    {cardHero && (
                      <div className={styles.cardBackground}>
                        <img src={cardHero} alt={`${topic.title} Background`} />
                        <div className={styles.cardBackgroundOverlay}></div>
                      </div>
                    )}

                    {/* Icon with Gradient Background */}
                    <div className={styles.iconContainer}>
                      <div className={`${styles.iconBox} ${topic.gradientClass}`}>
                        <Icon className="text-white" size={36} strokeWidth={2.5} />
                      </div>
                      <div className={`${styles.iconGlow} ${topic.gradientClass}`}></div>
                    </div>

                    {/* Content */}
                    <div className={styles.cardContent}>
                      <h2 className={`${styles.cardTitle} ${topic.titleClass}`}>{topic.title}</h2>
                      <p className={`${styles.cardSubtitle} ${topic.subtitleClass}`}>{topic.subtitle}</p>
                    </div>

                    <p className={`${styles.cardDescription} ${topic.descriptionClass}`}>
                      {topic.description}
                    </p>

                    {/* CTA */}
                    <div className={`${styles.cardCta} ${topic.titleClass}`}>
                      <span>Explore Articles</span>
                      <ArrowRight size={18} className="transition-transform" />
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
      <section className="pt-20 pb-16 px-4">
        <div className="container">
          <div className={styles.builtForProsCard}>
            <div className={styles.builtForProsGradient}></div>
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
    </>
  );
}
