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
