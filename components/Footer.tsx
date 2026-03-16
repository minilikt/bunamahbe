"use client"
import { motion } from "framer-motion";
import { Coffee, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/10 text-foreground">
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo-full.png" alt="ቡጠማ Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">
              A fun digital association celebrating Ethiopia&apos;s rich coffee heritage. From the highlands of Sidama to your morning cup — we&apos;re all connected by buna.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-6 text-accent">Navigate</h4>
            <div className="flex flex-col gap-4">
              {[
                { to: "/", label: "Home" },
                { to: "/election", label: "Presidential Election" },
                { to: "/quiz", label: "Coffee Quiz" },
                { to: "/community", label: "Community" },
                { to: "/map", label: "Coffee Map" },
              ].map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-body inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-6 text-accent">The Birthplace of Coffee</h4>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Our journey in pursuit of great coffee starts here, in Ethiopia. The birthplace and home of all coffee varieties in the world.
            </p>
            <div className="mt-8 pt-8 border-t border-border/10 space-y-3">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground/40 font-bold mb-1">Design Credit</p>
                <p className="font-display text-sm font-bold text-muted-foreground">Gabina Creatives</p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground/40 font-bold mb-1">Developed by</p>
                <Link href="https://abrahammule.vercel.app" target="_blank" className="font-display text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
                  PulseLabs <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 pt-10 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* <div className="flex items-center gap-6">
            <Link 
              href="https://youtube.com/@chaluassefa?si=rlBrGxdB3ZDtaXuv" 
              target="_blank"
              className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-xs font-body uppercase tracking-widest font-bold">YouTube</span>
            </Link>
            <Link 
              href="https://www.tiktok.com/@chalu_assefa?_r=1&_t=ZS-94jqPefZJ0E" 
              target="_blank"
              className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14z"/>
              </svg>
              <span className="text-xs font-body uppercase tracking-widest font-bold">TikTok</span>
            </Link>
          </div> */}
          <p className="text-[10px] tracking-tighter uppercase text-muted-foreground/30 font-medium md:ml-auto">
            © {new Date().getFullYear()} ET Coffee Lovers&apos; Association. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40 font-body flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent fill-accent mx-0.5" /> by{" "}
            <Link href="https://Abrahammule.vercel.app" target="_blank" className="hover:text-accent transition-colors ml-1 font-medium">
              Amos
            </Link>
            {" "}and lots of buna
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
