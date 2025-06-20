import { useEffect, useState } from "react";
import Pizza from "./Pizza.jsx";
// import Cart from "./Cart.jsx";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("M");
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  let price, selectedPizza;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = intl.format(selectedPizza.sizes[pizzaSize]);
  }

  useEffect(() => {
    fetchPizzaTypes();
  }, [pizzaSize]);

  async function fetchPizzaTypes() {
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    const pizzaRes = await fetch("api/pizzas");
    const pizzaJson = await pizzaRes.json();
    setPizzaTypes(pizzaJson);
    setLoading(false);
  }

  return (
    <div className="order">
      <h2>Create order page</h2>
      <form action="">
        <div>
          <div>
            <label htmlFor="pizza-type">Pizza type</label>
            <select
              onChange={(e) => setPizzaType(e.target.value)}
              name="pizza-type"
              value={pizzaType}
            >
              {pizzaTypes.map((pizza) => (
                <option key={pizza.id} value={pizza.id}>
                  {pizza.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pizza-size">Pizza Size</label>
            <div>
              <span>
                <input
                  checked={pizzaSize === "S"}
                  type="radio"
                  name="pizza-size"
                  id="pizza-s"
                  value="S"
                  onChange={(e) => setPizzaSize(e.target.value)}
                />
                <label htmlFor="pizza-s">Small</label>
              </span>

              <span>
                <input
                  checked={pizzaSize === "M"}
                  type="radio"
                  name="pizza-size"
                  id="pizza-m"
                  value="M"
                  onChange={(e) => setPizzaSize(e.target.value)}
                />
                <label htmlFor="pizza-m">Medium</label>
              </span>

              <span>
                <input
                  checked={pizzaSize === "L"}
                  type="radio"
                  name="pizza-size"
                  id="pizza-l"
                  value="L"
                  onChange={(e) => setPizzaSize(e.target.value)}
                />
                <label htmlFor="pizza-l">Large</label>
              </span>
            </div>
          </div>
          <button type="submit">Add to Cart</button>
        </div>
      </form>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div className="order-pizza">
          <Pizza
            name={selectedPizza.name}
            description={selectedPizza.description}
            image={selectedPizza.image}
          />
          <p>{price}</p>
        </div>
      )}
    </div>
  );
}
