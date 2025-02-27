
import { Tournament } from "@/components/Tournament";
import { useEffect } from "react";

const Index = () => {
  // Debug: Prüfen der DnD-Kontexte
  useEffect(() => {
    console.log("DnD Debugging: React DnD wurde auf der Index-Seite geladen");
    
    // Prüfen, ob HTML5Backend erfolgreich installiert wurde
    const isDndReady = document.body.getAttribute('data-dnd-preview');
    console.log("HTML5 Backend Status:", isDndReady ? "Aktiv" : "Möglicherweise nicht aktiv");
    
    // Prüfen der globalen Touch-Unterstützung
    console.log("Touch Support:", {
      maxTouchPoints: navigator.maxTouchPoints,
      ontouchstart: 'ontouchstart' in window,
      pointerEvents: 'PointerEvent' in window
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1A]">
      <Tournament />
    </div>
  );
};

export default Index;
