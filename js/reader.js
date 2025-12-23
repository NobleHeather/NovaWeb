//PAGE STRUCTURE
// Au chargement, on insère automatiquement le premier article
// window.addEventListener("DOMContentLoaded", () => {
//     fetch("page1.html")
//         .then((response) => response.text())
//         .then((data) => {
//             document.getElementById("content").innerHTML = data;
//             document.getElementById("prev").disabled = true; // Précédent désactivé
//         })
//         .catch((error) => console.error("Erreur chargement article :", error));
// });

let currentPage = 1;
const totalPages = 15; // tu augmenteras ce nombre si tu ajoutes plus tard d'autres pages

//mise à jour sommaire
function loadSommaire(article) {
    let title = article?.getAttribute("data-title");
    let subtitle = article?.getAttribute("data-subtitle");

    const sommaireList = document.getElementById("sommaire-list");

    if (title) {
        const titleText = `➤ ${title}`;
        if (!isInSommaire(titleText)) {
            const li = document.createElement("li");
            li.textContent = titleText;
            sommaireList.appendChild(li);
        }
    }

    if (subtitle) {
        if (!isInSommaire(subtitle)) {
            const liSub = document.createElement("li");
            liSub.textContent = subtitle;
            liSub.classList.add("ms-3");
            sommaireList.appendChild(liSub);
        }
    }
}

// vérifier si un élément avec le même texte est déjà présent
function isInSommaire(text) {
    const items = document.querySelectorAll("#sommaire-list li");
    return Array.from(items).some((item) => item.textContent === text);
}

//chargement d'une page
// function loadPage(pageNumber) {
//     fetch(`page${pageNumber}.html`)
//         .then((response) => response.text())
//         .then((data) => {
//             document.getElementById("content").innerHTML = data;
//             document.getElementById("prev").disabled = pageNumber === 1;
//             document.getElementById("next").disabled =
//                 pageNumber === totalPages;
//             currentPage = pageNumber;
//         })
//         .catch((error) => console.error("Erreur chargement article :", error));
// }

function loadPage(pageNumber) {
    /* <!-- cache-bust + no-store --> */
    /* <!-- fetch fragment (partial) to avoid live-server injection --> */
    fetch(`page${pageNumber}.partial?v=${Date.now()}`, {
        cache: "no-store",
    })
        .then((response) => response.text())
        .then((data) => {
            const contentDiv = document.getElementById("content");
            contentDiv.innerHTML = data;

            /* <!-- initPhone call (use tel.js), + collapse rebind fix --> */
            if (pageNumber === 1) {
                setTimeout(() => {
                    const clavier = document.getElementById("tailleTel");

                    // IMPORTANT : on appelle la version de tel.js (scopée), pas un initPhone "global" dans reader.js
                    if (clavier && typeof window.initPhone === "function") {
                        window.initPhone();
                    }

                    /* <!-- rebind collapse fix (do NOT collapse the trigger itself) --> */
                    const triggers = document.querySelectorAll(
                        '[data-bs-toggle="collapse"]'
                    );

                    triggers.forEach((trigger) => {
                        const targetSelector =
                            trigger.getAttribute("data-bs-target");
                        if (!targetSelector) return;

                        const targetEl = document.querySelector(targetSelector);
                        if (!targetEl) return;

                        bootstrap.Collapse.getOrCreateInstance(targetEl, {
                            toggle: false,
                        });
                    });

                    /* <!-- ancien rebind collapse (désactivé) : collapse le bouton au lieu de la cible --> */
                    // const triggers = document.querySelectorAll(
                    //     '[data-bs-toggle="collapse"]'
                    // );
                    // triggers.forEach((trigger) => {
                    //     new bootstrap.Collapse(trigger);
                    // });
                }, 100);
            }

            const article = contentDiv.querySelector("article");
            if (article) {
                loadSommaire(article);
            } else {
                console.warn("Aucun article trouvé dans la page.");
            }

            document.getElementById("prev").disabled = pageNumber === 1;
            document.getElementById("next").disabled =
                pageNumber === totalPages;
            currentPage = pageNumber;
        })
        .catch((error) => console.error("Erreur chargement article :", error));
}

/* <!-- initPhone legacy (DÉSACTIVÉ) : cause icônes parasites + conflits avec tel.js --> */
/*
function initPhone() {
    // tout le code ici
    const main = document.querySelector("main");
    const nav = document.querySelector(".nav");
    const buttons = document.querySelectorAll(".button");
    const light = document.querySelector(".light");
    const svgs = document.querySelectorAll("svg");
    const buttonLight = document.querySelector(".button-light");
    const buttonLights = document.querySelectorAll(".button-light div");

    window.onload = () => {
        const navRect = nav.getBoundingClientRect();
        const centerX = navRect.left + navRect.width / 2;
        const centerY = navRect.top + navRect.height / 2;
        light.style.transform = `translate(${centerX}px, ${centerY}px)`;
    };

    for (let i = 0; i < svgs.length; i++) {
        const svg = svgs[i].cloneNode(true);
        buttonLights[i].appendChild(svg);
    }

    for (let i = 0; i < 4; i++) {
        const newButtonLight = buttonLight.cloneNode(true);
        newButtonLight.classList.add("glare");
        newButtonLight.style.filter = `blur(${Math.pow(i * 1.5, 2)}px)`;
        main.appendChild(newButtonLight);
    }

    const buttonLightsAll = document.querySelectorAll(".button-light");

    window.addEventListener("mousemove", (event) => {
        var x = event.clientX;
        var y = event.clientY;

        var s = calculateShadow();

        var lightRadius = 400;

        const opacity = easeInQuad(
            calculateIntensity(lightRadius / 3, lightRadius * 1.3)
        );
        for (let i = 0; i < buttonLightsAll.length; i++) {
            buttonLightsAll[i].style.opacity = 0.3 + 0.7 * opacity;
        }

        buttons.forEach((item, i) => {
            const angle = calculateAngle(item, x, y);
            const scaleY =
                10 -
                easeOutQuint(calculateIntensity(0, lightRadius * 1.4)) * 10;
            item.querySelector(
                ".button-bg"
            ).style.transform = `rotateZ(${angle}deg) scaleY(${scaleY})`;
        });
    });

    function calculateShadow() {
        const rect = nav.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = event.clientX - centerX;
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

        const deltaX = event.clientX - centerX;
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

    buttons.forEach((item, i) => {
        item.addEventListener("mouseover", () => {
            item.classList.add("hover");
        });
        item.addEventListener("mouseout", () => {
            item.classList.remove("hover");
        });
        item.addEventListener("mousedown", () => {
            item.classList.add("press");
        });
        item.addEventListener("mouseup", () => {
            item.classList.remove("press");
        });
        item.addEventListener("touchstart", () => {
            item.classList.add("press");
        });
        item.addEventListener("touchend", () => {
            setTimeout(function () {
                item.classList.remove("press");
            }, 300);
        });
    });
}
*/

// window.initPhone = initPhone;

//button prev/next
window.addEventListener("DOMContentLoaded", () => {
    // loadPage(1); // page initiale
    const params = new URLSearchParams(window.location.search);
    const pageDemandee = parseInt(params.get("page")) || 1;
    loadPage(pageDemandee); // Charge directement page14 si indiqué

    document.getElementById("prev").addEventListener("click", () => {
        if (currentPage > 1) {
            loadPage(currentPage - 1);
        }
    });

    document.getElementById("next").addEventListener("click", () => {
        if (currentPage < totalPages) {
            loadPage(currentPage + 1);
        }
    });
});
