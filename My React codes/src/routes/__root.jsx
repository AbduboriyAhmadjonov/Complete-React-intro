import { useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PizzaOfTheDay from "../PizzaOfTheDay";
import Header from "../Header";
import { CartContext } from "../contexts";
import ErrorBoundary from "../ErrorBoundary";

export const Route = createRootRoute({
  component: () => {
    const cartHoook = useState([]);

    return (
      <>
        <ErrorBoundary>
          <CartContext.Provider value={cartHoook}>
            <div>
              <Header />
              <Outlet />
              <PizzaOfTheDay />
            </div>
          </CartContext.Provider>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools />
        </ErrorBoundary>
      </>
    );
  },
});
