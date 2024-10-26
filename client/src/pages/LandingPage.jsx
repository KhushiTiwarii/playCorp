import React, { useState, useEffect } from "react";
import { Heart, Building2, Briefcase, ArrowRight, Gamepad2 } from "lucide-react";

// Custom hook for count animation
function useCountAnimation(end, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = parseInt(end.replace(/[^0-9]/g, ''));
    
    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

// Data
const features = [
  {
    icon: <Heart className="h-12 w-12 mb-6 text-blue-400" />,
    title: "Health & Wellbeing",
    description: "Promoting corporate wellness and healthy gaming practices",
  },
  {
    icon: <Building2 className="h-12 w-12 mb-6 text-blue-400" />,
    title: "Sustainable Growth",
    description: "Fostering economic growth through fair play and innovation",
  },
  {
    icon: <Briefcase className="h-12 w-12 mb-6 text-blue-400" />,
    title: "Decent Work",
    description: "Creating opportunities for professional development",
  },
];

const sdgInitiatives = [
  {
    value: "health",
    icon: <Heart className="h-12 w-12 text-blue-400" />,
    title: "SDG 3: Good Health & Well-being",
    description: "Promoting mental health awareness and balanced gaming habits",
    badges: ["Mental Health", "Work-Life Balance", "Wellness Programs"],
  },
  {
    value: "work",
    icon: <Building2 className="h-12 w-12 text-blue-400" />,
    title: "SDG 8: Decent Work & Economic Growth",
    description: "Creating sustainable career paths and promoting fair competition",
    badges: ["Fair Play", "Career Development", "Economic Opportunities"],
  }
];

const stats = [
  { value: "100+", label: "Wellness Programs" },
  { value: "20+", label: "Partner Companies" },
  { value: "250+", label: "Lives Impacted" },
  { value: "24/7", label: "Available" },
];

const sponsors = [
  {
    name: "Intel",
    logo: "https://s3-symbol-logo.tradingview.com/intel--600.png",
    tier: "platinum",
  },
  {
    name: "AMD",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJPKH3XifgxFlhqoVk8aAgVr5k7k7gfKfmSw&s",
    tier: "platinum",
  },
  {
    name: "NVIDIA",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLkCvaceexOvp91gxagcGAhWCc3yYCy4tGHw&s",
    tier: "gold",
  },
  {
    name: "Nike",
    logo: "https://thumbs.dreamstime.com/b/web-183282388.jpg",
    tier: "gold",
  },
  {
    name: "Puma",
    logo: "https://1000logos.net/wp-content/uploads/2017/05/PUMA-Logo-1980.jpg",
    tier: "silver",
  },
  {
    name: "Adidas",
    logo: "https://cdn.britannica.com/94/193794-050-0FB7060D/Adidas-logo.jpg",
    tier: "silver",
  },
];

// Components
function Hero() {
  return (
    <header className="container mx-auto px-4 py-24 text-center">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full transform scale-150"></div>
          <Gamepad2 className="h-16 w-16 text-blue-400 relative" />
        </div>
        <h1 className="text-6xl font-bold ml-4 bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300 text-transparent bg-clip-text">
          PlayCorp
        </h1>
      </div>
      <p className="text-2xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed">
        Transforming sports through sustainable development and corporate well-being
      </p>
      <div className="flex gap-6 justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-lg text-white py-4 px-8 rounded-full relative overflow-hidden group">
          <span className="relative z-10 flex items-center">
            Join Our Mission
            <ArrowRight className="ml-2 h-5 w-5 inline transform group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </button>
        <button className="border-2 border-white text-lg text-white py-4 px-8 rounded-full hover:bg-blue-50/5 transition-colors">
          Learn More
        </button>
      </div>
    </header>
  );
}

function Features() {
  return (
    <section className="container mx-auto px-4 py-24 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group bg-white/10 backdrop-blur-md p-8 rounded-lg transition-all duration-500 hover:shadow-2xl hover:shadow-blue-400/20 hover:-translate-y-2 hover:bg-white/15"
          >
            <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 mb-6">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white transition-colors duration-300 group-hover:text-blue-400">
              {feature.title}
            </h3>
            <p className="text-slate-200 transition-colors duration-300 group-hover:text-white">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SDGInitiatives({ activeInitiative, setActiveInitiative }) {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-2 mb-8">
        {sdgInitiatives.map((initiative) => (
          <button
            key={initiative.value}
            onClick={() => setActiveInitiative(initiative.value)}
            className={`text-lg rounded-lg py-2 px-4 transition-all duration-300 ${
              activeInitiative === initiative.value ? "bg-blue-600 text-white" : "text-slate-300"
            }`}
          >
            {initiative.title}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {sdgInitiatives
          .filter((initiative) => initiative.value === activeInitiative)
          .map((initiative) => (
            <div key={initiative.value} className="bg-gradient-to-br from-blue-600/20 to-blue-500/20 p-8 rounded-lg">
              <div className="flex items-start gap-6">
                {initiative.icon}
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{initiative.title}</h3>
                  <p className="text-slate-200 mb-6 text-lg">{initiative.description}</p>
                  <div className="flex gap-3 flex-wrap">
                    {initiative.badges.map((badge) => (
                      <span key={badge} className="bg-blue-900/30 text-white px-4 py-1 text-sm border border-blue-400/20 rounded">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

function StatItem({ value, label }) {
  const count = useCountAnimation(value);
  
  return (
    <div 
      className="flex flex-col items-center group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50" // Added focus classes
      tabIndex={0} // Make the div focusable
    >
      <div className="text-4xl font-bold text-white mb-2 relative transition-transform duration-300 transform group-hover:-translate-y-2 group-focus:-translate-y-2"> {/* Move on hover and focus */}
        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
          {count}
          {value.includes('+') ? '+' : ''}
          {value.includes('/') ? '/7' : ''}
        </span>
        <div className="absolute inset-0 bg-blue-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
      </div>
      <div className="text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
        {label}
      </div>
    </div>
  );
}


function Stats() {
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <StatItem key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}

function Sponsors() {
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <h2 className="text-4xl font-semibold mb-12 text-white">Our Sponsors</h2>
      <div className="flex flex-wrap justify-center gap-12">
        {sponsors.map((sponsor) => (
          <div 
            key={sponsor.name} 
            className="flex items-center justify-center p-6 bg-white/10 rounded-full relative overflow-hidden transform hover:scale-105 transition-transform"
            style={{
              backgroundImage: `url(${sponsor.logo})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              height: '150px',
              width: '150px'
            }}
          >
            <span className="sr-only">{sponsor.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// Main Landing Component
export default function Landing() {
  const [activeInitiative, setActiveInitiative] = React.useState("health");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      <div className="relative z-10">
        <Hero />
        <Features />
        <SDGInitiatives 
          activeInitiative={activeInitiative}
          setActiveInitiative={setActiveInitiative}
        />
        <Stats />
        <Sponsors />
      </div>
    </div>
  );
}