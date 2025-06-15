// script.js - Arquivo principal que coordena todos os módulos
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar mapa Leaflet
  if (window.initializeMap) {
    window.initializeMap();
  }
});

// Função utilitária para debug
function debugInfo() {
  console.log("=== Portfolio Debug Info ===");
  console.log("Módulos carregados:");
  console.log("- FormHandler:", typeof window.FormHandler !== "undefined");
  console.log("- MapLoader:", typeof window.MapLoader !== "undefined");
  console.log("- UIEffects:", typeof window.UIEffects !== "undefined");
  console.log("- Particles:", typeof window.particlesJS !== "undefined");
  console.log("============================");
}

// Exportar função de debug para console
window.debugPortfolio = debugInfo;
