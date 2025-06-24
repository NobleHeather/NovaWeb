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

let currentPage = 1;
const totalPages = 15; // tu augmenteras ce nombre si tu ajoutes plus tard d'autres pages

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
    fetch(`page${pageNumber}.html`)
        .then((response) => response.text())
        .then((data) => {
            const contentDiv = document.getElementById("content");
            contentDiv.innerHTML = data;

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

//button prev/next
window.addEventListener("DOMContentLoaded", () => {
    loadPage(1); // page initiale

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
