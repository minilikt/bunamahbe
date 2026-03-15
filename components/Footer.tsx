import { Coffee, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-5 h-5 text-accent" />
              <span className="font-ethiopic font-bold text-lg">ቡና ጠጪዎች ማህበር</span>
            </div>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              A fun digital association celebrating Ethiopia's rich coffee heritage. From the highlands of Sidama to your morning cup — we're all connected by buna.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-accent">Navigate</h4>
            <div className="flex flex-col gap-2">
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
                  className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors font-body"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-accent">The Movement</h4>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              What started as a fun internet joke became a celebration of Ethiopian coffee culture. Every sip tells a story. Every cup connects a community.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-widest uppercase text-primary-foreground/50 font-body">
            Designed & Built by Amos —
          <Link href="https://abrahammule.vercel.app"> Product Builder</Link>
          </p>
            <p className="text-xs text-primary-foreground/40 font-body flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-clay" /> and lots of coffee
            </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
