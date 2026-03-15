"use client"
import { motion } from "framer-motion";
import { Coffee, Users, Vote, MapPin, ArrowRight, Sparkles } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import CoffeeRegionCard from "@/components/CoffeeRegionCard";
import Link from "next/link";
import { BunaLogo } from "@/components/BunaLogo";
import { coffeeRegions } from "@/constants";
import Footer from "@/components/Footer";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";


export default function Page() {
    const { data: session } = authClient.useSession();
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden ethiopian-pattern">
        <div className="container mx-auto px-4 md:px-8 pt-20">
          <div className="max-w-4xl  mx-auto text-center">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="font-ethiopic text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-12 tracking-tightest"
            >
              ቡና ጠጪዎች ማህበር
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ lineHeight: 1.4 }}
            >
              ET Coffee Lovers' Association
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center mb-10 justify-center gap-4"
            >
              
            <Link href={session ? "/dashboard" : "/join"}>
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="btn-mahber text-base"
              >
                {session ? "Dashboard" : "Join the Club"}
              </motion.button>
            </Link>
              <Link href="/election">
                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold text-base"
                >
                  Vote for President
                </motion.button>
              </Link>
            </motion.div>

            {/* Floating coffee elements */}
            {/* <div className="relative mt-16 flex justify-center">
              <motion.img
                src={BunaLogo}
                alt="Ethiopian coffee cup"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28 md:w-40 md:h-40 object-contain drop-shadow-lg"
              />
            </div> */}
          </div>
        </div>
        
        {/* Full-width bottom bleed pattern */}
        <div className="absolute bottom-12 left-0 w-full h-12 md:h-16">
          <Image 
            src="/pat.png" 
            alt="Ethiopian pattern" 
            fill 
            className="object-cover" 
            priority 
          />
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, value: 12847, label: "Members", suffix: "+" },
              { icon: Vote, value: 8932, label: "Votes Cast", suffix: "" },
              { icon: MapPin, value: 47, label: "Cities Represented", suffix: "" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <stat.icon className="w-6 h-6 text-accent mb-3" />
                <span className="font-display text-4xl md:text-5xl font-bold tracking-tightest">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-sm font-body text-primary-foreground/60 mt-2 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 ethiopian-pattern">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6" style={{ lineHeight: 1.1 }}>
                What is the Buna Association?
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
                It started as a simple idea on the internet. Then it became a movement. ET Coffee Lovers' Association is a digital community celebrating Ethiopia's thousands of years of coffee heritage.
              </p>
              <p className="font-body text-lg text-muted-foreground mb-6">
                one cup, one ceremony, one coffee at a time.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                From the three rounds of the traditional coffee ceremony —  <span className="font-ethiopic text-foreground font-medium">አቦል፣ ቶና፣ በረካ</span> — to your daily macchiato run, we believe coffee isn't just a drink. It's culture. It's community. It's home.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quiz Teaser */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ceramic-surface p-8 md:p-16 text-center max-w-3xl mx-auto"
          >
            <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ lineHeight: 1.1 }}>
              Discover Your Buna Personality
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Are you a Ceremony Purist or a Midnight Coffee Coder? Take the quiz and find out your coffee soul.
            </p>
            <Link href="/quiz">
              <motion.button
                whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(78,52,46,0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="btn-clay text-base inline-flex items-center gap-2"
              >
                Take the Quiz <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Coffee Regions */}
      <section className="py-24 ethiopian-pattern">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4" style={{ lineHeight: 1.1 }}>
                Featured Coffee Regions
              </h2>
              <p className="font-body text-lg text-muted-foreground max-w-lg mx-auto">
                Explore the birthplace of coffee through its legendary growing regions.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coffeeRegions.map((region, i) => (
              <CoffeeRegionCard key={region.name} {...region} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

