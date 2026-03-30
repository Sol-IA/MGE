# Prompt pour generer un article de blog — My Green Event

Copie-colle ce prompt dans Claude en remplacant les parties entre crochets par tes infos.

---

## Le prompt a copier-coller :

```
Tu es un redacteur web specialise en mariage eco-responsable et SEO.

Genere un article de blog HTML complet pour le site My Green Event (wedding planner eco-responsable en Provence).

## Sujet de l'article :
[COLLE TON BROUILLON OU DECRIS LE SUJET ICI]

## Consignes :
- Le fichier doit commencer par un bloc de metadonnees en commentaire HTML (voir format ci-dessous)
- Optimise le SEO : title tag < 60 caracteres, meta description < 155 caracteres, structure H1/H2/H3
- Utilise un ton chaleureux, professionnel et engage
- Inclus 3-5 sections avec des titres H2
- Ajoute une liste a puces dans au moins une section
- Le contenu doit faire entre 600 et 1000 mots

## Format des metadonnees (OBLIGATOIRE en debut de fichier) :
<!--
TITLE: [Titre de l'article]
DATE: [AAAA-MM-JJ]
TAG: [Un mot-cle : Eco-responsable, Budget, Organisation, Lieu, Ceremonie, Menu, Conseils, etc.]
IMAGE: [URL de l'image principale]
EXCERPT: [Resume en 1 phrase, max 160 caracteres]
-->

## Template HTML a utiliser :
- Charset UTF-8, viewport responsive
- CSS : ../../css/style.css
- JS : ../../js/main.js
- Polices Google : Cormorant Garamond, Inter, Playfair Display
- Navigation : liens vers ../../index.html, ../../prestations.html, ../../a-propos.html, ../../blog.php, ../../faq.html, ../../presse.html, ../../contact.html
- Le contenu de l'article va dans une section .article-content a l'interieur d'un .container.container--narrow
- Inclure le header, page-header avec breadcrumbs, footer identiques aux autres articles du site
- Breadcrumbs : Accueil > Blog > Article
- Terminer par le CTA banner "Envie d'un mariage eco-responsable ?"

Genere le fichier HTML complet pret a etre depose sur le serveur.
```

---

## Comment deposer l'article :

1. Copie le code HTML genere par Claude
2. Enregistre-le en fichier `.html` (exemple : `mon-article.html`)
3. Depose-le via FTP dans le dossier `/blog/articles/`
4. C'est en ligne ! La page blog se met a jour automatiquement.

## Nommage du fichier :
- Tout en minuscules
- Tirets entre les mots (pas d'espaces, pas d'accents)
- Exemples : `fleurs-locales-durables.html`, `budget-mariage-eco.html`
