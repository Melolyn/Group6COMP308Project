import { useState } from "react";
import AppRouter from "./routes/AppRouter";
import Chatbot from "./pages/Chatbot";

export default function App() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <AppRouter />

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          border: "none",
          background: "#0f6cbd",
          color: "white",
          fontSize: "28px",
          zIndex: 999999,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        }}
        aria-label="Open chatbot"
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            bottom: "100px",
            width: "360px",
            height: "520px",
            background: "white",
            zIndex: 999999,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
          }}
        >
          <Chatbot />
        </div>
      )}
    </>
  );
}