import React, { useEffect, useState } from 'react';
import { Trees, Snowflake, Gift, Star } from 'lucide-react';

interface ChristmasScreenProps {
  onReset: () => void;
}

const ChristmasScreen: React.FC<ChristmasScreenProps> = ({ onReset }) => {
  const [elements, setElements] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Generate random falling elements
    const newElements = [];
    // Increased count to ensure "many" trees populate the screen
    const count = 75; 
    
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 5;
      const left = Math.random() * 100;
      const size = 20 + Math.random() * 30;
      const type = Math.random();

      let icon;
      // Requirement: "many Christmas tree will appear"
      // Adjusted probabilities to heavily favor trees (70%)
      if (type < 0.7) {
        // Add variety to tree shades for a richer forest look
        const greenShades = ["text-green-500", "text-green-600", "text-emerald-500", "text-teal-600"];
        const randomShade = greenShades[Math.floor(Math.random() * greenShades.length)];
        icon = <Trees size={size} className={randomShade} />;
      }
      else if (type < 0.85) icon = <Snowflake size={size} className="text-blue-200" />;
      else if (type < 0.95) icon = <Gift size={size} className="text-red-500" />;
      else icon = <Star size={size} className="text-yellow-400" />;

      newElements.push(
        <div
          key={i}
          className="absolute top-[-50px] animate-fall pointer-events-none"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        >
          {icon}
        </div>
      );
    }
    setElements(newElements);
  }, []);

  return (
    <div className="absolute inset-0 bg-slate-900 rounded-3xl overflow-hidden z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      {elements}
      
      <div className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center gap-6">
        <div className="bg-red-600 p-4 rounded-full shadow-lg animate-bounce">
            <Trees size={48} className="text-white" />
        </div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-red-500 animate-pulse">
            Merry Christmas!
          </h1>
          <p className="text-slate-300 mt-2 text-lg">
            Ho Ho Ho! You found the secret code.
          </p>
        </div>

        <button
          onClick={onReset}
          className="mt-4 px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Back to Math
        </button>
      </div>

      {/* Decorative bottom snow */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-b-3xl opacity-20 blur-xl"></div>
    </div>
  );
};

export default ChristmasScreen;