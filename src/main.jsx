import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./assets/main.scss";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { FavoriteProvider } from "./contexts/FavoriteContext.jsx";

createRoot(document.getElementById("root")).render(
  <ModalProvider>
    <FavoriteProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </FavoriteProvider>
  </ModalProvider>
);
