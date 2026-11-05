// Google Apps Script Web App Deployment URL (ඔයාගේ Sheet එකේ URL එක මෙතනට දාන්න)
//const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQ4v2MThgH_PLACEHOLDER/exec"; 
const GOOGLE_APPS_SCRIPT_URL = "ඔයාගේ_GOOGLE_APPS_SCRIPT_WEB_APP_URL_EKA";

const urlParams = new
URLSearchParams(window.location.search);
const itemId = urlParams.get("id");

document.addEventListener("DOMContentLoaded", () => {
    setupGatewayAndAudio();

    // URL Query Parameters Parsing (උදා: index.html?id=EX01 හෝ index.html?id=01)
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get("id");

    if (itemId) {
        // පළමුව Google Sheet එකෙන් Data Fetch කිරීමට උත්සාහ කරයි
        fetchDataFromSheet(itemId);
    } else {
        console.warn("No ID query parameter detected in URL. Displaying default placeholder mode.");
        renderFallbackData("01");
    }
});

function renderVerificationData(data) {
    const serialNumber = document.getElementById("serial-number");
    if (serialNumber && data.serialNumber) {
        serialNumber.innerText = data.serialNumber; // Sheet eke thiyena "EX #01 / 10" wage value eka methanata enawa
    }
}

// Gateway Overlay & Audio Management Logic
function setupGatewayAndAudio() {
    const audio = document.getElementById("bg-music");
    const enterBtn = document.getElementById("enter-btn");
    const gateway = document.getElementById("entry-overlay");
    const musicToggleBtn = document.getElementById("music-toggle-btn");
    const musicText = document.getElementById("music-text");

    let isPlaying = false;

    if (enterBtn) {
        enterBtn.addEventListener("click", () => {
            if (gateway) gateway.classList.add("hidden");
            
            if (audio) {
                if (audio.paused) {
                    audio.play().then(() => {
                        isPlaying = true;
                        if (musicText) musicText.innerText = "AUDIO ON";
                        enterBtn.innerText = "AUDIO SYSTEM ACTIVE";
                        enterBtn.style.borderColor = "#00FF87";
                        enterBtn.style.color = "#00FF87";
                    }).catch(err => {
                        console.log("Audio playback error:", err);
                        if (musicText) musicText.innerText = "AUDIO OFF";
                    });
                } else {
                    audio.pause();
                    isPlaying = false;
                    if (musicText) musicText.innerText = "AUDIO OFF";
                    enterBtn.innerText = "ENTER SYSTEM";
                    enterBtn.style.borderColor = "var(--accent-purple)";
                    enterBtn.style.color = "var(--text-main)";
                }
            }
        });
    }

    if (musicToggleBtn && audio) {
        musicToggleBtn.addEventListener("click", () => {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                if (musicText) musicText.innerText = "AUDIO OFF";
                musicToggleBtn.classList.add("audio-muted");
            } else {
                audio.play().then(() => {
                    isPlaying = true;
                    if (musicText) musicText.innerText = "AUDIO ON";
                    musicToggleBtn.classList.remove("audio-muted");
                }).catch(err => {
                    console.log("Audio resume error:", err);
                });
            }
        });
    }
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
            console.warn("Invalid or Unregistered Digital Certificate. Using local fallback.");
            renderFallbackData(id);
        }
    } catch (err) {
        console.error("Data Fetch Error (Switching to Local Rendering):", err);
        renderFallbackData(id);
    }
}

// Render dynamic sheet data onto frontend
function renderVerificationData(data) {
    const badgeTitle = document.getElementById("badge-title");
    const serialNumber = document.getElementById("serial-number");
    const itemName = document.getElementById("item-name");
    const fabricMaterial = document.getElementById("fabric-material");
    const ownerName = document.getElementById("owner-name");
    const ownerStatus = document.getElementById("owner-status");
    const ownerPerk = document.getElementById("owner-perk");

    if (badgeTitle && data.badgeTitle) badgeTitle.innerText = data.badgeTitle;
    if (serialNumber && data.serialNumber) serialNumber.innerText = data.serialNumber;
    if (itemName && data.itemName) itemName.innerText = data.itemName;
    if (fabricMaterial && data.fabricMaterial) fabricMaterial.innerText = data.fabricMaterial;
    if (ownerName && data.ownerName) ownerName.innerText = data.ownerName;
    if (ownerStatus && data.ownerStatus) ownerStatus.innerText = data.ownerStatus;
    if (ownerPerk && data.ownerPerk) ownerPerk.innerText = data.ownerPerk;
}

// Fallback Logic (Google Sheet එක Connect නොවුණොත් හෝ Local Testing වලදී)
function renderFallbackData(rawId) {
    const uppercaseId = rawId.toUpperCase();

    const badgeTitle = document.getElementById("badge-title");
    const serialNumber = document.getElementById("serial-number");
    const itemName = document.getElementById("item-name");
    const fabricMaterial = document.getElementById("fabric-material");
    const ownerName = document.getElementById("owner-name");
    const ownerStatus = document.getElementById("owner-status");
    const ownerPerk = document.getElementById("owner-perk");

    if (uppercaseId.startsWith('EX')) {
        // Creators Edition (EX01 සිට EX10 දක්වා)
        const match = uppercaseId.match(/\d+/);
        const num = match ? match[0] : '01';
        
        if (serialNumber) serialNumber.innerText = `EX #${num} / 10`;
        if (badgeTitle) badgeTitle.innerText = 'EXCLUSIVE PROMO SAMPLE';
        if (itemName) itemName.innerText = "NULL Drop 01 — Creators Edition";
        if (fabricMaterial) fabricMaterial.innerText = "400 GSM Ultra-Heavy Cotton (Heavyweight Boxy Fit)";
        if (ownerName) ownerName.innerText = "Official Brand Ambassador";
        if (ownerStatus) ownerStatus.innerText = "Officially Verified Owner";
        if (ownerPerk) ownerPerk.innerText = "Genesis Promo Gift + Exclusive Brand Ambassador Status";
    } else {
        // සාමාන්‍ය Drop 01 (01 සිට 15 දක්වා)
        const match = uppercaseId.match(/\d+/);
        const num = match ? parseInt(match[0], 10) : 1;
        const formattedNum = String(num).padStart(2, '0');
        
        if (serialNumber) serialNumber.innerText = `#${formattedNum} / 15`;
        if (badgeTitle) badgeTitle.innerText = 'AUTHENTIC LIMITED PIECE';
        if (itemName) itemName.innerText = "NULL Heavyweight Drop 01";
        if (fabricMaterial) fabricMaterial.innerText = "400 GSM Ultra-Heavy Cotton (Heavyweight Boxy Fit)";
        if (ownerName) ownerName.innerText = "Officially Verified Owner";
        if (ownerStatus) ownerStatus.innerText = "Verified Owner";
        if (ownerPerk) ownerPerk.innerText = "Official NULL Authenticated Collector";
    }

    if (uppercaseId.startsWith('EX')) {
        const match = uppercaseId.match(/\d+/);
        const num = match ? match[0] : '01';
    
        // Methanin thamai EX #01 / 10 kiyana format eka hadenne
        if (serialNumber) serialNumber.innerText = `EX #${num} / 10`;
    }

}

