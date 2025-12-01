import Link from "next/link";
import { Wrench, Heart, Hammer, ArrowRight } from "lucide-react";

export default function Home() {
  const topics = [
    {
      id: "baybolt",
      title: "Baybolt",
      subtitle: "Tips & Tools for Mechanics",
      description: "Expert advice, maintenance guides, and professional tips for automotive mechanics and technicians.",
      icon: Wrench,
      color: "red",
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: "hugloom",
      title: "HugLoom",
      subtitle: "Tips & Tools for Caretakers",
      description: "Compassionate care strategies, wellness resources, and support for caregivers and healthcare professionals.",
      icon: Heart,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "daylabor",
      title: "Day Labor on Demand",
      subtitle: "Tips & Tools for Contractors",
      description: "Project management insights, labor optimization, and business growth strategies for contractors and day laborers.",
      icon: Hammer,
      color: "amber",
      gradient: "from-amber-500 to-yellow-500",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Welcome to mktoolnest
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Your trusted resource hub for professional tips, tools, and insights across three specialized industries.
          </p>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-12 px-4">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link href={`/${topic.id}`} key={topic.id}>
                  <div className="card p-8 h-full group cursor-pointer">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${topic.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{topic.title}</h2>
                    <p className="text-sm text-gray-500 mb-4">{topic.subtitle}</p>
                    <p className="text-gray-400 mb-6">{topic.description}</p>
                    <div className="flex items-center text-primary group-hover:gap-2 transition-all">
                      <span className="text-sm font-medium">Explore Articles</span>
                      <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="card p-12 text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Get the latest tips, tools, and insights delivered straight to your industry.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
