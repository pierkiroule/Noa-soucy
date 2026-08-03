# Médias optionnels du conte

Le moteur fonctionne sans aucun fichier dans ce dossier. Les trois placeholders abstraits sont rendus localement par l'application.

Quand les vidéos définitives seront disponibles, les déposer sans modifier le code :

- `naovideo1.mp4` — **La dérive** ;
- `growth.mp4` — **Le vivant apparaît** ;
- `navigation.mp4` — **La navigation**.

Chaque média dure 12 secondes. La partition bêta dure donc 36 secondes hors pauses projectives, avec des séquences d'effets calées sur des subdivisions de 4 secondes.

Le navigateur charge directement chaque vidéo. Un fichier absent ou illisible déclenche automatiquement le placeholder correspondant, sans interrompre le conte. Cela évite de dépendre d'une requête `HEAD`, qui n'est pas prise en charge de façon uniforme par les hébergeurs de fichiers statiques.
