import React, { useState, useEffect } from "react";
import { Clock, ChevronRight } from "lucide-react";

// Countdown Banner Component
export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-09-27T23:59:59');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCtaClick = (e) => {
    // Scroll to top when navigating to checkout page
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="sticky top-0 z-50 bg-[var(--fa-orange)] text-white py-1 sm:py-2 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--fa-orange)] via-[var(--fa-orange-600)] to-[var(--fa-orange)]" />
      <div className="relative mx-auto max-w-7xl">
        {/* Mobile Layout - Logo and content on same level */}
        <div className="flex items-center justify-between sm:hidden gap-2">
          {/* Logo on the left */}
          <div className="flex-shrink-0 relative -my-2">
            <img
              src="/assets/fitactive/logo.png"
              alt="FitActive Logo"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Countdown and CTA on the right */}
          <div className="flex flex-col items-center justify-center gap-1 text-center flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="font-semibold text-xs">Oferta se termină în:</span>
            </div>

            <div className="flex items-center gap-0.5 text-xs">
              <div className="flex items-center gap-0.5">
                <span className="text-sm font-bold">{timeLeft.days}</span>
                <span className="text-xs">zile</span>
              </div>
              <span className="text-xs font-bold">:</span>
              <div className="flex items-center gap-0.5">
                <span className="text-sm font-bold">{timeLeft.hours}</span>
                <span className="text-xs">ore</span>
              </div>
              <span className="text-xs font-bold">:</span>
              <div className="flex items-center gap-0.5">
                <span className="text-sm font-bold">{timeLeft.minutes}</span>
                <span className="text-xs">min</span>
              </div>
              <span className="text-xs font-bold">:</span>
              <div className="flex items-center gap-0.5">
                <span className="text-sm font-bold">{timeLeft.seconds}</span>
                <span className="text-xs">sec</span>
              </div>
            </div>

            <a
              href="#comanda"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-[var(--fa-ral-9011)] text-white font-semibold shadow hover:bg-[var(--fa-ral-9011)]/80 transition text-xs"
            >
              Profită de oferta de presale
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Desktop Layout - Logo on left, content in center */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Logo on the left */}
          <div className="flex-shrink-0 flex items-center relative -my-2 sm:-my-3">
            <img
              src="/assets/fitactive/logo.png"
              alt="FitActive Logo"
              className="h-24 lg:h-24 xl:h-26 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Center content - countdown and CTA */}
          <div className="flex flex-row items-center justify-center gap-4 text-center flex-1">
            <div className="flex items-center gap-2">
              <Clock className="w-5 sm:h-5" />
              <span className="font-semibold text-base lg:text-lg">Oferta se termină în:</span>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <div className="flex items-center gap-1">
                <span className="text-2xl lg:text-3xl font-bold">{timeLeft.days}</span>
                <span className="text-sm lg:text-base">zile</span>
              </div>
              <span className="text-xl font-bold">:</span>
              <div className="flex items-center gap-1">
                <span className="text-2xl lg:text-3xl font-bold">{timeLeft.hours}</span>
                <span className="text-sm lg:text-base">ore</span>
              </div>
              <span className="text-xl font-bold">:</span>
              <div className="flex items-center gap-1">
                <span className="text-2xl lg:text-3xl font-bold">{timeLeft.minutes}</span>
                <span className="text-sm lg:text-base">min</span>
              </div>
              <span className="text-xl font-bold">:</span>
              <div className="flex items-center gap-1">
                <span className="text-2xl lg:text-3xl font-bold">{timeLeft.seconds}</span>
                <span className="text-sm lg:text-base">sec</span>
              </div>
            </div>

            <a
              href="#comanda"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-[var(--fa-ral-9011)] text-white font-semibold shadow hover:bg-[var(--fa-ral-9011)]/80 transition text-base lg:text-lg"
            >
              Profită de oferta de presale
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Right spacer to balance the logo */}
          <div className="flex-shrink-0 w-6 sm:w-8"></div>
        </div>
      </div>
    </div>
  );
}
