
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  Star,
  HeartPulse,
  Dumbbell,
  Target,
  ChevronRight,
  Building2,
  BadgeCheck,
  ChevronLeft,
  CreditCard,
  Receipt,
  User,
  Menu,
  X,
  Clock,
  Clock3,
  Users,
  Stethoscope,
  Zap,
  Calendar,
  Sun,
  Coffee,
  Smile,
  Battery,
} from "lucide-react";

// Config prețuri
const FULL_PRICE = 3098.80;
const SALE_PRICE = 1448.80;
const MONTHLY_PRICE = 99.90;

function formatPrice(value) {
  try {
    return value.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    return value.toFixed(2);
  }
}

// Consistent Price Display Component
function PriceDisplay({
  salePrice,
  fullPrice,
  size = "large",
  alignment = "center",
  showSavings = true,
  showDiscount = true,
  layout = "stacked"
}) {
  const discount = Math.round((1 - salePrice / fullPrice) * 100);
  const savings = fullPrice - salePrice;

  const sizeClasses = {
    small: "text-2xl sm:text-3xl",
    medium: "text-3xl sm:text-4xl lg:text-5xl",
    large: "text-5xl sm:text-6xl lg:text-7xl"
  };

  const alignmentClasses = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right"
  };

  return (
    <div className={`${alignmentClasses[alignment]}`}>
      <p className="text-sm sm:text-xs uppercase tracking-wider text-[var(--fa-orange-600)] font-semibold">Preț promoție</p>

      {/* Price and discount separated into two components */}
      <div className="mt-1 relative">
        {/* Centered price component */}
        <div className="flex flex-wrap items-baseline gap-2 justify-center">
          <p className={`${sizeClasses[size]} font-black bg-gradient-to-r from-[var(--fa-orange)] to-[var(--fa-orange-600)] text-transparent bg-clip-text drop-shadow`}>
            {formatPrice(salePrice)}
          </p>
          <span className="text-lg sm:text-xl font-semibold text-black/60">lei</span>
        </div>

        {/* Right-aligned discount component */}
        {showDiscount && (
          <div className="absolute top-0 right-0 flex justify-end">
            <span className="px-2 py-0.5 rounded bg-[var(--fa-orange)]/10 text-[var(--fa-orange-600)] font-extrabold text-base sm:text-lg">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      <p className="mt-0.5 text-base sm:text-sm text-black/50">
        Preț întreg: <span className="font-extrabold"><s>{formatPrice(fullPrice)} lei</s></span>
      </p>
      {showSavings && (
        <p className="text-sm sm:text-base font-semibold text-[var(--fa-orange-600)]">
          Economisești {formatPrice(savings)} lei
        </p>
      )}
    </div>
  );
}

// Price Summary Component for Checkout
function PriceSummary({ salePrice, fullPrice }) {
  const discount = Math.round((1 - salePrice / fullPrice) * 100);
  const savings = fullPrice - salePrice;

  return (
    <div className="mt-4 space-y-2 text-base sm:text-sm">
      <div className="flex items-center justify-between">
        <span>Abonament All Inclusive</span>
        <span className="font-black bg-gradient-to-r from-[var(--fa-orange)] to-[var(--fa-orange-600)] text-transparent bg-clip-text">
          {formatPrice(salePrice)} lei
        </span>
      </div>
      <div className="flex items-center justify-between text-black/70">
        <span>Preț întreg</span>
        <span className="font-extrabold"><s>{formatPrice(fullPrice)} lei</s></span>
      </div>
      <div className="flex items-center justify-between text-black/70">
        <span>Reducere</span>
        <span className="font-extrabold text-[var(--fa-orange-600)]">-{discount}%</span>
      </div>
      <div className="flex items-center justify-between text-black/70">
        <span>Economisești</span>
        <span className="font-extrabold text-[var(--fa-orange-600)]">{formatPrice(savings)} lei</span>
      </div>
    </div>
  );
}

// Countdown Banner Component
function CountdownBanner() {
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

  return (
    <div className="sticky top-0 z-50 bg-[var(--fa-orange)] text-white py-3 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--fa-orange)] via-[var(--fa-orange-600)] to-[var(--fa-orange)]" />
      <div className="relative mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-semibold text-base sm:text-lg">Oferta se termină în:</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <span className="text-2xl sm:text-3xl font-bold">{timeLeft.days}</span>
            <span className="text-sm sm:text-base">zile</span>
          </div>
          <span className="text-xl font-bold">:</span>
          <div className="flex items-center gap-1">
            <span className="text-2xl sm:text-3xl font-bold">{timeLeft.hours}</span>
            <span className="text-sm sm:text-base">ore</span>
          </div>
          <span className="text-xl font-bold">:</span>
          <div className="flex items-center gap-1">
            <span className="text-2xl sm:text-3xl font-bold">{timeLeft.minutes}</span>
            <span className="text-sm sm:text-base">min</span>
          </div>
          <span className="text-xl font-bold">:</span>
          <div className="flex items-center gap-1">
            <span className="text-2xl sm:text-3xl font-bold">{timeLeft.seconds}</span>
            <span className="text-sm sm:text-base">sec</span>
          </div>
        </div>

        <a
          href="#comanda"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-black text-white font-semibold shadow hover:bg-gray-800 transition text-base sm:text-lg"
        >
          Profită de oferta de Presales
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

// Grid cu lightbox pentru galerie (aspect ratio fix)
function ImageGrid({ images }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  if (!images?.length) return null;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img, i) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              setSrc(img);
              setOpen(true);
            }}
            className="group relative rounded-xl overflow-hidden bg-black/5 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] focus:ring-offset-2"
          >
            <img
              src={img}
              alt={`Galerie imagine ${i + 1}`}
              className="w-full h-full object-cover"
              style={{ aspectRatio: "4 / 3" }}
              loading="lazy"
            />
            <span className="absolute inset-0 ring-1 ring-black/5 group-hover:ring-[var(--fa-orange)]/40 transition-all duration-200" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full transition-opacity duration-200">
                Vezi imagine
              </span>
            </div>
          </button>
        ))}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 p-4 flex items-center justify-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Previzualizare imagine"
        >
          <div className="relative max-w-[92vw] max-h-[92vh]">
            <img
              src={src}
              alt="Previzualizare"
              className="max-w-full max-h-full rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Închide previzualizarea"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Grid cu lightbox pentru feedback (imagini la dimensiune naturală)
function FeedbackImageGrid({ images }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  if (!images?.length) return null;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img, i) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              setSrc(img);
              setOpen(true);
            }}
            className="group relative rounded-xl overflow-hidden bg-black/5 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] focus:ring-offset-2"
          >
            <img
              src={img}
              alt={`Feedback imagine ${i + 1}`}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
            <span className="absolute inset-0 ring-1 ring-black/5 group-hover:ring-[var(--fa-orange)]/40 transition-all duration-200" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full transition-opacity duration-200">
                Vezi imagine
              </span>
            </div>
          </button>
        ))}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 p-4 flex items-center justify-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Previzualizare imagine"
        >
          <div className="relative max-w-[92vw] max-h-[92vh]">
            <img
              src={src}
              alt="Previzualizare"
              className="max-w-full max-h-full rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Închide previzualizarea"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Căi imagini
const heroImages = [
  "/assets/fitactive/1.jpg",
  "/assets/fitactive/2.jpg",
  "/assets/fitactive/3.jpg",
  "/assets/fitactive/4.jpeg",
  "/assets/fitactive/5.jpg",
  "/assets/fitactive/6.jpg",
  "/assets/fitactive/7.jpg",
  "/assets/fitactive/8.jpg",
  "/assets/fitactive/9.jpeg",
  "/assets/fitactive/10.jpg",
];

const feedbackImages = [
  "/assets/feedback/feedback1.png",
  "/assets/feedback/feedback2.jpg",
  "/assets/feedback/feedback3.jpg",
  "/assets/feedback/feedback4.jpg",
  "/assets/feedback/feedback5.jpg",
  "/assets/feedback/feedback7.jpg"
];
const galleryImages = [
  "/assets/galerie/fitActive-14.jpg",
  "/assets/galerie/fitActive-72.jpg",
  "/assets/galerie/fitActive-84.jpg",
  "/assets/galerie/fitActive.jpg"
];

// Router pe hash (#comanda, #thank-you)
function useHashRoute() {
  const [route, setRoute] = useState({ page: "home", params: {} });
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash || "";
      const [h, q] = hash.split("?");
      const params = new URLSearchParams(q || "");
      if (h === "#comanda") setRoute({ page: "comanda", params: Object.fromEntries(params) });
      else if (h === "#thank-you") setRoute({ page: "thankyou", params: Object.fromEntries(params) });
      else setRoute({ page: "home", params: {} });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);
  return route;
}

export default function FitActivePresalesApp() {
  const { page, params } = useHashRoute();
  const [spotsLeft] = useState(100);
  const discount = useMemo(() => Math.round((1 - SALE_PRICE / FULL_PRICE) * 100), []);
  const ctaText = `Profită de oferta de Presales — ${formatPrice(MONTHLY_PRICE)} lei/lună`;

  return (
    <div className="min-h-screen bg-[var(--fa-light)] text-[var(--fa-dark)]">
      <style>{`
        :root{ --fa-orange:#F7931E; --fa-orange-600:#E8770C; --fa-dark:#111111; --fa-gray:#1F2937; --fa-light:#F8FAFC; --fa-white:#FFFFFF; }
      `}</style>

      {page === "home" && <Landing spotsLeft={spotsLeft} discount={discount} ctaText={ctaText} />}
      {page === "comanda" && <CheckoutPage discount={discount} ctaText={ctaText} />}
      {page === "thankyou" && <ThankYouPage orderID={params.order} />}
    </div>
  );
}

function Landing({ spotsLeft, discount, ctaText }) {
  return (
    <>


      {/* COUNTDOWN BANNER */}
      <CountdownBanner />

      {/* TRUST BAR */}
      <div className="bg-[var(--fa-gray)] text-white text-sm sm:text-base">
        <div className="mx-auto max-w-7xl px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-center">
          <p className="py-1">✓ Acces 24/7</p>
          <p className="py-1">✓ Plan personalizat 1-la-1</p>
          <p className="py-1">✓ Consult osteopat gratuit</p>
          <p className="py-1">✓ Analiza corporală gratuit</p>
        </div>
      </div>

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[var(--fa-light)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="py-8 sm:py-12 lg:py-20 relative">
          <div className="space-y-8">
            {/* Header content spanning full width */}
            <div className="w-full px-4 text-center">
              <div className="mx-auto max-w-7xl">
                <span className="inline-flex items-center gap-2 text-sm sm:text-base uppercase tracking-wider bg-[var(--fa-orange)]/10 text-[var(--fa-orange-600)] font-semibold px-3 py-1 rounded-xl mb-4">Pre-sale • Preț redus <strong>doar pentru primele 100 locuri</strong></span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight w-full">
                FITACTIVE — pre-sale activ la București Vitan!
              </h1>
              <div className="mx-auto max-w-7xl">
                <p className="mt-4 text-lg sm:text-xl text-black/70 max-w-none lg:max-w-4xl mx-auto">
                  24/7, planuri personalizate și tot ce-ți trebuie pentru a-ți atinge obiectivul. <strong>Antrenează fericirea</strong> cu oferta All Inclusive redusă masiv pentru lansare.
                </p>
              </div>
            </div>

            {/* Price card and image aligned */}
            <div className="mx-auto max-w-7xl px-4">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
              {/* Promo Card */}
              <div className="pt-3 pb-6 px-6 rounded-3xl bg-white shadow-xl border border-black/5 relative overflow-hidden flex flex-col">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-full">
                    <PriceDisplay
                      salePrice={SALE_PRICE}
                      fullPrice={FULL_PRICE}
                      size="large"
                      alignment="right"
                      showSavings={true}
                      showDiscount={true}
                    />
                    <p className="text-sm sm:text-xs text-black/50 mt-0.5 text-center">Valabil doar pentru primele 100 de persoane</p>
                  </div>
                  <div className="w-full">
                    <a href="#comanda" className="inline-flex items-center gap-2 rounded-2xl px-4 sm:px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">
                      {ctaText}
                    </a>
                  </div>
                </div>
                <div className="hidden lg:block absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[var(--fa-orange)]/10" />
                <div className="mt-3 pt-2 border-t border-black/10 text-center">
                  <p className="text-sm sm:text-xs leading-tight text-black/70"><span className="font-semibold">Beneficii incluse:</span> Acces 24/7 | 1-la-1 cu antrenori dedicați & consult osteopat gratuit | Analiză compoziție corporală | Clase variate & aparate moderne într-un spațiu de 1200 mp | Solar & masaj incluse | 18 ani de experiență</p>
                </div>
              </div>

              {/* Image aligned with price card */}
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }} className="relative h-full">
                <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden border border-black/5 shadow-xl bg-[#f3f5f9] h-full flex items-center justify-center">
                  <img
                    src="/assets/fitactive/presales.png"
                    alt="FitActive Vitan Presales"
                    className="max-w-full max-h-full object-contain"
                    loading="eager"
                  />
                </div>
              </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* BENEFICII */}
      <section id="beneficii" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Beneficii</h2>
          <p className="mt-2 text-base sm:text-lg text-black/70">„Fitness per tutti” nu e doar un motto — e o promisiune.</p>
        </div>
        {/* Single Benefits Card */}
        <div className="mt-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-white shadow-lg border border-black/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7"/>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Beneficii incluse în abonament</h3>
            </div>

            <ul className="space-y-4 text-gray-700 text-base sm:text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[var(--fa-orange-600)] flex items-center justify-center flex-shrink-0">
                  <Clock3 className="w-4 h-4"/>
                </div>
                <div>
                  <span className="font-semibold">Acces 24/7</span> la o sală mare <span className="font-semibold">(1000+ mp)</span>, aerisită, cu <span className="font-semibold">aparate moderne și noi</span>, fără cozi, cu <span className="font-semibold">curățenie și igienă zilnică</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[var(--fa-orange-600)] flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4"/>
                </div>
                <div>
                  <span className="font-semibold">Antrenori dedicați 1-la-1</span> – folosesc <span className="font-semibold">analiza corporală aprofundată</span> și <span className="font-semibold">recomandările osteopatului</span> (incluse gratuit) pentru <span className="font-semibold">obiective clare și rezultate rapide</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[var(--fa-orange-600)] flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-4 h-4"/>
                </div>
                <div>
                  <span className="font-semibold">Energie și recuperare optimă</span> cu băuturi gratuite, scaun de masaj și evaluare <span className="font-semibold">posturală</span> realizată de un <span className="font-semibold">osteopat</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[var(--fa-orange-600)] flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4"/>
                </div>
                <div>
                  <span className="font-semibold">Programe variate:</span> forță, cardio și clase de grup – ca să nu te plictisești niciodată
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[var(--fa-orange-600)] flex items-center justify-center flex-shrink-0">
                  <Sun className="w-4 h-4"/>
                </div>
                <div>
                  <span className="font-semibold">Solar gratuit</span> și <span className="font-semibold">platformă vibrantă</span> pentru un look impecabil, corp tonifiat și reducerea celulitei
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[var(--fa-orange-600)] flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-4 h-4"/>
                </div>
                <div>
                  <span className="font-semibold">Spațiu de relaxare generos,</span> unde te bucuri de o băutură rece și de prietenii tăi
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[var(--fa-orange-600)] flex items-center justify-center flex-shrink-0">
                  <Smile className="w-4 h-4"/>
                </div>
                <div>
                  <span className="font-semibold">Te simți bine în pielea ta</span> – intri în hainele preferate și radiezi încredere
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[var(--fa-orange-600)] flex items-center justify-center flex-shrink-0">
                  <Battery className="w-4 h-4"/>
                </div>
                <div>
                  <span className="font-semibold">Ai energie pentru copii, prieteni și o viață activă,</span> lăsând stresul în urmă
                </div>
              </li>
            </ul>
          </div>
        </div>
          <div className="mt-8 text-center sm:text-left">
            <a href="#comanda" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">{ctaText}</a>
          </div>
        </div>
      </section>

      {/* GARANȚII */}
      <section id="garantii" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Garanții</h2>
            <p className="mt-2 text-base sm:text-lg text-black/70">Rezultate reale și siguranță în antrenamente.</p>
          </div>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              { icon: <BadgeCheck className="w-6 h-6"/>, title: "Deschidere 100% sau bani înapoi", desc: "Dacă sala nu se deschide, primești integral banii înapoi." },
              { icon: <ShieldCheck className="w-6 h-6"/>, title: "Asigurare răspundere civilă", desc: "Ești protejat pentru eventuale daune în cadrul sălii." },
              { icon: <CheckCircle2 className="w-6 h-6"/>, title: "Implicare reală", desc: "Îți urmărim progresul și venim cu propuneri pentru motivație constantă." },
              { icon: <Star className="w-6 h-6"/>, title: "18 ani experiență", desc: "Mii de clienți mulțumiți, peste 150 cluburi deschise." },
            ].map((g, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[var(--fa-light)] shadow border border-black/5">
                <div className="w-10 h-10 rounded-xl bg-[var(--fa-orange)]/10 text-[var(--fa-orange-600)] flex items-center justify-center mb-3">
                  {g.icon}
                </div>
                <h3 className="font-semibold text-xl sm:text-lg">{g.title}</h3>
                <p className="mt-1 text-base sm:text-sm text-black/60">{g.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-[var(--fa-orange)]/10 border border-[var(--fa-orange)]/20 text-base sm:text-sm">
            <p><strong>Notă:</strong> Abonamentul <strong>începe la data deschiderii sălii</strong> — nu pierzi nimic până atunci.</p>
          </div>
          <div className="mt-8">
            <a href="#comanda" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">{ctaText}</a>
          </div>
        </div>
      </section>

      {/* CUM FUNCȚIONEAZĂ */}
      <section className="bg-[var(--fa-light)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="max-w-2xl mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Cum funcționează</h2>
            <p className="mt-2 text-base sm:text-lg text-black/70">Procesul simplu în 3 pași pentru a începe antrenamentele.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Alegi All Inclusive", desc: "Activezi oferta de presales pentru locurile disponibile." },
            { step: "2", title: "Evaluare + plan personalizat", desc: "Analiză corporală, consult osteopat și program dedicat." },
            { step: "3", title: "Te antrenezi 24/7", desc: "Urmezi planul și urmărești progresul în aplicație." },
          ].map((s, i) => (
            <div key={i} className="p-4 sm:p-6 rounded-2xl bg-white shadow border border-black/5 hover:shadow-lg transition-shadow text-center sm:text-left">
              <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-xl bg-[var(--fa-orange)]/10 text-[var(--fa-orange-600)] flex items-center justify-center font-bold text-xl sm:text-lg mx-auto sm:mx-0">{s.step}</div>
              <h3 className="mt-3 font-semibold text-lg sm:text-xl">{s.title}</h3>
              <p className="mt-1 text-base sm:text-sm text-black/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
          </div>
          <div className="mt-8 text-center sm:text-left">
            <a href="#comanda" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">{ctaText}</a>
          </div>
        </div>
      </section>

      {/* PREȚ */}
      <section id="pret" className="bg-[var(--fa-light)]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Oferta Presales (primele 100)</h2>
            <p className="mt-2 text-base sm:text-lg text-black/70">All Inclusive – reducere {discount}%</p>
          </div>

          <div className="mt-8">
            {/* Plan All Inclusive */}
            <div className="p-6 rounded-3xl bg-white shadow-xl border border-black/5 relative overflow-hidden flex flex-col">
              <div className="hidden lg:block absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[var(--fa-orange)]/10" />
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 flex-1">
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-bold">All Inclusive</h3>
                  <p className="text-base sm:text-sm text-black/60">Acces complet la clubul FitActive Vitan, 24/7</p>
                  <ul className="mt-4 space-y-2 text-base sm:text-sm">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Plan personalizat + reevaluări periodice</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Cursuri de grup incluse</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Zone: forță, cardio, funcțional, stretching</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Solar, băuturi & masaj incluse</li>
                  </ul>
                </div>
                <div className="text-center lg:text-right">
                  <PriceDisplay
                    salePrice={SALE_PRICE}
                    fullPrice={FULL_PRICE}
                    size="large"
                    alignment="right"
                    showSavings={true}
                    showDiscount={true}
                  />
                  <a href="#comanda" className="mt-4 inline-flex items-center gap-2 rounded-2xl px-4 sm:px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">
                    {ctaText}
                  </a>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/10">
                <p className="text-sm sm:text-xs text-black/50">Oferta este limitată la primele 100 de persoane. După epuizare, prețul revine la {formatPrice(FULL_PRICE)} lei.</p>
              </div>
            </div>

            {/* Testimoniale */}
            <div className="p-4 sm:p-6 rounded-3xl bg-white shadow border border-black/5 flex flex-col">
              <h4 className="font-semibold text-lg sm:text-base">Testimoniale</h4>
              <div className="mt-4 space-y-4 text-base sm:text-sm flex-1">
                <blockquote className="p-4 bg-[var(--fa-light)] rounded-2xl">„Mi-am făcut program fix pe obiective. Rezultate vizibile în 6 săptămâni.” — Andrei</blockquote>
                <blockquote className="p-4 bg-[var(--fa-light)] rounded-2xl">„Cursurile de grup m-au ținut motivată. Pot veni și seara târziu.” — Ioana</blockquote>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <a href="#comanda" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">{ctaText}</a>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section id="feedback" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Feedback</h2>
            <p className="mt-2 text-base sm:text-lg text-black/70">Recenzii, mesaje, rezultate trimise de clienții sălilor noastre</p>
          </div>
          <div className="mt-8">
            <FeedbackImageGrid images={feedbackImages} />
          </div>
          <div className="mt-6 text-center sm:text-left">
            <a href="#comanda" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">{ctaText}</a>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <section id="galerie" className="bg-[var(--fa-light)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Galerie</h2>
            <p className="mt-2 text-base sm:text-lg text-black/70">Cum va arăta sala: zone forță, cardio, clase, vestiare, recepție.</p>
          </div>
          <div className="mt-8">
            <ImageGrid images={galleryImages} />
          </div>
          <div className="mt-6 text-center sm:text-left">
            <a href="#comanda" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">{ctaText}</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Întrebări frecvente</h2>
            <p className="mt-2 text-base sm:text-lg text-black/70">Dacă ai alte întrebări, scrie-ne — îți răspundem rapid.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[
            { q: "Cum accesez 24/7?", a: "Prin aplicația FitActive, primești acces digital în club." },
            { q: "Ce înseamnă plan personalizat?", a: "Evaluare inițială + program adaptat obiectivelor și nivelului tău." },
            { q: "Pot îngheța abonamentul?", a: "Da, în situații medicale (conform politicilor interne)." },
            { q: "Câte locuri are oferta?", a: "Oferta este limitată la primele 100 de persoane." },
          ].map((item, i) => (
            <div key={i} className="p-4 sm:p-6 rounded-2xl bg-gray-50 shadow border border-black/5 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg sm:text-xl">{item.q}</h3>
              <p className="mt-1 text-base sm:text-sm text-black/60 leading-relaxed">{item.a}</p>
            </div>
          ))}
          </div>
          <div className="mt-8 text-center sm:text-left">
            <a href="#comanda" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">{ctaText}</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--fa-gray)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[var(--fa-orange)]" />
              <span className="font-bold">FitActive Vitan</span>
            </div>
            <p className="mt-3 text-base sm:text-sm text-white/70">Primul brand de fitness din Italia extins în România. Deschis 24/7.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg sm:text-base">Companie</h4>
            <ul className="mt-3 space-y-2 text-base sm:text-sm text-white/70">
              <li><a href="#beneficii" className="hover:text-white">Beneficii</a></li>
              <li><a href="#garantii" className="hover:text-white">Garanții</a></li>
              <li><a href="#feedback" className="hover:text-white">Feedback</a></li>
              <li><a href="#galerie" className="hover:text-white">Galerie</a></li>
              <li><a href="#pret" className="hover:text-white">Preț</a></li>
              <li><a href="#comanda" className="hover:text-white">Activare</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg sm:text-base">Contact</h4>
            <ul className="mt-3 space-y-2 text-base sm:text-sm text-white/70">
              <li>Adresa: București, Vitan</li>
              <li>Email: contact@fitactive.ro</li>
              <li>Telefon: 07xx xxx xxx</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg sm:text-base">Legal</h4>
            <ul className="mt-3 space-y-2 text-base sm:text-sm text-white/70">
              <li><a href="#" className="hover:text-white">Termeni & Condiții</a></li>
              <li><a href="#" className="hover:text-white">Politica de confidențialitate</a></li>
              <li><a href="#" className="hover:text-white">Politica cookie</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-4 text-sm sm:text-xs text-white/60 flex items-center justify-between">
            <span>© {new Date().getFullYear()} FitActive. Toate drepturile rezervate.</span>
            <span>Motto: Fitness per tutti · Antrenează fericirea</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function CheckoutPage({ discount, ctaText }) {
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    zip: "",
    company: false,
    companyName: "",
    cui: "",
    regCom: "",
    companyAddress: "",
  });

  const onChange = (key) => (e) => setBilling((s) => ({ ...s, [key]: e.target.value }));

  async function handleCheckout(e) {
    e.preventDefault();
    setError("");
    setOk("");

    if (!agree) {
      setError("Te rugăm să accepți termenii și politica de confidențialitate.");
      return;
    }

    try {
      setBusy(true);
      const orderID = `FA-${Date.now()}`;
      const payload = {
        order: {
          description: "Abonament All Inclusive (Presales) — FitActive Vitan",
          orderID,
          amount: SALE_PRICE,
          currency: "RON",
          products: [{ name: "Abonament All Inclusive Presales", price: SALE_PRICE, vat: 19 }],
        },
        billing: {
          firstName: billing.firstName,
          lastName: billing.lastName,
          email: billing.email,
          phone: billing.phone,
          city: billing.city,
          state: billing.county,
          postalCode: billing.zip,
          details: billing.address,
          country: 642,
        },
        company: billing.company
          ? {
              name: billing.companyName,
              vatCode: billing.cui,
              regCom: billing.regCom,
              address: billing.companyAddress || billing.address,
            }
          : null,
      };

      const res = await fetch("/api/netopia/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Eroare pornire plată. Încearcă din nou.");
      const data = await res.json();

      // salvăm orderID local (fallback) pentru thank-you
      sessionStorage.setItem("fa_last_order", orderID);

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; // pagina NETOPIA / 3DS
        return;
      }

      if (data.success) {
        setOk("Plata a fost confirmată. Îți emitem factura și o trimitem pe email.");
        window.location.href = `#thank-you?order=${encodeURIComponent(orderID)}`;
      } else {
        throw new Error(data.message || "Plata nu a fost finalizată.");
      }
    } catch (err) {
      setError(err.message || "A apărut o eroare la procesarea comenzii.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur bg-white/90 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="#" className="inline-flex items-center gap-2 text-sm hover:text-[var(--fa-orange)] transition">
            <ChevronLeft className="w-4 h-4"/>
            <span className="hidden sm:inline">Înapoi la ofertă</span>
            <span className="sm:hidden">Înapoi</span>
          </a>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--fa-orange)]" />
            <span className="font-bold text-sm sm:text-base">FitActive Vitan</span>
          </div>
          <button disabled className="hidden sm:inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-[var(--fa-orange)]/50 text-white font-semibold shadow cursor-not-allowed text-sm">
            Finalizează comanda
          </button>
        </div>
      </nav>

      <header className="bg-gradient-to-b from-white via-white to-[var(--fa-light)]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-10">
          <span className="inline-flex items-center gap-2 text-sm sm:text-base uppercase tracking-wider bg-[var(--fa-orange)]/10 text-[var(--fa-orange-600)] font-semibold px-3 py-1 rounded-xl mb-3">Presales</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            FELICITĂRI! Finalizează acum comanda și bucură-te de <span className="text-[var(--fa-orange-600)]">50% Reducere</span>.
          </h1>
          <p className="mt-2 text-base sm:text-lg text-black/70">Completează datele, verifică serviciile incluse și plasează comanda în siguranță.</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <section className="p-4 sm:p-6 rounded-2xl bg-white shadow border border-black/5">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[var(--fa-orange-600)]"/>
              <h2 className="font-semibold text-lg sm:text-xl">Servicii incluse în All Inclusive</h2>
            </div>
            <ul className="mt-4 grid md:grid-cols-2 gap-y-2 text-base sm:text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Acces 24/7 la sală</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Plan personalizat + reevaluări</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Analiză corporală inițială</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Consult osteopat gratuit</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Clase de grup incluse</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Zone: forță, cardio, funcțional, stretching</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Solar, băuturi & masaj incluse</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--fa-orange-600)]"/> Răscumpărare la o sală existentă</li>
            </ul>
          </section>

          <section className="p-4 sm:p-6 rounded-2xl bg-white shadow border border-black/5">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--fa-orange-600)]"/>
              <h2 className="font-semibold text-lg sm:text-xl">Lasă datele de facturare</h2>
            </div>
            <form className="mt-4 grid grid-cols-1 gap-4" onSubmit={handleCheckout}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-1">Nume</label>
                  <input
                    required
                    value={billing.lastName}
                    onChange={onChange('lastName')}
                    className="w-full rounded-xl border border-black/10 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base"
                    placeholder="Introduceți numele"
                  />
                </div>
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-1">Prenume</label>
                  <input
                    required
                    value={billing.firstName}
                    onChange={onChange('firstName')}
                    className="w-full rounded-xl border border-black/10 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base"
                    placeholder="Introduceți prenumele"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={billing.email}
                    onChange={onChange('email')}
                    className="w-full rounded-xl border border-black/10 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base"
                    placeholder="exemplu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-1">Telefon</label>
                  <input
                    type="tel"
                    required
                    value={billing.phone}
                    onChange={onChange('phone')}
                    className="w-full rounded-xl border border-black/10 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base"
                    placeholder="0712345678"
                  />
                </div>
              </div>
              <div>
                <label className="block text-base sm:text-sm font-medium mb-1">Adresă</label>
                <input
                  value={billing.address}
                  onChange={onChange('address')}
                  className="w-full rounded-xl border border-black/10 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base"
                  placeholder="Strada, numărul, etc."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-1">Oraș</label>
                  <input
                    value={billing.city}
                    onChange={onChange('city')}
                    className="w-full rounded-xl border border-black/10 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base"
                    placeholder="București"
                  />
                </div>
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-1">Județ</label>
                  <input
                    value={billing.county}
                    onChange={onChange('county')}
                    className="w-full rounded-xl border border-black/10 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base"
                    placeholder="Ilfov"
                  />
                </div>
                <div>
                  <label className="block text-base sm:text-sm font-medium mb-1">Cod poștal</label>
                  <input
                    value={billing.zip}
                    onChange={onChange('zip')}
                    className="w-full rounded-xl border border-black/10 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base"
                    placeholder="123456"
                  />
                </div>
              </div>

              <details className="mt-2" onToggle={(e)=> setBilling((s)=>({...s, company: e.target.open}))}>
                <summary className="cursor-pointer text-base sm:text-sm font-semibold">Cumpăr pe firmă</summary>
                <div className="mt-3 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base sm:text-sm font-medium mb-1">Denumire firmă</label>
                    <input value={billing.companyName} onChange={onChange('companyName')} className="w-full rounded-xl border border-black/10 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-base sm:text-sm font-medium mb-1">CUI</label>
                    <input value={billing.cui} onChange={onChange('cui')} className="w-full rounded-xl border border-black/10 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-base sm:text-sm font-medium mb-1">Nr. Reg. Com.</label>
                    <input value={billing.regCom} onChange={onChange('regCom')} className="w-full rounded-xl border border-black/10 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-base sm:text-sm font-medium mb-1">Adresă facturare</label>
                    <input value={billing.companyAddress} onChange={onChange('companyAddress')} className="w-full rounded-xl border border-black/10 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] text-lg sm:text-base" />
                  </div>
                </div>
              </details>

              <div className="mt-2 flex items-center gap-2 text-sm sm:text-xs">
                <input id="agree" type="checkbox" className="w-5 h-5 sm:w-4 sm:h-4" checked={agree} onChange={(e)=> setAgree(e.target.checked)} />
                <label htmlFor="agree">Sunt de acord cu Termenii & Condițiile și Politica de confidențialitate.</label>
              </div>

              {error && <p className="text-base sm:text-sm text-red-600">{error}</p>}
              {ok && <p className="text-base sm:text-sm text-green-600">{ok}</p>}

              <button disabled={busy || !agree} className="mt-2 inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] disabled:opacity-50 disabled:cursor-not-allowed transition text-base sm:text-lg" type="submit">
                {busy ? "Se procesează..." : `Finalizează comanda — ${formatPrice(MONTHLY_PRICE)} lei/lună`}
              </button>
              <p className="text-sm sm:text-xs text-black/50">Plata securizată. După confirmare, primești email cu detaliile contului tău.</p>
            </form>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="p-6 rounded-2xl bg-white shadow border border-black/5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[var(--fa-orange-600)]"/>
              <h3 className="font-semibold text-lg sm:text-base">Rezumat comandă</h3>
            </div>
            <PriceSummary salePrice={SALE_PRICE} fullPrice={FULL_PRICE} />
            <div className="mt-4 border-t border-black/10 pt-4 flex items-center justify-between">
              <span className="font-semibold text-lg sm:text-base">Total</span>
              <span className="text-3xl sm:text-2xl font-black bg-gradient-to-r from-[var(--fa-orange)] to-[var(--fa-orange-600)] text-transparent bg-clip-text">
                {formatPrice(SALE_PRICE)} lei
              </span>
            </div>
            <div className="mt-4 text-sm sm:text-xs text-black/60">Abonamentul începe la data deschiderii sălii.</div>
          </div>
        </aside>
      </main>

      <footer className="bg-[var(--fa-gray)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm sm:text-xs text-white/70 flex items-center justify-between">
          <a href="#" className="hover:text-white">‹ Înapoi la ofertă</a>
          <span>© {new Date().getFullYear()} FitActive</span>
        </div>
      </footer>
    </>
  );
}

function ThankYouPage({ orderID }) {
  const [status, setStatus] = useState("pending");
  const [invoice, setInvoice] = useState(null);
  const safeOrderID = orderID || (typeof window !== 'undefined' && sessionStorage.getItem('fa_last_order')) || "";

  useEffect(() => {
    let t;
    async function tick(){
      if(!safeOrderID) return;
      try{
        const r = await fetch(`/api/order/status?orderID=${encodeURIComponent(safeOrderID)}`);
        const d = await r.json();
        if(d.status){ setStatus(d.status); }
        if(d.invoice){ setInvoice(d.invoice); }
        if(d.status === 'approved' || d.status === 'failed') return; // stop
      }catch{}
      t = setTimeout(tick, 3000);
    }
    tick();
    return () => clearTimeout(t);
  }, [safeOrderID]);

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur bg-white/90 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <span className="font-bold">FitActive Vitan</span>
          <a href="#" className="text-base sm:text-sm hover:text-[var(--fa-orange)]">Înapoi acasă</a>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl sm:text-3xl font-black">Mulțumim! Procesăm plata ta…</h1>
        <p className="mt-2 text-lg sm:text-base text-black/70">Comanda: <span className="font-mono font-semibold">{safeOrderID || 'n/a'}</span></p>

        <div className="mt-6 p-6 rounded-2xl bg-white shadow border border-black/5">
          {status === 'pending' && (
            <>
              <p className="text-base sm:text-sm">Plata este în curs de confirmare. Pagina se actualizează automat.</p>
              <div className="mt-4 h-2 w-full rounded-full bg-black/10 overflow-hidden"><div className="h-full w-1/2 animate-pulse bg-[var(--fa-orange)]"/></div>
            </>
          )}
          {status === 'approved' && (
            <>
              <p className="text-xl sm:text-lg font-semibold text-green-600">Plata confirmată ✅</p>
              <p className="text-base sm:text-sm text-black/70">Ți-am trimis factura pe email. {invoice?.pdfLink && (<a className="text-[var(--fa-orange-600)] font-semibold" href={invoice.pdfLink} target="_blank" rel="noreferrer">Descarcă factura PDF</a>)} </p>
              <a href="#" className="mt-4 inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">Înapoi la ofertă</a>
            </>
          )}
          {status === 'failed' && (
            <>
              <p className="text-xl sm:text-lg font-semibold text-red-600">Plata a eșuat ❌</p>
              <p className="text-base sm:text-sm text-black/70">Încearcă din nou sau contactează-ne.</p>
              <a href="#comanda" className="mt-4 inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg">Reîncearcă plata</a>
            </>
          )}
        </div>
      </main>

      <footer className="bg-[var(--fa-gray)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm sm:text-xs text-white/70 flex items-center justify-between">
          <span>© {new Date().getFullYear()} FitActive</span>
          <span>Fitness per tutti</span>
        </div>
      </footer>
    </>
  );
}
