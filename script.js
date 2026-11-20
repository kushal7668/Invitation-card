
"use strict";

// ==========================================
// MANOJ ❤️ SARITA - WEDDING INVITATION
// ==========================================


// ELEMENTS

const opening = document.getElementById("opening");
const invitation = document.getElementById("invitation");
const enterBtn = document.getElementById("enterBtn");

const actionButtons = document.getElementById("actionButtons");

const shareBtn = document.getElementById("shareBtn");
const printBtn = document.getElementById("printBtn");


// ==========================================
// 1. BACKGROUND MUSIC
// Original synthesized flute / shehnai style tune
// ==========================================

let audioContext = null;
let musicStarted = false;
let musicTimer = null;

const melody = [
    392, 440, 494, 523,
    494, 440, 392, 330,
    392, 440, 523, 587,
    523, 494, 440, 392,

    330, 392, 440, 494,
    523, 494, 440, 392,
    440, 494, 523, 587,
    523, 440, 392, 330
];

let noteIndex = 0;


// Create one musical note

function playNote(frequency) {

    if (!audioContext) return;

    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    // Flute-like sound

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);

    filter.type = "lowpass";
    filter.frequency.value = 1800;

    // Soft vibrato

    const vibrato = audioContext.createOscillator();
    const vibratoGain = audioContext.createGain();

    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 3;

    vibrato.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    // Smooth sound envelope

    gain.gain.setValueAtTime(0.001, now);

    gain.gain.linearRampToValueAtTime(
        0.045,
        now + 0.08
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.46
    );

    oscillator.start(now);
    vibrato.start(now);

    oscillator.stop(now + 0.48);
    vibrato.stop(now + 0.48);

    oscillator.onended = () => {
        oscillator.disconnect();
        vibrato.disconnect();
        vibratoGain.disconnect();
        filter.disconnect();
        gain.disconnect();
    };

}


// Background drone

function startDrone() {

    if (!audioContext) return;

    [110, 164.81].forEach((frequency) => {

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.value = 0.012;

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();

    });

}


// Start Music

async function startMusic() {

    if (musicStarted) return;

    try {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        audioContext = new AudioContextClass();

        await audioContext.resume();

        musicStarted = true;

        startDrone();

        function nextNote() {

            if (!musicStarted) return;

            playNote(melody[noteIndex]);

            noteIndex = (noteIndex + 1) % melody.length;

        }

        nextNote();

        musicTimer = setInterval(nextNote, 520);

    } catch (error) {

        console.log("Audio could not start:", error);

    }

}


// Attempt autoplay when page opens

window.addEventListener("load", () => {

    startMusic();

});


// Browser autoplay fallback:
// First interaction anywhere on page starts music.

document.addEventListener("pointerdown", () => {

    if (!musicStarted) {
        startMusic();
    }

}, { once: true });


// ==========================================
// 2. OPEN INVITATION
// ==========================================

enterBtn.addEventListener("click", async () => {

    // Start music from user interaction

    await startMusic();

    opening.classList.add("hide");

    invitation.classList.add("show");

    actionButtons.classList.add("show");

    document.body.style.overflowX = "hidden";

    // Scroll to card

    setTimeout(() => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 300);

});


// ==========================================
// 3. FLOATING GOLDEN PARTICLES
// ==========================================

const particles = document.getElementById("particles");

const symbols = ["✦", "❀", "✧", "❁", "✿"];

function createParticle() {

    const particle = document.createElement("span");

    particle.className = "particle";

    particle.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = Math.random() * 100 + "vw";

    particle.style.fontSize =
        Math.random() * 15 + 10 + "px";

    const duration = Math.random() * 5 + 5;

    particle.style.animationDuration = duration + "s";

    particles.appendChild(particle);

    setTimeout(() => {

        particle.remove();

    }, duration * 1000);

}

setInterval(createParticle, 450);


// ==========================================
// 4. SHARE INVITATION
// ==========================================

shareBtn.addEventListener("click", async () => {

    const message = `
॥ श्री गणेशाय नमः ॥

💍 शुभ विवाह 💍

चि. मनोज कुमार यादव
सुपुत्र - श्री राम मनोरथ यादव
सुपौत्र - स्वर्गीय जगदीश यादव

आयु. कु. सरिता यादव
सुपुत्री - स्वर्गीय सियाराम यादव
सुपौत्री - स्वर्गीय जगपाल यादव

🌼 मांगलिक कार्यक्रम 🌼

तेल पूजन - 22 नवंबर 2026
मातृ पूजन - 23 नवंबर 2026
शुभ विवाह - 24 नवंबर 2026
बहू आगमन - 25 नवंबर 2026

🍽️ प्रीतिभोज 🍽️

26 नवंबर 2026, गुरुवार
सायं 4 बजे

📍 आयोजन स्थल:
ग्राम - पेटुवागंज,
पोस्ट - नेवती,
जिला - अयोध्या, उत्तर प्रदेश।

आप सपरिवार सादर आमंत्रित हैं।

निवेदक:
श्री राम मनोरथ यादव
एवं समस्त यादव परिवार व मित्रगण।

॥ सादर आमंत्रित ॥
    `;

    try {

        if (navigator.share) {

            await navigator.share({
                title: "मनोज एवं सरिता शुभ विवाह",
                text: message
            });

        } else {

            await navigator.clipboard.writeText(message);

            alert("निमंत्रण कॉपी हो गया है!");

        }

    } catch (error) {

        if (error.name !== "AbortError") {

            console.error("Share error:", error);

        }

    }

});


// ==========================================
// 5. PRINT INVITATION
// ==========================================

printBtn.addEventListener("click", () => {

    window.print();

});


// ==========================================
// 6. CONSOLE WELCOME
// ==========================================

console.log(
    "❤️ Manoj & Sarita Wedding Invitation Loaded!"
);

console.log(
    "शुभ विवाह - 24 नवंबर 2026"
);
