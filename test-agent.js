// test-agent.js
// Ein kleines Skript, um die Verbindung zum Backend zu prüfen und den Agenten zu steuern.

const io = require("socket.io-client");
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Verbunden mit Backend!");
  
  // Test 1: Agent Task ausführen
  console.log("Sende Agent Task...");
  socket.emit("agent_task", { cmd: "echo 'Validierung erfolgreich'" });
});

socket.on("agent_result", (res) => {
  console.log("Agent Ergebnis:", res);
  socket.disconnect();
  process.exit(0);
});
