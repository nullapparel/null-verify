// Google Apps Script Web App Deployment URL
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQ4v2MThgH_PLACEHOLDER/exec"; 

document.addEventListener("DOMContentLoaded", () => {
  setupGatewayAndAudio();

  // URL Query Parameters Parsing (e.g. index.html?id=EX01)
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("id");

  if (itemId) {
    fetchDataFromSheet(itemId);
  } else {
    console.warn("No ID query parameter detected in URL. Displaying placeholder mode.");
  }
});

// Gateway Overlay & Audio Management Logic
function setupGatewayAndAudio() {
  const audio = document.getElementById("bg-music");
  const enterBtn = document.getElementById("enter-btn");
  const gateway = document.getElementById("entry-overlay");
  const musicToggleBtn = document.getElementById("music-toggle-btn");
  const musicText = document.getElementById("music-text");

  let isPlaying = false;

  // Entry button event triggers music & clears gateway screen
  enterBtn.addEventListener("click", () => {
    gateway.classList.add("hidden");
    
    // Play Background Music
    audio.play().then(() => {
      isPlaying = true;
      musicText.innerText = "AUDIO ON";
    }).catch(err => {
      console.log("Audio playback error:", err);
      musicText.innerText = "AUDIO OFF";
    });
  });

  // Toggle button logic for sound play/pause
  musicToggleBtn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      musicText.innerText = "AUDIO OFF";
      musicToggleBtn.classList.add("audio-muted");
    } else {
      audio.play().then(() => {
        isPlaying = true;
        musicText.innerText = "AUDIO ON";
        musicToggleBtn.classList.remove("audio-muted");
      }).catch(err => {
        console.log("Audio resume error:", err);
      });
    }
  });
}

// Fetch API Data Integration from Google Sheet
async function fetchDataFromSheet(id) {
  try {
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?id=${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (result.status === "success") {
      renderVerificationData(result);
    } else {
      console.error(result.message || "Invalid or Unregistered Digital Certificate");
    }
  } catch (err) {
    console.error("Data Fetch Error:", err);
  }
}

// Render dynamic sheet data onto frontend
function renderVerificationData(data) {
  if (data.badgeTitle) document.getElementById("badge-title").innerText = data.badgeTitle;
  if (data.serialNumber) document.getElementById("serial-number").innerText = data.serialNumber;
  if (data.itemName) document.getElementById("item-name").innerText = data.itemName;
  if (data.fabricMaterial) document.getElementById("fabric-material").innerText = data.fabricMaterial;
  if (data.ownerName) document.getElementById("owner-name").innerText = data.ownerName;
  if (data.ownerStatus) document.getElementById("owner-status").innerText = data.ownerStatus;
  if (data.ownerPerk) document.getElementById("owner-perk").innerText = data.ownerPerk;
}