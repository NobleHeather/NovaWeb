/* <!-- renderer card conversation --> */
(() => {
    const SPEAKER_NAMES = {
        alienor: "Aliénor",
        nova: "Nova",
    };

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

    function render(star) {
        const content = document.getElementById("star-card-content");
        content.innerHTML = "";

        for (const turn of star.turns ?? []) {
            const paragraphs = turn.text?.fr ?? [];

            paragraphs.forEach((text, index) => {
                content.appendChild(createParagraph(turn, text, index === 0));
            });
        }
    }

    async function open(source) {
        const response = await fetch(source);

        if (!response.ok) {
            throw new Error(
                `Impossible de charger ${source} (${response.status})`,
            );
        }

        const star = await response.json();
        render(star);

        const layer = document.getElementById("star-card-layer");
        layer.hidden = false;
        document.getElementById("star-card-close").focus();
    }

    function close() {
        document.getElementById("star-card-layer").hidden = true;
        document.getElementById("star-c0001-s0001")?.focus();
    }

    document.addEventListener("DOMContentLoaded", () => {
        document
            .getElementById("star-card-close")
            ?.addEventListener("click", close);
    });

    window.GalaxyCard = { open, close };
})();
