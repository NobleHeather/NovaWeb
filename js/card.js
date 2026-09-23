// localStorage.clear();
// localStorage.removeItem("nova-galaxy");

/* <!-- renderer card conversation --> */
(() => {
    const SPEAKER_NAMES = {
        alienor: "Aliénor",
        nova: "Nova",
    };

    /* <!-- création paragraphe conversation --> */
    function createParagraph(turn, text, isFirstParagraph) {
        const paragraph = document.createElement("p");
        paragraph.className = `star-card-turn star-card-turn--${turn.speaker}`;

        if (isFirstParagraph) {
            const speaker = document.createElement("span");
            speaker.className = "star-card-speaker";
            speaker.textContent = SPEAKER_NAMES[turn.speaker] ?? turn.speaker;

            paragraph.appendChild(speaker);
            paragraph.appendChild(document.createTextNode(" : "));
        }

        const content = document.createElement("span");
        content.innerHTML = text;
        paragraph.appendChild(content);

        return paragraph;
    }

    /* <!-- rendu étoile dans card --> */
    function render(star) {
        const content = document.getElementById("star-card-content");
        const choicesSlot = document.getElementById("star-card-choices-slot");

        /* <!-- nettoyage ancienne étoile --> */
        content.replaceChildren();
        choicesSlot.replaceChildren();

        /* <!-- rendu conversation --> */
        for (const turn of star.turns ?? []) {
            const paragraphs = turn.text?.fr ?? [];

            paragraphs.forEach((text, index) => {
                content.appendChild(createParagraph(turn, text, index === 0));
            });
        }

        /* <!-- boutons choix conversation --> */
        if (Array.isArray(star.choices) && star.choices.length > 0) {
            const choices = document.createElement("div");
            choices.className = "star-card-choices";

            for (const choice of star.choices) {
                const button = document.createElement("button");

                button.type = "button";
                button.className = "star-card-choice";
                button.textContent = choice.label?.fr ?? "Continuer";

                if (!choice.target) {
                    button.disabled = true;
                    button.classList.add("star-card-choice--unavailable");
                } else {
                    button.addEventListener("click", () => {
                        const constellationId = star.id.split("-")[0];

                        window.GalaxyCard.open(
                            `data/constellations/${constellationId}/stars/${choice.target}.json`,
                        );
                    });
                }

                choices.appendChild(button);
            }

            /* <!-- insertion choix dans barre actions --> */
            choicesSlot.appendChild(choices);
        }
        /* <!-- retour haut nouvelle étoile --> */
        content.scrollTop = 0;
    }

    /* <!-- ouverture card étoile --> */
    async function open(source) {
        const response = await fetch(source);

        if (!response.ok) {
            throw new Error(
                `Impossible de charger ${source} (${response.status})`,
            );
        }

        const star = await response.json();

        /* <!-- mémorisation étoile lue --> */
        window.GalaxyStorage.markStarRead(star.id);

        /* <!-- signal lecture étoile --> */
        window.dispatchEvent(
            new CustomEvent("galaxy:star-read", {
                detail: {
                    starId: star.id,
                },
            }),
        );

        render(star);

        const layer = document.getElementById("star-card-layer");
        layer.hidden = false;

        /* <!-- ouverture card toujours en haut --> */
        requestAnimationFrame(() => {
            const content = document.getElementById("star-card-content");
            content.scrollTop = 0;
        });

        document.getElementById("star-card-close").focus();
    }

    /* <!-- fermeture card étoile --> */
    function close() {
        document.getElementById("star-card-layer").hidden = true;
        document.getElementById("star-c0001-s0001")?.focus();
    }

    /* <!-- événements card --> */
    document.addEventListener("DOMContentLoaded", () => {
        document
            .getElementById("star-card-close")
            ?.addEventListener("click", close);
    });

    /* <!-- API publique card --> */
    window.GalaxyCard = {
        open,
        close,
    };
})();
