import { useState, useEffect } from "react";

// Router pe hash (#comanda, #thank-you)
export function useHashRoute() {
  const [route, setRoute] = useState({ page: "home", params: {} });
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash || "";
      const [h, q] = hash.split("?");
      const params = new URLSearchParams(q || "");

      let newRoute;
      if (h === "#comanda") {
        newRoute = { page: "comanda", params: Object.fromEntries(params) };
        // Scroll to top when navigating to checkout page
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else if (h === "#thank-you") {
        newRoute = { page: "thankyou", params: Object.fromEntries(params) };
        // Scroll to top when navigating to thank you page
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        newRoute = { page: "home", params: {} };
      }

      setRoute(newRoute);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);
  return route;
}
