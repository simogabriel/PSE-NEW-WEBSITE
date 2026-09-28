# Changer les images facilement

Ce dossier est reserve aux nouvelles images du site.

1. Creez si besoin un sous-dossier : `accueil`, `apropos`, `equipe`, `solutions`, `contact` ou `blog`.
2. Copiez votre nouvelle image dans ce sous-dossier.
3. Ouvrez `images-config.js`, trouvez le nom en francais de l'image et remplissez `remplacement`.

Exemple :

```js
"accueil-principale": {
    original: "YNjImGpufX3A4nVowGVwg1MKxBY97d1.jpg",
    remplacement: "images-faciles/accueil/ma-photo.jpg",
},
```

Vous pouvez aussi simplement demander a Codex :

> Remplace `accueil-principale` par le fichier `ma-photo.jpg`.

Il n'est plus necessaire de modifier les gros fichiers HTML generes par Framer.
