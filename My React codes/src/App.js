import React from "react";
import { createRoot } from "react-dom/client";

const Pizza = () => {
  return React.createElement("div", {}, [
    React.createElement("h1", {}, "The Pepperoni Pizza"),
    React.createElement("p", {}, "Mozzarella Cheese, Pepperoni"),
  ]);
};

const App = () => {
  return React.createElement("div", {}, [
    React.createElement("h1", {}, "Pixel Perfect Pizzas"),
    React.createElement(Pizza, {
      name: "The Pepperoni Pizza",
      description: "some dope pizza yo",
    }),
    React.createElement(Pizza, {
      name: "Americano Pizza",
      description: "French fries and hot dog, wtf Italy",
    }),
    React.createElement(Pizza, {
      name: "The Hawaiian",
      description: "pineaplle and ham, wtf America",
    }),
  ]);
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(React.createElement(App));
