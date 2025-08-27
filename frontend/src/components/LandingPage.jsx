import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Star,
  ChevronRight,
  ChevronDown,
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
  Lock,
  LockOpen,
  PersonStanding,
} from "lucide-react";
import { PriceDisplay } from "./PriceDisplay";
import { CountdownBanner } from "./CountdownBanner";
import { ImageGrid, FeedbackImageGrid } from "./ImageGrid";
import { ImageCarousel } from "./ImageCarousel";
import { CTAButton } from "./CTAButton";

// Image paths
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

const allInclusiveImages = [
  "/assets/fitactive/1.jpg",
  "/assets/fitactive/2.jpg",
  "/assets/fitactive/3.jpg",
  "/assets/fitactive/4.jpg",
  "/assets/fitactive/5.jpg",
  "/assets/fitactive/6.jpg",
  "/assets/fitactive/7.jpg"
];

const proPackImages = [
  "/assets/fitactive/8.jpg",
  "/assets/fitactive/9.jpg",
  "/assets/fitactive/10.jpg"
];

// Config prețuri
const FULL_PRICE = 3098.80;
const SALE_PRICE = 1448.80;

function formatPrice(value) {
  try {
    return value.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    return value.toFixed(2);
  }
}

export function LandingPage({ spotsLeft, discount, ctaText }) {
  const [openFaqItems, setOpenFaqItems] = useState(new Set());

  const toggleFaqItem = (index) => {
    const newOpenItems = new Set(openFaqItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenFaqItems(newOpenItems);
  };

  return (
    <>
      {/* COUNTDOWN BANNER */}
      <CountdownBanner />

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="py-3 sm:py-4 lg:py-6 relative">
          <div className="space-y-3 sm:space-y-4">
            {/* Header content spanning full width */}
            <div className="w-full px-4 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight w-full py-4 sm:py-10 lg:py-12">
                Fit<span style={{ color: 'var(--fa-ral-2011)' }}>Active</span> București Vitan - presale deschis!
              </h1>
            </div>

            {/* Video and Price card on the same row */}
            <div className="mx-auto max-w-7xl px-4">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                {/* Left Column - Video */}
                <div className="w-full">
                  <video
                    className="w-full h-full rounded-3xl shadow-xl object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/assets/fitactive/gym-spot3-poster.jpg"
                  >
                    <source src="/assets/fitactive/gym-spot3-optimized.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Right Column - Price Card */}
              {/* Promo Card - New Design */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--fa-ral-9011)] shadow-xl relative overflow-hidden">
                {/* Price Section */}
                <div className="mb-5">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    {/* Doar primii 100! text above price - Mobile */}
                    <div className="mb-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--fa-orange)' }}>
                        Doar primii 100!
                      </span>
                    </div>
                    {/* Price line - larger to fill card width */}
                    <div className="flex items-baseline gap-1 mb-2 whitespace-nowrap">
                      <span className="text-4xl sm:text-5xl font-black text-white">{formatPrice(SALE_PRICE)}</span>
                      <span className="text-lg sm:text-xl font-semibold text-white">lei</span>
                      <span className="text-base sm:text-lg font-semibold text-white/60 line-through decoration-white/70 decoration-2">
                        {formatPrice(FULL_PRICE)} lei
                      </span>
                    </div>
                    {/* Savings badge on separate line */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-lg bg-green-600 text-white font-bold text-sm whitespace-nowrap">
                        Economisești {Math.round((1 - SALE_PRICE / FULL_PRICE) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    {/* Doar primii 100! text above price - Desktop */}
                    <div className="mb-2">
                      <span className="text-base font-bold" style={{ color: 'var(--fa-orange)' }}>
                        Doar primii 100!
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl lg:text-6xl font-black text-white">{formatPrice(SALE_PRICE)}</span>
                      <span className="text-xl font-semibold text-white">lei</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-semibold text-white/60 line-through decoration-white/70 decoration-2">
                        {formatPrice(FULL_PRICE)} lei
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="px-3 py-1 rounded-lg bg-green-600 text-white font-bold text-sm whitespace-nowrap">
                        Economisești {Math.round((1 - SALE_PRICE / FULL_PRICE) * 100)}%
                      </span>
                    </div>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {/* First Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Acces nelimitat 24h / 7/7</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0">
                        <Users className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">1-la-1 cu antrenori dedicați</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0">
                        <Sun className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Solar & masaj incluse</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Preț blocat - 12 luni - 99, 90 lei</span>
                    </div>
                  </div>

                  {/* Second Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Clase variate</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Aparate moderne</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Sala modernă, igienizată</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0">
                        <Coffee className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Spațiu de relaxare generos</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mb-5">
                  <CTAButton size="large" fullWidth={true}>
                    Rezervă-ți locul acum
                  </CTAButton>
                </div>

                {/* Countdown and Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-white/60 flex-shrink-0" />
                    <span className="text-white/70">Doar primii 100!</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">87 abonamente rămase</span>
                    <span className="text-white/70">71% rezervate</span>
                  </div>
                  <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-[71%] bg-[var(--fa-orange)] rounded-full"></div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Oferta presale */}
      <section id="pret" className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:py-8">
          <div className="space-y-12">
            {/* All Inclusive Card */}
            <div className="bg-[var(--fa-ral-9011)] rounded-3xl p-6 sm:p-8">
              {/* Grid Layout: Title + Features on left, Carousel on right */}
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* Left Column - Title and Features */}
                <div>
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-4">Abonament All Inclusive (12 luni)</h3>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-orange)]/20 text-[var(--fa-orange)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Acces 24/7 la o sală modernă, peste 1200 mp, cu antrenori dedicați și beneficii nelimitate.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-orange)]/20 text-[var(--fa-orange)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Antrenori cu adevarat dedicați 1-la-1</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-orange)]/20 text-[var(--fa-orange)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Energie & recuperare optimă – băuturi energizante gratuite, fotoliu de masaj nelimitat</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-orange)]/20 text-[var(--fa-orange)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Programe variate – forță, cardio și clase de grup nelimitate, ca să nu te plictisești niciodată.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-orange)]/20 text-[var(--fa-orange)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Solar nelimitat & platformă vibrantă – pentru un look impecabil, corp tonifiat și reducerea celulitei.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-lg bg-[var(--fa-orange)]/20 text-[var(--fa-orange)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-white font-medium text-sm">Spațiu de relaxare generos – unde te bucuri de o băutură rece și de prieteni, după antrenament.</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-white font-medium text-sm">– tot ce ai nevoie ca să arăți și să te simți excelent.</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Carousel */}
                <div className="lg:pl-4">
                  <ImageCarousel images={allInclusiveImages} />
                </div>
              </div>
            </div>

            {/* Pro-Pack Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--fa-ral-9011)] shadow-xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--fa-orange)]/5 to-transparent" />

              <div className="relative">
                {/* Grid Layout: Title + Content on left, Carousel on right */}
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                  {/* Left Column - Badge, Title, and Content */}
                  <div>
                    {/* Badge */}
                    <div className="flex items-center gap-2 pl-0 pr-3 py-1 rounded-full bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] text-sm font-medium mb-4 w-fit">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                      Exclusiv doar în presale
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-4">
                      Pro-Pack Unic
                    </h2>

                    {/* Description */}
                    <p className="text-base text-white/80 mb-2">
                      Bonus Premium – disponibil exclusiv în oferta de presale.
                    </p>

                    <p className="text-base text-white/80 mb-6">
                      Creat special pentru tine, ca să îți accelerezi rezultatele încă din prima lună:
                    </p>

                    {/* Features List */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="text-white font-medium text-sm">
                          Control de postură cu un osteopat acreditat – identifică dezechilibrele corpului și primești recomandări personalizate pentru a evita durerile și pentru a-ți îmbunătăți performanța.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="text-white font-medium text-sm">
                          Analiză detaliată a compoziției corporale – descoperă exact raportul dintre masă musculară, grăsime și hidratare, ca să ai un punct de plecare clar și obiectiv.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="text-white font-medium text-sm">
                          Plan de antrenament recomandat de un specialist – o strategie de exerciții creată pentru tine, care să te ajute să obții rezultate mai rapide și mai vizibile.
                        </span>
                      </div>
                    </div>

                    {/* Note */}
                    <p className="text-sm text-white/50">
                      *Pro-Pack nu va mai fi disponibil după lansare.
                    </p>
                  </div>

                  {/* Right Column - Image Carousel */}
                  <div className="lg:pl-4">
                    <ImageCarousel images={proPackImages} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Centered CTA Button - Shown under both cards */}
          <div className="mt-8 text-center">
            <CTAButton size="large">
              Vreau Pro-Pack-ul inclus
            </CTAButton>
          </div>
        </div>
      </section>


      {/* GARANȚII */}
      <section id="garantii" className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:py-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Garanții (pe bune)</h2>
            <p className="mt-2 text-base sm:text-lg text-white/70">Rezultate reale și siguranță în antrenamente.</p>
          </div>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              { icon: <LockOpen className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"/>, title: "Deschidere 100% sau bani înapoi", desc: "Dacă sala nu se deschide, primești integral banii înapoi." },
              { icon: <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"/>, title: "Asigurare răspundere civilă", desc: "Ești protejat pentru eventuale daune în cadrul sălii." },
              { icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"/>, title: "Implicare reală", desc: "Îți urmărim progresul și venim cu propuneri pentru motivație constantă." },
              { icon: <Star className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"/>, title: "18 ani experiență", desc: "Mii de clienți mulțumiți, peste 150 cluburi deschise." },
              { icon: <Star className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"/>, title: "Acces imediat", desc: "Te poti antrena gratuit în toate locatiile FitActive imediat dupã ce ai achitat abonamentul. In sala din Vitan abonamentul începe la data deschiderii - nu pierzi nimic până atunci." },
            ].map((g, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-2xl bg-[var(--fa-ral-9011)] shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0">
                    {g.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg text-white leading-tight">{g.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <CTAButton size="large">
              {ctaText}
            </CTAButton>
          </div>
        </div>
      </section>




      {/* FEEDBACK */}
      <section id="feedback" className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-8">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">Feedback</h2>
            <p className="mt-2 text-base sm:text-lg text-white/70">Recenzii, mesaje, rezultate trimise de clienții sălilor noastre</p>
          </div>
          <div className="mt-8">
            {/* RAL 9011 Card containing feedback images */}
            <div className="bg-[var(--fa-ral-9011)] rounded-3xl p-6 sm:p-8 shadow-xl">
              <FeedbackImageGrid images={feedbackImages} />
            </div>
          </div>
          <div className="mt-6 text-center">
            <CTAButton size="large">
              {ctaText}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <section id="galerie" className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-8">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">Galerie</h2>
            <p className="mt-2 text-base sm:text-lg text-white/70">Cum va arăta sala: zone forță, cardio, clase, vestiare, recepție.</p>
          </div>
          <div className="mt-8">
            {/* RAL 9011 Card containing gallery carousel */}
            <div className="bg-[var(--fa-ral-9011)] rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl min-h-[20rem] sm:min-h-[28rem] lg:min-h-[36rem]">
                  <ImageCarousel images={galleryImages} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <CTAButton size="large">
              {ctaText}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-8">
          <div className="max-w-2xl mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">Întrebări frecvente</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - FAQ Items */}
            <div className="space-y-4">
              {[
                {
                  q: "Ce include All Inclusive?",
                  a: [
                    "Access in sala fitness, 24h 7/7",
                    "Toate cursurile noastre distractive de grup",
                    "Băuturile noastre izotonice cu puține calorii",
                    "Lampă de bronzat cu lumina Collagen",
                    "Aparate cu vibromasaj anticelutită și pentru relaxare musculară",
                    "Fotolii pentru masaj relaxant"
                  ]
                },
                { q: "Cum funcționează Pro-Pack-ul?", a: (<>Include evaluare posturală cu osteopat acreditat, analiză corporală detaliată și recomandări personalizate de antrenament. <strong>Disponibilă doar pentru personele care se inscriu in presale.</strong></>) },
                { q: "Oferta e limitată?", a: "Da, doar primele 100 de locuri beneficiază de prețul redus și Pro-Pack-ul inclus gratuit." },
              ].map((item, i) => {
                const isOpen = openFaqItems.has(i);
                return (
                  <div key={i} className="rounded-2xl bg-[var(--fa-ral-9011)] shadow border border-white/5 hover:shadow-lg transition-all overflow-hidden">
                    <div
                      className="p-6 sm:p-8 cursor-pointer group"
                      onClick={() => toggleFaqItem(i)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg text-white group-hover:text-[var(--fa-ral-2011)] transition-colors">{item.q}</h3>
                        {isOpen ? (
                          <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-[var(--fa-ral-2011)] transition-colors flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[var(--fa-ral-2011)] transition-colors flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    {isOpen && (
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-sm text-white/60 leading-relaxed">
                        {Array.isArray(item.a) ? (
                          <ul className="space-y-2">
                            {item.a.map((listItem, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[var(--fa-ral-2011)] mt-0.5 flex-shrink-0" />
                                <span>{listItem}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div>{item.a}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column - CTA Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--fa-orange)]/20 to-[var(--fa-orange)]/5 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--fa-orange)]/10 to-transparent" />

              <div className="relative">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ultima șansă – nu rata
                </h3>

                <p className="text-white/80 mb-6 leading-relaxed">
                  Ești la un click distanță de cel mai bun preț pe care îl vei avea vreodată la FitActive București, plus Pro-Pack cadou.
                </p>

                <div className="mb-6">
                  <CTAButton size="large" fullWidth={true}>
                    Înscrie-te acum
                  </CTAButton>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">87 abonamente rămase</span>
                    <span className="text-white/70">71% rezervate</span>
                  </div>
                  <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-[71%] bg-[var(--fa-orange)] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--fa-ral-9011)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[var(--fa-orange)] flex-shrink-0" />
              <span className="font-bold">FitActive București Vitan</span>
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
              <li>Adresa: Calea Vitan nr. 289, sector 3, București</li>
              <li>Email: <a href="mailto:vitan@fitactive.ro" className="text-white/70 hover:text-white transition-colors">vitan@fitactive.ro</a></li>
              <li>Telefon: <a href="tel:+40758987111" className="text-white/70 hover:text-white transition-colors">0758987111</a></li>
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
