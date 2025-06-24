import { useState, useEffect, useDebugValue } from "react";

export const usePizzaOfTheDay = () => {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);
  // useDebugValue hook is used for displaying the current state of pizzaOfTheDay in React DevTools (Components tab).
  // It helps developers understand the state of custom hooks when debugging.
  useDebugValue(
    pizzaOfTheDay ? `${pizzaOfTheDay.id}: ${pizzaOfTheDay.name}` : "Loading...",
  );

  useEffect(() => {
    async function fetchPizzaOfTheDay() {
      try {
        const response = await fetch("api/pizza-of-the-day");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPizzaOfTheDay(data);
      } catch (error) {
        console.error("Failed to fetch pizza of the day:", error);
      }
    }
    fetchPizzaOfTheDay();
  }, []);

  return pizzaOfTheDay;
};
