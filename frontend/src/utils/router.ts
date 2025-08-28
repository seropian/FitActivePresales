import { useState, useEffect } from "react";
import type { Route } from "../types";

// Router pe hash (#comanda, #thank-you)
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>({ page: "home", params: {} });

  useEffect(() => {
    const apply = (): void => {
      const hash = window.location.hash || "";
      const [h, q] = hash.split("?");
      const params = new URLSearchParams(q || "");

      let newRoute: Route;
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
