import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import ErrorBoundary from "./ErrorBoundary";

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>
    </ErrorBoundary>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
