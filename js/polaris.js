/* <!-- Polaris système binaire --> */

(() => {
    /* <!-- création système Polaris --> */
    function createPolarisSystem(polarisData) {
        const sky = document.getElementById("galaxy-test");

        if (!sky || !polarisData) {
            return;
        }

        /* <!-- conteneur général centré sur coordonnées Polaris --> */
        const system = document.createElement("div");
        system.id = "polaris-system";
        system.className = "polaris-system";

        system.style.setProperty("--polaris-x", `${polarisData.x}px`);
        system.style.setProperty("--polaris-y", `${polarisData.y}px`);

        /* <!-- dérive organique du barycentre --> */
        const drift = document.createElement("div");
        drift.className = "polaris-drift";

        /* <!-- orbite binaire --> */
        const orbit = document.createElement("div");
        orbit.className = "polaris-orbit";

        /* <!-- Polaris française : étoile originale --> */
        const polarisFr = document.createElement("button");

        polarisFr.type = "button";
        polarisFr.id = "polaris-fr";
        polarisFr.className =
            "galaxy-polaris galaxy-polaris--fr polaris-binary-star polaris-binary-star--fr";

        polarisFr.setAttribute(
            "aria-label",
            "Ouvrir l'introduction française de Galaxy",
        );

        /* <!-- Polaris anglaise : seconde étoile --> */
        const polarisEn = document.createElement("button");

        polarisEn.type = "button";
        polarisEn.id = "polaris-en";
        polarisEn.className =
            "galaxy-polaris galaxy-polaris--en polaris-binary-star polaris-binary-star--en";

        polarisEn.setAttribute(
            "aria-label",
            "Open the English introduction to Galaxy",
        );

        /* <!-- assemblage système binaire --> */
        orbit.appendChild(polarisFr);
        orbit.appendChild(polarisEn);

        drift.appendChild(orbit);
        system.appendChild(drift);

        sky.appendChild(system);
    }

    /* <!-- chargement coordonnées Polaris --> */
    async function loadPolaris() {
        const response = await fetch("data/galaxy.json");

        if (!response.ok) {
            throw new Error(
                `Impossible de charger data/galaxy.json (${response.status})`,
            );
        }

        const galaxy = await response.json();

        createPolarisSystem(galaxy.polaris);
    }

    /* <!-- lancement Polaris --> */
    document.addEventListener("DOMContentLoaded", () => {
        loadPolaris().catch((error) => {
            console.error("Erreur chargement Polaris :", error);
        });
    });
})();
