import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ViewRecipes from "./ViewRecipes";
import AddRecipe from "./AddRecipe";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Routes>
          <Route path="/" Component={ViewRecipes} />
          <Route path="/view" Component={ViewRecipes} />
          <Route path="/add" Component={AddRecipe} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
