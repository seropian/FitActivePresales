import { useState } from "react";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";

// Pricing configuration
const PRICING_CONFIG = {
  FULL_PRICE: 3098.80,
  SALE_PRICE: 1448.80,
  MONTHLY_PRICE: 99.90,
};

// Calculate discount percentage
const DISCOUNT_PERCENTAGE = Math.round(((PRICING_CONFIG.FULL_PRICE - PRICING_CONFIG.SALE_PRICE) / PRICING_CONFIG.FULL_PRICE) * 100);

interface CheckoutPageProps {
  discount: number;
  ctaText: string;
}

function formatPrice(value: number): string {
  try {
    return value.toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch {
    return value.toFixed(2);
  }
}

export function CheckoutPage({ discount: _discount, ctaText: _ctaText }: CheckoutPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cnp: '',
    address: '',
    promoCode: '',
    agreeTerms: false,
    autoInvoice: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        order: {
          orderID: `FA-${Date.now()}`,
          amount: PRICING_CONFIG.SALE_PRICE,
          currency: 'RON',
          description: 'Abonament All Inclusive (12 luni) + Pro-Pack BONUS'
        },
        billing: {
          firstName: formData.firstName.split(' ')[0] || formData.firstName,
          lastName: formData.firstName.split(' ').slice(1).join(' ') || 'N/A',
          email: formData.email,
          phone: formData.phone,
          city: 'București',
          address: formData.address
        },
        company: formData.cnp ? {
          name: `${formData.firstName} ${formData.lastName}`,
          vatCode: formData.cnp
        } : null
      };

      const response = await fetch('/api/netopia/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.redirectUrl) {
        // Store order ID for thank you page
        sessionStorage.setItem('fa_last_order', orderData.order.orderID);
        window.location.href = result.redirectUrl;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('A apărut o eroare. Te rugăm să încerci din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="text-center py-8">
        <img
          src="/assets/fitactive-logo.png"
          alt="FitActive Logo"
          className="h-12 mx-auto mb-8"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--fa-orange)] mb-2 leading-tight">
            FELICITĂRI!!
          </h1>
          <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-[var(--fa-orange)] mb-2 leading-tight">
            Finalizează acum comanda și bucură-te de {DISCOUNT_PERCENTAGE}% reducere și un Bonus Exclusiv!
          </h2>
          <div className="flex justify-center">
            <span className="inline-block px-3 py-1 rounded-lg bg-green-600 text-white font-bold text-sm whitespace-nowrap">
              Economisești {formatPrice(PRICING_CONFIG.FULL_PRICE - PRICING_CONFIG.SALE_PRICE)} lei
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Package Information */}
          <div className="space-y-6">
            {/* All Inclusive Package */}
            <div className="bg-[var(--fa-ral-9011)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-[var(--fa-orange)]">Abonament All Inclusive (12 luni)</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                  <span>Acces nelimitat 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                  <span>Cursuri de grup fără rezervare</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                  <span>Băuturi izotonice gratuite</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                  <span>Fotoliu de masaj inclus gratuit</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                  <span>Lampă brozanta cu Collages inclusă gratuit</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                  <span>Platformă vibranta inclusă gratuit</span>
                </div>
              </div>

              {/* Package Images */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={`/assets/fitactive/${i}.jpg`}
                      alt={`All Inclusive ${i}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23374151"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23fff" font-size="12">${i}</text></svg>`;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pro-Pack Bonus */}
            <div className="bg-[var(--fa-ral-9011)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-[var(--fa-orange)]">Pro-Pack BONUS (inclus în presale)</h3>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                  <span>Analiză a compoziției corporale gratuită (prima analiză)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                  <span>Primul check-up postural gratuit cu osteopat</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                  <span>Primul antrenament asistat gratuit cu Personal Trainer</span>
                </div>
              </div>

              {/* Pro-Pack Images */}
              <div className="grid grid-cols-3 gap-2">
                {[8, 9, 10].map((i) => (
                  <div key={i} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={`/assets/fitactive/${i}.jpg`}
                      alt={`Pro Pack ${i}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23374151"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23fff" font-size="12">${i}</text></svg>`;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Billing Form */}
          <div className="space-y-6">
            {/* Billing Information */}
            <div className="bg-[var(--fa-ral-9011)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-[var(--fa-orange)] flex-shrink-0" />
                <h3 className="text-xl font-bold">Date de facturare</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Nume complet / Denumire firmă"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--fa-ral-9011)] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)]"
                  />
                  <input
                    type="text"
                    name="cnp"
                    placeholder="CNP / CUI"
                    value={formData.cnp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[var(--fa-ral-9011)] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)]"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--fa-ral-9011)] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)]"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--fa-ral-9011)] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)]"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Adresă facturare"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--fa-ral-9011)] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)]"
                />

                {/* Auto Invoice Notice */}
                <div className="flex items-start gap-3 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-blue-200">
                    Factura se emite automat după confirmarea tranzacției
                  </p>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 text-[var(--fa-orange)] bg-[var(--fa-ral-9011)] border-gray-600 rounded focus:ring-[var(--fa-orange)] focus:ring-2"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-white/80">
                    Sunt de acord cu termenii, politica de confidențialitate și prelucrarea datelor pentru emiterea facturii.
                  </label>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-900 rounded-xl p-6 mt-8">
                  <h4 className="text-lg font-bold text-[var(--fa-orange)] mb-4">Rezumat comandă</h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Abonament (12 luni)</span>
                      <span className="font-semibold line-through text-white/60">{formatPrice(PRICING_CONFIG.FULL_PRICE)} lei</span>
                    </div>

                    <div className="flex justify-between items-center text-[var(--fa-orange)]">
                      <span>Preț redus</span>
                      <span className="font-bold text-xl">{formatPrice(PRICING_CONFIG.SALE_PRICE)} lei</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Cod promo</span>
                      <input
                        type="text"
                        name="promoCode"
                        placeholder="(opțional)"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        className="w-24 px-2 py-1 bg-[var(--fa-ral-9011)] border border-gray-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--fa-orange)]"
                      />
                    </div>

                    <hr className="border-gray-700" />

                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="text-[var(--fa-orange)]">{formatPrice(PRICING_CONFIG.SALE_PRICE)} lei</span>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  type="submit"
                  disabled={!formData.agreeTerms || isSubmitting}
                  className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5 flex-shrink-0" />
                  {isSubmitting ? 'Se procesează...' : 'Plătește în siguranță →'}
                </button>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                  <Lock className="w-5 h-5 flex-shrink-0" />
                  <span>Plată securizată prin Netopia mobilPay</span>
                </div>

                {/* Important Note */}
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-6">
                  <h5 className="font-semibold text-yellow-200 mb-2">Note importante</h5>
                  <p className="text-sm text-yellow-100">
                    După plată, vei primi email cu confirmarea, contractul și factura fiscală.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--fa-gray)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-white/70 flex items-center justify-center">
          <span>© 2025 FitActive București • Suport: suport@fitactive.ro</span>
        </div>
      </footer>
    </div>
  );
}
