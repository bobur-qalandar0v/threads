import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./assets/main.scss";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { FavoriteProvider } from "./contexts/FavoriteContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ModalProvider>
      <FavoriteProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FavoriteProvider>
    </ModalProvider>
  </AuthProvider>
);
