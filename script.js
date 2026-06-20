const petalsContainer = document.getElementById('petals-container');
const audio = document.getElementById('myAudio');
const musicToggleBtn = document.getElementById('musicToggle');
const giftBox = document.getElementById('theGift');
const giftOverlay = document.getElementById('gift-overlay');
const mainContent = document.getElementById('main-content');

let currentIntervalSpeed = 300;

// 1. Generator Kelopak Bunga Jatuh
function createPetal() {
    if (!petalsContainer) return;
    const petal = document.createElement('div');
    petal.classList.add('petal');
    const size = Math.random() * 12 + 8; 
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${Math.random() * 100}vw`;
    const fallDuration = Math.random() * 4 + 4; 
    const swayDuration = Math.random() * 2 + 2; 
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petalsContainer.appendChild(petal);
    setTimeout(() => { petal.remove(); }, fallDuration * 1000);
}
let petalInterval = setInterval(createPetal, currentIntervalSpeed);

// Fungsi pemicu musik paksa
function forcePlayMusic() {
    if (audio) {
        audio.play().then(() => {
            if (musicToggleBtn) musicToggleBtn.textContent = '⏸';
        }).catch((err) => {
            console.log("Menunggu interaksi klik tambahan untuk memutar musik.");
        });
    }
}

// 2. AKSI SAAT KADO DIKLIK (SURPRISE EFFECT)
if (giftBox) {
    giftBox.addEventListener('click', () => {
        giftBox.classList.add('open');

        // LEDAKAN BUNGA BRUTAL (Efek Kejutan)
        clearInterval(petalInterval);
        petalInterval = setInterval(createPetal, 30);

        setTimeout(() => {
            clearInterval(petalInterval);
            petalInterval = setInterval(createPetal, 250); // Normalkan kembali
        }, 3500);

        // Putar musik langsung
        forcePlayMusic();

        // Transisi hilangkan kado, munculkan isi web
        setTimeout(() => {
            giftOverlay.style.opacity = '0';
            giftOverlay.style.visibility = 'hidden';
            
            mainContent.classList.remove('hidden-content');
            mainContent.classList.add('show-content');
            
            // Segera cek posisi scroll pasca terbuka
            handleScrollAnimation();
        }, 1200);
    });
}

// 3. Tombol Saklar Musik Manual
if (musicToggleBtn && audio) {
    musicToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.paused) {
            audio.play();
            musicToggleBtn.textContent = '⏸';
        } else {
            audio.pause();
            musicToggleBtn.textContent = '▶';
        }
    });
}

// Pengaman Cadangan Klik Layar Pertama Kali Untuk Audio
document.addEventListener('click', () => {
    if (audio && audio.paused && mainContent.classList.contains('show-content')) {
        forcePlayMusic();
    }
}, { once: true });

// 4. Deteksi Gerakan Scroll (Fade In)
const fadeInElements = document.querySelectorAll('.fade-in-element');
const handleScrollAnimation = () => {
    fadeInElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        if ((elementTop <= window.innerHeight * 0.88) && (elementBottom >= 0)) {
            element.classList.add('is-visible');
        }
    });
};
window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);