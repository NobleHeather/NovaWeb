function validerQuiz() {
    const reponses = {
        q1: ["alienor"],
        q2: ["nova"],
        q3: ["alienor"],
        q4: ["alienor"],
        q5: ["nova"],
        q6: ["nova"],
        q7: ["nova"],
        q8: ["alienor"],
        q9: ["alienor", "nova"],
    };

    let score = 0;

    for (let i = 1; i <= 9; i++) {
        const ligne = document.getElementById(`ligne-q${i}`);
        const alienor = document.getElementById(`q${i}-alienor`);
        const nova = document.getElementById(`q${i}-nova`);

        let user = [];
        if (alienor.checked) user.push("alienor");
        if (nova.checked) user.push("nova");

        const estBonne =
            reponses[`q${i}`].length === user.length &&
            reponses[`q${i}`].every((val) => user.includes(val));

        if (estBonne) {
            //     ligne.classList.add("bg-success", "text-white");
            score++;
        } else {
            //     ligne.classList.add("bg-danger", "text-white");
        }

        // Bordure autour des bonnes réponses

        if (reponses[`q${i}`].includes("alienor")) {
            alienor.style.outline = "2px solid #7b2cbf"; // violet de la palette
            alienor.style.outlineOffset = "2px";
            ligne.classList.add("bg-info", "text-white");
        }

        if (reponses[`q${i}`].includes("nova")) {
            nova.style.outline = "2px solid #f554bb"; // rose de la palette
            nova.style.outlineOffset = "2px";
            ligne.classList.add("bg-warning", "text-white");
        }
    }

    // Résultat global
    const feedback = document.createElement("div");
    feedback.className = "mt-4 fw-bold";
    feedback.textContent = `Résultat : ${score}/9`;
    document.getElementById("quiz-form").appendChild(feedback);
}

// 👂 Bouton de validation du formulaire
const bouton = document.getElementById("valider");
if (bouton) {
    bouton.addEventListener("click", function (event) {
        event.preventDefault(); // <-- ceci empêche le rechargement de la page
        validerQuiz(); // appelle ta fonction normalement
    });
}

//test temp
// if (bouton) {
//     bouton.addEventListener("click", () => {
//         bouton.disabled = true;
//         bouton.textContent = "✔️ Envoyé";
//         bouton.classList.add("btn-secondary");
//     });
// }
