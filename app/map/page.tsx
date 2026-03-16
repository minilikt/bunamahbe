"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Coffee, ArrowRight } from "lucide-react";
import CoffeeRegionCard from "@/components/CoffeeRegionCard";
import { coffeeRegions } from "@/constants";
import Link from "next/link";

interface Region {
  id: string;
  name: string;
  nameAmharic: string;
  flavorNotes: string;
  rating: number;
  description: string;
  x: number;
  y: number;
}

const regions: Region[] = [
  { id: "sidama", name: "Sidama", nameAmharic: "ሲዳማ", flavorNotes: "Blueberry, Jasmine, High Acidity", rating: 4.9, description: "Premium washed coffees with complex berry and floral notes.", x: 55, y: 72 },
  { id: "yirgacheffe", name: "Yirgacheffe", nameAmharic: "ይርጋ ጨፌ", flavorNotes: "Jasmine, Peach, Bergamot", rating: 4.8, description: "The gold standard of Ethiopian specialty coffee.", x: 50, y: 68 },
  { id: "jimma", name: "Jimma", nameAmharic: "ጅማ", flavorNotes: "Chocolate, Earthy, Spice", rating: 4.6, description: "Full-bodied, earthy forest coffees from the west.", x: 38, y: 55 },
  { id: "harar", name: "Harar", nameAmharic: "ሐረር", flavorNotes: "Blueberry, Wine, Dark Chocolate", rating: 4.7, description: "Ancient walled city producing bold, naturally processed beans.", x: 68, y: 48 },
];

export default function Page() {
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);

  return (
    <div className="min-h-screen pt-20 ethiopian-pattern">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay/10 text-clay font-body text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Coffee Origins
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tightest" style={{ lineHeight: 0.95 }}>
              Ethiopian Coffee Map
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-md mx-auto">
              Explore the legendary coffee growing regions of Ethiopia.
            </p>
          </motion.div>
        </div>

        {/* Interactive Map */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="ceramic-surface p-8 md:p-12">
            <div className="relative aspect-[4/3] bg-secondary/50 rounded-2xl overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M30,20 L45,15 L60,18 L75,25 L80,35 L82,50 L75,60 L70,75 L60,82 L45,80 L35,75 L25,65 L22,50 L25,35 Z"
                  fill="hsl(35 45% 90%)"
                  stroke="hsl(12 25% 25% / 0.2)"
                  strokeWidth="0.5"
                />
                {regions.map((region) => (
                  <g key={region.id}>
                    <circle
                      cx={region.x}
                      cy={region.y}
                      r={activeRegion?.id === region.id ? 4 : 3}
                      fill={activeRegion?.id === region.id ? "hsl(7 45% 45%)" : "hsl(12 25% 25%)"}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setActiveRegion(region)}
                      onClick={() => setActiveRegion(region)}
                    />
                    <circle
                      cx={region.x}
                      cy={region.y}
                      r={6}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setActiveRegion(region)}
                      onClick={() => setActiveRegion(region)}
                    />
                    {activeRegion?.id === region.id && (
                      <circle
                        cx={region.x}
                        cy={region.y}
                        r="6"
                        fill="none"
                        stroke="hsl(43 52% 55%)"
                        strokeWidth="0.5"
                        opacity="0.5"
                      >
                        <animate attributeName="r" from="4" to="8" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                ))}
              </svg>

              <AnimatePresence>
                {activeRegion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-72 bg-card border border-border rounded-2xl p-5 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold text-lg text-foreground">{activeRegion.name}</h3>
                      <span className="font-ethiopic text-sm text-muted-foreground">{activeRegion.nameAmharic}</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mb-3">{activeRegion.description}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="font-display font-bold text-sm">{activeRegion.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coffee className="w-3 h-3 text-clay" />
                      <span className="font-body text-xs text-muted-foreground">{activeRegion.flavorNotes}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {regions.map((region) => (
                <motion.button
                  key={region.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveRegion(region)}
                  className={`p-3 rounded-xl border text-left transition-all font-body text-sm ${
                    activeRegion?.id === region.id
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-accent/30"
                  }`}
                >
                  <span className="font-display font-bold block">{region.name}</span>
                  <span className="text-xs">{region.nameAmharic}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Coffee Regions Cards */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ lineHeight: 1.1 }}>
              Featured Coffee Regions
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-lg mx-auto">
              Explore the birthplace of coffee through its legendary growing regions.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coffeeRegions.map((region, i) => (
              <CoffeeRegionCard key={region.name} {...region} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
