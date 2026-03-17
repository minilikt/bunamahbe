"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Coffee, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ethiopian-pattern p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="ceramic-surface p-8 md:p-16 max-w-2xl w-full relative overflow-hidden"
      >
        {/* Animated Background Element */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 space-y-8">
          {/* Icon */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-8"
          >
            <Coffee className="w-12 h-12 text-accent" />
          </motion.div>

          {/* Heading */}
          <div className="space-y-2">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-7xl md:text-9xl font-bold text-foreground tracking-tightest"
            >
              404
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-ethiopic font-medium text-foreground"
            >
              ገጹ አልተገኘም
            </motion.p>
          </div>

          {/* Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed"
          >
            It seems the coffee has spilled. The page you are looking for has evaporated into the steam.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/">
              <motion.button
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-mahber w-full sm:w-auto inline-flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Ground
              </motion.button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-gold w-full sm:w-auto inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Cup
            </button>
          </motion.div>
        </div>

        {/* Decorative Flower */}
        <motion.img
          src="/ethiopian-flower.png"
          alt=""
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-10 -left-10 w-32 h-32 opacity-10 pointer-events-none"
        />
      </motion.div>
      
      {/* Footer reference */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="mt-8 text-xs text-foreground uppercase tracking-widest"
      >
        © {new Date().getFullYear()} Buna Association
      </motion.p>
    </div>
  );
}
