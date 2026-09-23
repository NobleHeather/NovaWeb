const NODES = {
    // 1: {
    //     text: "texte 1",
    //     choices: {
    //         A: 3,
    //         B: 2,
    //     },
    // },

    //! TEMP
    1: {
        textId: "t1",
        end: true,
    },
    //! TEMP

    2: { text: "texte 2", end: true },

    3: {
        text: "texte 3",
        choices: {
            A: 4,
            B: 5,
        },
    },

    4: { text: "texte 4", end: true },

    5: {
        text: "texte 5",
        choices: {
            A: 6,
            B: 7,
            C: 8,
            D: 9,
        },
    },

    6: { text: "texte 6", end: true },
    8: { text: "texte 8", end: true },
    9: { text: "texte 9", end: true },

    7: {
        text: "texte 7",
        choices: {
            A: 10,
            B: 11,
        },
    },

    10: {
        text: "texte 10",
        choices: {
            A: 14,
            B: 15,
        },
    },

    14: { text: "texte 14", end: true },
    15: { text: "texte 15", end: true },

    11: {
        text: "texte 11",
        choices: {
            A: 12,
            B: 13,
        },
    },

    12: { text: "texte de fin", end: true },
    13: { text: "texte de fin", end: true },
};

let currentNodeId = 1;
let path = []; // [{ from: 1, to: 3, choice: "A" }]

function loadText(textId) {
    fetch(`texts/${textId}.frag`)
        .then((r) => r.text())
        .then((html) => {
            document.getElementById("story-text").innerHTML = html;
        })
        .catch((err) => {
            console.error("Erreur chargement texte", textId, err);
        });
}

function renderNode(nodeId) {
    const node = NODES[nodeId];
    if (!node) {
        console.error("Node introuvable :", nodeId);
        return;
    }

    // 1️⃣ Charger le TEXTE du nœud
    loadText(node.textId);

    // 2️⃣ Gérer les CHOIX
    const optionsDiv = document.getElementById("story-options");
    optionsDiv.innerHTML = "";

    // 3️⃣ Si c'est une fin
    if (node.end) {
        const endMsg = document.createElement("div");
        endMsg.className = "story-end";
        endMsg.textContent = "Fin.";
        optionsDiv.appendChild(endMsg);
        return;
    }

    // 4️⃣ Sinon, créer les boutons de choix
    for (const [label, nextId] of Object.entries(node.choices)) {
        const btn = document.createElement("button");
        btn.className = "story-choice";
        btn.textContent = `Choix ${label}`;

        btn.addEventListener("click", () => {
            choose(nodeId, label, nextId);
        });

        optionsDiv.appendChild(btn);
    }
}

function choose(from, choice, to) {
    path.push({ from, to, choice });
    currentNodeId = to;
    renderNode(to);

    // plus tard : drawLine(from, to)
}

document.addEventListener("DOMContentLoaded", () => {
    renderNode(currentNodeId);
});

/* <!-- mini ciel json --> */
document.addEventListener("DOMContentLoaded", () => {
    const star = document.getElementById("star-c0001-s0001");

    if (!star) {
        return;
    }

    star.addEventListener("click", () => {
        const source = star.dataset.starSrc;

        if (window.GalaxyCard && source) {
            window.GalaxyCard.open(source);
        }
    });
});

/* <!-- ciel généré depuis galaxy.json --> */
async function loadGalaxy() {
    const response = await fetch("data/galaxy.json");

    if (!response.ok) {
        throw new Error(
            `Impossible de charger data/galaxy.json (${response.status})`,
        );
    }

    const galaxy = await response.json();

    for (const constellationData of galaxy.constellations) {
        await loadConstellation(constellationData);
    }
}

/* <!-- constellation générée depuis json --> */
async function loadConstellation(constellationData) {
    const response = await fetch(constellationData.source);

    if (!response.ok) {
        throw new Error(
            `Impossible de charger ${constellationData.source} (${response.status})`,
        );
    }

    const constellation = await response.json();

    for (const starData of constellation.stars) {
        createGalaxyStar(constellationData, starData);
    }
}

/* <!-- création étoile depuis json --> */
function createGalaxyStar(constellationData, starData) {
    const sky = document.getElementById("galaxy-test");

    if (!sky) {
        return;
    }

    const star = document.createElement("button");

    star.type = "button";
    star.className = "galaxy-star galaxy-star--json";
    star.dataset.starSrc = starData.source;

    star.setAttribute(
        "aria-label",
        `Ouvrir l'étoile ${constellationData.id}-${starData.id}`,
    );

    const worldX = constellationData.x + starData.x;
    const worldY = constellationData.y + starData.y;

    star.style.setProperty("--star-x", `${worldX}px`);
    star.style.setProperty("--star-y", `${worldY}px`);

    star.addEventListener("click", () => {
        if (window.GalaxyCard) {
            window.GalaxyCard.open(starData.source);
        }
    });

    sky.appendChild(star);
}

/* <!-- lancement ciel json --> */
document.addEventListener("DOMContentLoaded", () => {
    loadGalaxy().catch((error) => {
        console.error("Erreur chargement Galaxy :", error);
    });
});

/* <!-- création Polaris depuis galaxy json --> */
function createPolaris(polarisData) {
    const sky = document.getElementById("galaxy-test");

    if (!sky || !polarisData) {
        return;
    }

    const polaris = document.createElement("button");

    polaris.type = "button";
    polaris.id = "polaris";
    polaris.className = "galaxy-polaris";

    polaris.setAttribute("aria-label", "Ouvrir l'introduction de Galaxy");

    polaris.style.setProperty("--polaris-x", `${polarisData.x}px`);
    polaris.style.setProperty("--polaris-y", `${polarisData.y}px`);

    sky.appendChild(polaris);
}

/* <!-- ajout Polaris au chargement du ciel --> */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("data/galaxy.json");

        if (!response.ok) {
            throw new Error(
                `Impossible de charger data/galaxy.json (${response.status})`,
            );
        }

        const galaxy = await response.json();

        createPolaris(galaxy.polaris);
    } catch (error) {
        console.error("Erreur chargement Polaris :", error);
    }
});
