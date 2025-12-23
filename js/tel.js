// pour injection dans structure
function initPhone() {
    /* <!-- initPhone: root injection-safe (PageTel / tailleTel / mon-clavier) --> */
    const root =
        document.getElementById("PageTel") ||
        document.getElementById("tailleTel") ||
        document.getElementById("mon-clavier");

    if (!root) return;

    /* <!-- tel.js: scope all queries to root to avoid cross-page pollution --> */
    const main = root; // <-- au lieu de document.querySelector("main")
    const nav = root.querySelector(".nav");
    const buttons = root.querySelectorAll(".button");
    const light = root.querySelector(".light");

    // const svgs = document.querySelectorAll("svg");
    /* <!-- tel.js: only clone svgs that belong to the phone keypad area --> */
    const svgSources = root.querySelectorAll("svg");

    const buttonLight = root.querySelector(".button-light");
    const buttonLights = root.querySelectorAll(".button-light div");

    /* <!-- safety: abort if key elements missing --> */
    if (!nav || !light || !buttonLight) return;

    /* <!-- injection-safe init instead of window.onload --> */
    requestAnimationFrame(() => {
        const navRect = nav.getBoundingClientRect();
        const centerX = navRect.left + navRect.width / 2;
        const centerY = navRect.top + navRect.height / 2;
        light.style.transform = `translate(${centerX}px, ${centerY}px)`;
    });

    // for (let i = 0; i < svgs.length; i++) {
    //     const svg = svgs[i].cloneNode(true);
    //     buttonLights[i].appendChild(svg);
    // }
    /* <!-- clone svgs into the button lights (scoped) --> */
    for (let i = 0; i < svgSources.length; i++) {
        const svg = svgSources[i].cloneNode(true);
        buttonLights[i]?.appendChild(svg);
    }

    for (let i = 0; i < 4; i++) {
        const newButtonLight = buttonLight.cloneNode(true);
        newButtonLight.classList.add("glare");
        newButtonLight.style.filter = `blur(${Math.pow(i * 1.5, 2)}px)`;
        /* <!-- glare append inside phone root ONLY (avoid covering other UI) --> */
        main.appendChild(newButtonLight);
    }

    const buttonLightsAll = root.querySelectorAll(".button-light");

    /* <!-- tel.js: avoid relying on global 'event' in helpers --> */
    window.addEventListener("mousemove", (event) => {
        const x = event.clientX;
        const y = event.clientY;

        const s = calculateShadowXY(x, y);

        var lightRadius = 400;

        const opacity = easeInQuad(
            calculateIntensityXY(x, y, lightRadius / 3, lightRadius * 1.3)
        );

        for (let i = 0; i < buttonLightsAll.length; i++) {
            buttonLightsAll[i].style.opacity = 0.3 + 0.7 * opacity;
        }

        buttons.forEach((item) => {
            const angle = calculateAngle(item, x, y);
            const scaleY =
                10 -
                easeOutQuint(calculateIntensityXY(x, y, 0, lightRadius * 1.4)) *
                    10;

            const bg = item.querySelector(".button-bg");
            if (bg) {
                bg.style.transform = `rotateZ(${angle}deg) scaleY(${scaleY})`;
            }
        });
    });

    /* =========================
       Anciennes fonctions (utilisaient 'event' global)
       Gardées pour ne pas supprimer, mais plus utilisées.
       ========================= */

    function calculateShadow() {
        const rect = nav.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // eslint-disable-next-line no-undef
        const deltaX = event.clientX - centerX;
        // eslint-disable-next-line no-undef
        const deltaY = event.clientY - centerY;

        const angle = Math.atan2(deltaY, deltaX);
        const maxOffset = 3;

        const detectionRadius = rect.width * 2;
        const distance = Math.min(
            maxOffset,
            (Math.sqrt(deltaX ** 2 + deltaY ** 2) / detectionRadius) * maxOffset
        );
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;

        return { x: -offsetX, y: -offsetY };
    }

    function calculateIntensity(innerRadius, outerRadius) {
        const rect = nav.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // eslint-disable-next-line no-undef
        const deltaX = event.clientX - centerX;
        // eslint-disable-next-line no-undef
        const deltaY = event.clientY - centerY;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        let intensity = 0;

        if (distance > innerRadius && distance <= outerRadius) {
            intensity = (distance - innerRadius) / (outerRadius - innerRadius);
        } else if (distance > outerRadius) {
            intensity = 1;
        } else if (distance <= innerRadius) {
            intensity = 0;
        }

        return intensity;
    }

    /* =========================
       Nouvelles fonctions (safe)
       ========================= */

    /* <!-- tel.js: shadow calc without global event --> */
    function calculateShadowXY(cursorX, cursorY) {
        const rect = nav.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = cursorX - centerX;
        const deltaY = cursorY - centerY;

        const angle = Math.atan2(deltaY, deltaX);
        const maxOffset = 3;

        const detectionRadius = rect.width * 2;
        const distance = Math.min(
            maxOffset,
            (Math.sqrt(deltaX ** 2 + deltaY ** 2) / detectionRadius) * maxOffset
        );

        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;

        return { x: -offsetX, y: -offsetY };
    }

    /* <!-- tel.js: intensity calc without global event --> */
    function calculateIntensityXY(cursorX, cursorY, innerRadius, outerRadius) {
        const rect = nav.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = cursorX - centerX;
        const deltaY = cursorY - centerY;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        let intensity = 0;

        if (distance > innerRadius && distance <= outerRadius) {
            intensity = (distance - innerRadius) / (outerRadius - innerRadius);
        } else if (distance > outerRadius) {
            intensity = 1;
        } else if (distance <= innerRadius) {
            intensity = 0;
        }

        return intensity;
    }

    function calculateAngle(element, cursorX, cursorY) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle =
            Math.atan2(cursorY - centerY, cursorX - centerX) * (180 / Math.PI);
        return (angle + 180) % 360;
    }

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function easeOutQuint(t) {
        return 1 - Math.pow(1 - t, 5);
    }

    function easeInQuad(t) {
        return t * t;
    }

    buttons.forEach((item) => {
        item.addEventListener("mouseover", () => item.classList.add("hover"));
        item.addEventListener("mouseout", () => item.classList.remove("hover"));
        item.addEventListener("mousedown", () => item.classList.add("press"));
        item.addEventListener("mouseup", () => item.classList.remove("press"));
        item.addEventListener("touchstart", () => item.classList.add("press"));
        item.addEventListener("touchend", () => {
            setTimeout(() => item.classList.remove("press"), 300);
        });
    });
}

window.initPhone = initPhone;

/* <!-- tel.js: DO NOT auto-run on DOMContentLoaded when using injected pages -->
   Sinon : initPhone() part avant l’injection OU en conflit avec reader.js.
   C’est reader.js qui doit appeler window.initPhone() après injection.
*/
// window.addEventListener("DOMContentLoaded", () => {
//     initPhone();
// });

// fetch("audio.html")
//     .then((response) => response.text())
//     .then((data) => {
//         const container = document.getElementById("audio-container");
//         if (container) {
//             container.innerHTML = data;
//         } else {
//             console.warn("audio-container introuvable dans le DOM");
//         }
//     });

// window.addEventListener("DOMContentLoaded", () => {
//     const lecteur = document.getElementById("lecteur");

//     const hasVisited = localStorage.getItem("audioPageVisited");

//     if (!hasVisited) {
//         lecteur?.play();
//         localStorage.setItem("audioPageVisited", "true");
//     }

//      Bouton "Appeler" réactive manuellement l'audio
//     const playBtn = document.getElementById("play");
//     playBtn?.addEventListener("click", () => {
//         lecteur?.play();
//     });
// });
