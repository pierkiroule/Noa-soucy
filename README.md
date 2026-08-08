# NAO SOUCI

Expérience narrative interactive autour de **La petite noix qui apprit à naviguer sur l’Océan des Soucis**. L’application déroule le conte, synchronise les vidéos et la bande-son, propose trois choix narratifs, puis ouvre un parcours facultatif de résonances métaphoriques.

## Développement

Le projet requiert une version récente de Node.js et npm.

```bash
npm install
npm run dev
```

La page d’accueil publique est disponible sur `/`. Le tag NFC de Nao pointe vers
`https://naosouci.fr/n` : cette route ouvre directement le conte, sans compte,
association ni contrôle d’accès. La progression et les préférences restent
exclusivement enregistrées dans le stockage local du navigateur.
Depuis `/`, le bouton « Découvrir le conte sans NFC » permet d’ouvrir exactement
la même route pour tester ou découvrir l’expérience sans disposer de la noix.

Commandes disponibles :

- `npm run build` : vérifie les types et produit la version de production ;
- `npm run lint` : analyse le code avec Oxlint ;
- `npm test` : exécute les tests unitaires avec le lanceur de tests de Node.js ;
- `npm run preview` : sert localement la version de production.

## Organisation

- `public/story/story.json` est la source unique du récit, des choix et de l’ordre des médias ;
- `public/story/1.mp4` à `public/story/14.mp4` sont les séquences vidéo référencées par le récit ;
- `public/story/Fond2.mp3` est la bande-son continue ;
- `src/story` charge et orchestre le récit ;
- `src/components/metaphorical-resonances` et `src/hooks/useMetaphoricalResonances.ts` portent le parcours facultatif final.

Pour modifier un chapitre, un choix ou une association de média, mettre à jour `story.json` plutôt que d’ajouter une seconde définition dans le code. Le test `src/story/storyData.test.ts` vérifie que le document reste complet et que les associations de médias respectent le contrat attendu.

## Médias

Les fichiers référencés par `story.json` sont servis depuis `/story/`. La fonction `storyMediaUrl` centralise la construction de ces URL, et le préchargement anticipe la prochaine vidéo ainsi que la bande-son sans dupliquer les données narratives.
