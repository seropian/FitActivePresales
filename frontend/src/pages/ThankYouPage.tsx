import { useState, useEffect } from "react";
import type { ThankYouPageProps, Invoice } from "../types/components";

const POLLING_INTERVAL = 3000; // 3 seconds

/**
 * Thank You page component - displays order status and handles payment confirmation
 */
export function ThankYouPage({ orderID }: ThankYouPageProps) {
  const [status, setStatus] = useState("pending");
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  // Fallback to sessionStorage if orderID is not provided
  const safeOrderID = orderID ||
    (typeof window !== 'undefined' && sessionStorage.getItem('fa_last_order')) ||
    "";

  useEffect(() => {
    if (!safeOrderID) return;

    let timeoutId: NodeJS.Timeout;

    const checkOrderStatus = async () => {
      try {
        const response = await fetch(`/api/order/status?orderID=${encodeURIComponent(safeOrderID)}`);
        const data = await response.json();

        if (data.status) {
          setStatus(data.status);
        }

        if (data.invoice) {
          setInvoice(data.invoice);
        }

        // Stop polling if payment is finalized
        if (data.status === 'approved' || data.status === 'failed') {
          return;
        }

        // Continue polling
        timeoutId = setTimeout(checkOrderStatus, POLLING_INTERVAL);
      } catch (error) {
        console.error('Failed to check order status:', error);
        // Continue polling even on error
        timeoutId = setTimeout(checkOrderStatus, POLLING_INTERVAL);
      }
    };

    checkOrderStatus();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [safeOrderID]);

  const renderStatusContent = () => {
    switch (status) {
      case 'pending':
        return (
          <>
            <p className="text-base sm:text-sm text-white">
              Plata este în curs de confirmare. Pagina se actualizează automat.
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-white/20 overflow-hidden">
              <div className="h-full w-1/2 animate-pulse bg-[var(--fa-orange)]" />
            </div>
          </>
        );

      case 'approved':
        return (
          <>
            <p className="text-xl sm:text-lg font-semibold text-green-400">
              Plata confirmată ✅
            </p>
            <p className="text-base sm:text-sm text-white/70">
              Ți-am trimis factura pe email.{' '}
              {invoice?.pdfLink && (
                <a
                  className="text-[var(--fa-orange-600)] font-semibold hover:underline"
                  href={invoice.pdfLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Descarcă factura PDF
                </a>
              )}
            </p>
            <a
              href="#"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg"
            >
              Înapoi la ofertă
            </a>
          </>
        );

      case 'failed':
        return (
          <>
            <p className="text-xl sm:text-lg font-semibold text-red-400">
              Plata a eșuat ❌
            </p>
            <p className="text-base sm:text-sm text-white/70">
              Încearcă din nou sau contactează-ne.
            </p>
            <a
              href="#comanda"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition text-base sm:text-lg"
            >
              Reîncearcă plata
            </a>
          </>
        );

      default:
        return (
          <p className="text-base sm:text-sm text-white/70">
            Se încarcă informațiile comenzii...
          </p>
        );
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur bg-white/90 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-black">FitActive Vitan</span>
          <a
            href="#"
            className="text-base sm:text-sm text-black hover:text-[var(--fa-orange)] transition-colors"
          >
            Înapoi acasă
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl sm:text-3xl font-black">
          Mulțumim! Procesăm plata ta…
        </h1>
        <p className="mt-2 text-lg sm:text-base text-white/70">
          Comanda: <span className="font-mono font-semibold">{safeOrderID || 'n/a'}</span>
        </p>

        <div className="mt-6 p-6 rounded-2xl bg-[var(--fa-ral-9011)] shadow border border-white/10">
          {renderStatusContent()}
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
