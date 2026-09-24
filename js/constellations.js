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

/* <!-- Galaxy V1 : navigation graphe et filaments --> */
(() => {
    const SVG_NS = "http://www.w3.org/2000/svg";

    /* <!-- registre constellations chargées --> */
    const constellations = new Map();

    /* <!-- identifiant global étoile --> */
    function getGlobalStarId(constellationId, starId) {
        return `${constellationId}-${starId}`;
    }

    /* <!-- recherche étoile dans constellation --> */
    function getStar(constellation, starId) {
        return constellation.stars.find((star) => star.id === starId);
    }

    /* <!-- test étoile lue --> */
    function isRead(constellationId, starId) {
        return window.GalaxyStorage.isStarRead(
            getGlobalStarId(constellationId, starId),
        );
    }

    /* <!-- parents d'une étoile --> */
    function getParents(constellation, starId) {
        return (constellation.links ?? [])
            .filter((link) => link.to === starId)
            .map((link) => link.from);
    }

    /*
     * <!-- résolution destination clic -->
     *
     * Une étoile lue s'ouvre elle-même.
     * Une étoile non lue remonte le graphe jusqu'à trouver
     * l'étoile lue la plus proche.
     * À défaut, retour à entryStar.
     */
    function resolveAccessibleStar(constellationId, constellation, starId) {
        if (isRead(constellationId, starId)) {
            return starId;
        }

        const visited = new Set();
        let frontier = [starId];

        while (frontier.length > 0) {
            const nextFrontier = [];

            for (const currentId of frontier) {
                if (visited.has(currentId)) {
                    continue;
                }

                visited.add(currentId);

                for (const parentId of getParents(constellation, currentId)) {
                    if (isRead(constellationId, parentId)) {
                        return parentId;
                    }

                    nextFrontier.push(parentId);
                }
            }

            frontier = nextFrontier;
        }

        return constellation.entryStar;
    }

    /* <!-- ouverture étoile selon progression --> */
    function openFromGalaxy(constellationId, constellation, requestedStarId) {
        const accessibleStarId = resolveAccessibleStar(
            constellationId,
            constellation,
            requestedStarId,
        );

        const accessibleStar = getStar(constellation, accessibleStarId);

        if (!accessibleStar) {
            console.error(
                "Étoile introuvable :",
                constellationId,
                accessibleStarId,
            );
            return;
        }

        window.GalaxyCard?.open(accessibleStar.source);
    }

    /* <!-- création couche SVG filaments --> */
    function getFilamentLayer() {
        const sky = document.getElementById("galaxy-test");

        if (!sky) {
            return null;
        }

        let svg = document.getElementById("galaxy-filaments");

        if (!svg) {
            svg = document.createElementNS(SVG_NS, "svg");
            svg.id = "galaxy-filaments";
            svg.setAttribute("aria-hidden", "true");

            sky.prepend(svg);
        }

        return svg;
    }

    /* <!-- dessin filaments lus --> */
    function renderFilaments() {
        const svg = getFilamentLayer();

        if (!svg) {
            return;
        }

        svg.replaceChildren();

        for (const [constellationId, entry] of constellations) {
            const { constellationData, constellation } = entry;

            for (const link of constellation.links ?? []) {
                if (
                    !isRead(constellationId, link.from) ||
                    !isRead(constellationId, link.to)
                ) {
                    continue;
                }

                const from = getStar(constellation, link.from);
                const to = getStar(constellation, link.to);

                if (!from || !to) {
                    continue;
                }

                const line = document.createElementNS(SVG_NS, "line");

                /* <!-- conversion coordonnées monde vers écran --> */
                const sky = document.getElementById("galaxy-test");
                const skyRect = sky.getBoundingClientRect();

                const centerX = skyRect.width / 2;
                const centerY = skyRect.height / 2;

                const x1 = centerX + constellationData.x + from.x;
                const y1 = centerY + constellationData.y + from.y;

                const x2 = centerX + constellationData.x + to.x;
                const y2 = centerY + constellationData.y + to.y;

                line.setAttribute("x1", x1);
                line.setAttribute("y1", y1);
                line.setAttribute("x2", x2);
                line.setAttribute("y2", y2);
                line.classList.add("galaxy-filament");

                svg.appendChild(line);
            }
        }
    }

    /* <!-- branchement clics étoiles existantes --> */
    function registerConstellation(constellationData, constellation) {
        constellations.set(constellationData.id, {
            constellationData,
            constellation,
        });

        for (const starData of constellation.stars) {
            const starElement = document.querySelector(
                `[data-star-src="${starData.source}"]`,
            );

            if (!starElement) {
                continue;
            }

            /*
             * L'ancien createGalaxyStar possède déjà son listener.
             * On intercepte donc le clic avant qu'il l'atteigne.
             */
            starElement.addEventListener(
                "click",
                (event) => {
                    event.stopImmediatePropagation();

                    openFromGalaxy(
                        constellationData.id,
                        constellation,
                        starData.id,
                    );
                },
                true,
            );
        }

        renderFilaments();
    }

    /* <!-- chargement topologie Galaxy --> */
    async function initialiseGalaxyNavigation() {
        const galaxyResponse = await fetch("data/galaxy.json");

        if (!galaxyResponse.ok) {
            throw new Error(
                `Impossible de charger data/galaxy.json (${galaxyResponse.status})`,
            );
        }

        const galaxy = await galaxyResponse.json();

        for (const constellationData of galaxy.constellations ?? []) {
            const response = await fetch(constellationData.source);

            if (!response.ok) {
                throw new Error(
                    `Impossible de charger ${constellationData.source} (${response.status})`,
                );
            }

            const constellation = await response.json();

            registerConstellation(constellationData, constellation);
        }
    }

    /* <!-- actualisation après lecture étoile --> */
    window.addEventListener("galaxy:star-read", () => {
        renderFilaments();
    });

    /* <!-- lancement navigation Galaxy --> */
    window.addEventListener("load", () => {
        initialiseGalaxyNavigation().catch((error) => {
            console.error("Erreur initialisation navigation Galaxy :", error);
        });
    });
})();
