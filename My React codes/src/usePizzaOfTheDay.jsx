import { useState, useEffect, useDebugValue } from "react";

export default function usePizzaOfTheDay() {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);
  useDebugValue(
    pizzaOfTheDay
      ? `${pizzaOfTheDay.id} : ${pizzaOfTheDay.name}`
      : "Loading...",
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
}
