# Migration vers NAO SOUCI

L’ancien générateur de poèmes, son graphe de tags et le jardin local sont remplacés par un flux en cinq temps. Le domaine est désormais isolé dans `src/journey` : données de choix, partition indépendante, bibliothèque de scènes, résolution et validation. L’interface ne consomme que le résultat composé et le stockage des traversées reste derrière un module dédié, afin de pouvoir changer de média ou de persistance sans modifier le parcours.

La première livraison rend uniquement le texte. Le contrat des scènes et le répartiteur de médias préservent toutefois les emplacements audio, vidéo, SVG et Three.js, avec repli systématique vers le texte.
