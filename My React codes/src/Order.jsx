import { useState } from "react";
import Pizza from "./Pizza.jsx";

export default function Order() {
  // const pizzaType = "pepperoni";
  // const pizzaSize = "M";

  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("M");

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
              <option value="pepperoni">Pepperoni</option>
              <option value="hawaiian">Hawaiian</option>
              <option value="big_meat">Big Meat</option>
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
      <div className="order-pizza">
        <Pizza
          name="Pepperoni"
          description="Delicious pepperoni pizza"
          image="/public/pizzas/pepperoni.webp"
        />
        <p>14.44</p>
      </div>
    </div>
  );
}
