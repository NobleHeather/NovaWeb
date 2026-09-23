/* <!-- stockage persistant Galaxy --> */

window.GalaxyStorage = (() => {
    const STORAGE_KEY = "nova-galaxy";
    const STORAGE_VERSION = 1;

    /* <!-- état Galaxy par défaut --> */
    function createDefaultState() {
        return {
            version: STORAGE_VERSION,
            readStars: [],
        };
    }

    /* <!-- lecture stockage Galaxy --> */
    function load() {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return createDefaultState();
        }

        try {
            const state = JSON.parse(raw);

            if (state.version !== STORAGE_VERSION) {
                return createDefaultState();
            }

            return state;
        } catch (error) {
            console.error("GalaxyStorage: stockage illisible.", error);
            return createDefaultState();
        }
    }

    /* <!-- sauvegarde stockage Galaxy --> */
    function save(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    /* <!-- vérifier étoile lue --> */
    function isStarRead(starId) {
        const state = load();
        return state.readStars.includes(starId);
    }

    /* <!-- marquer étoile comme lue --> */
    function markStarRead(starId) {
        const state = load();

        if (!state.readStars.includes(starId)) {
            state.readStars.push(starId);
            save(state);
        }
    }

    /* <!-- API publique stockage Galaxy --> */
    return {
        load,
        isStarRead,
        markStarRead,
    };
})();
