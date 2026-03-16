"use client"
import { motion } from "framer-motion";
import { Coffee, Users, Vote, MapPin, ArrowRight } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import Link from "next/link";
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
          <div className="max-w-4xl mx-auto text-center">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="font-ethiopic text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 tracking-tightest"
            >
              ቡና ጠጪዎች ማህበር
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ lineHeight: 1.4 }}
            >
              Coffee Drinkers Society
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/join">
                <motion.button
                  whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(78,52,46,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-mahber text-base"
                >
                  Join the Buna Club
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

            {/* Floating Ethiopian flowers */}
            <div className="relative mt-16 flex justify-center items-center gap-6 md:gap-12">
              <motion.img
                src="/ethiopian-flower.png"
                alt="Ethiopian flower motif"
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow-2xl opacity-70"
              />
              <motion.img
                src="/ethiopian-flower.png"
                alt="Ethiopian flower motif center"
                animate={{ 
                  y: [0, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-2xl opacity-90"
              />
              <motion.img
                src="/ethiopian-flower.png"
                alt="Ethiopian flower motif mirror"
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow-2xl opacity-70 scale-x-[-1]"
              />
            </div>
          </div>
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
                It started as a simple idea on the internet. Then it became a movement. ET Coffee Lovers&apos; Association is a digital community celebrating Ethiopia&apos;s thousands of years of coffee heritage.
              </p>
              <p className="font-body text-lg text-muted-foreground mb-6">
                one cup, one ceremony, one coffee at a time.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                From the three rounds of the traditional coffee ceremony —  <span className="font-ethiopic text-foreground font-medium">አቦል፣ ቶና፣ በረካ</span> — to your daily macchiato run, we believe coffee isn&apos;t just a drink. It&apos;s culture. It&apos;s community. It&apos;s home.
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
            <motion.img
              src="/ethiopian-flower.png"
              alt="Ethiopian flower"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 object-contain mx-auto mb-4"
            />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ lineHeight: 1.1 }}>
              Discover Your Buna Personality
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Are you a Ceremony Purist or a Midnight Coffee Coder? Take the quiz and find out your coffee soul.
            </p>
            <Link href="/quiz">
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="btn-clay text-base inline-flex items-center gap-2"
              >
                Take the Quiz <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Coffee Regions - Removed, now on /map page */}


      {/* Sponsors & Contributors */}
      <section className="py-24 border-t border-border/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Founder Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="ceramic-surface p-8 flex flex-col items-center text-center"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-4 gold-ring">
                <Image 
                  src="/founderr.jpg" 
                  alt="Amos Abraham" 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="font-display text-accent text-[10px] uppercase tracking-widest mb-2 font-bold">Founder</h3>
              <p className="font-display text-xl font-bold text-foreground mb-2">Amos Abraham</p>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                Psychologist & coffee lover, connecting people through cultural storytelling.
              </p>
            </motion.div>

            {/* Developer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="ceramic-surface p-8 flex flex-col items-center text-center"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-4 gold-ring">
                <Image 
                  src="/pulse.png" 
                  alt="PulseLabs Developer" 
                  fill 
                  className="object-cover"
                  onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <h3 className="font-display text-accent text-[10px] uppercase tracking-widest mb-2 font-bold">Developer</h3>
              <p className="font-display text-xl font-bold text-foreground mb-2">PulseLabs</p>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                Digital marketing and modern web design solutions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto border border-dashed border-border rounded-2xl p-10 text-center bg-secondary/10 backdrop-blur-sm">
            <p className="font-display text-xl font-bold text-foreground mb-6">📢 Advertise Your Brand Here</p>
            <p className="font-body text-sm text-muted-foreground mb-8">Reach the vibrant Ethiopian coffee community and grow your brand.</p>
            <Link href="https://t.me/ze_abrham" target="_blank">
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="btn-clay text-sm"
              >
                Advertise with Us
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
