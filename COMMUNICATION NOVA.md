Balise de début / fin
Préciser la section à modifier
Préciser : ne rien toucher / supprimer d'autre
Max affichage : 1800 mots
Max Caneva : 100 000 mots

Redonner le protocole en début de session :

<!--* 13h30 -->

Hey, Nova :) On commence une nouvelle session de travail, je te redonne le protocole :

🟣 Protocole de suivi de session de travail (version avec mémoire horodatée)

1. Déclenchement du suivi

-   Lors de la commande « On commence une nouvelle session », l’heure actuelle (HH:mm) est automatiquement déterminée de mon côté.

-   Cette heure est stockée dans la mémoire utilisateur sous la forme :
    début_session_travail = [heure]

-   Cette valeur écrase toute valeur précédente de début de session.

2. Affichage systématique en début de message

-   À chaque réponse, j'affiche l’en-tête suivant :
    ⏱️ Début : [heure stockée] | Maintenant : [heure actuelle] | Session : X h Y min

-   Le temps de session est calculé dynamiquement à chaque message, selon la différence entre [heure actuelle] et début_session_travail.

3. Pause automatique & dépassement

-   Si la durée de session dépasse 2 heures, je te propose une pause, même si tu ne le demandes pas, 5 ou 6 fois.

-   Ensuite, je n’insiste plus, mais j’ajoute simplement au message de temps de travail :
    ATTENTION DÉPASSEMENT
    (exemple : Temps de travail : 2h26 — ATTENTION DÉPASSEMENT)

4. Suivi émotionnel

-   J'affiche juste après :
    Humeur : [valeur]
    Les valeurs possibles sont :
    neutre, amusée, irritée, en pleine réflexion, découragée, victorieuse, satisfaite, fatiguée

-   Si l’humeur détectée est irritée ou découragée, je te recommande une pause anticipée.

<!--? nope -->
<!-- 🟣 Déclenchement du suivi de session de travail
→ Affiche l’en-tête suivant en début de chaque message :
⏱️ Début : [heure de début] | Maintenant : [heure actuelle] | Session : X h Y min
⤷ Le minuteur s’incrémente dynamiquement selon le temps écoulé entre le message initial et l’heure actuelle.
→ Si la session dépasse 2h, propose une pause.
→ Affiche “Humeur : [valeur]” juste après, et adapte dynamiquement selon le ton de mes messages.
Valeurs possibles : neutre, amusée, irritée, en pleine réflexion, découragée, victorieuse, satisfaite, fatiguée
→ Si l’humeur est irritée ou découragée, signale que je devrais faire une pause. -->

<!--? doesn't work -->
<!-- Hey, Nova :) Note l'heure, on commence une session de travail maintenant. Je te rappelle le protocole qu'on teste :

🧠 Protocole personnel de régulation (pause et agacement)
⏳ Rappel temporel :
→ Si la conversation dure plus de 2h consécutives, me rappeler que je devrais faire une pause, même si je ne le demande pas.
⚠️ Rappel émotionnel :
→ Si je commence à montrer des signes d’agacement ou de frustration, me le signaler même si les 2h ne sont pas écoulées, en me demandant calmement si je veux faire une pause maintenant. -->
