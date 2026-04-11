# My Green Event — Guide Claude Code

Tu travailles sur le site statique de **Coralie Despinoy**, wedding planner éco-responsable à Aix-en-Provence. Site hébergé sur OVH, déployé automatiquement via GitHub Actions → FTP.

---

## Structure du projet

```
MGE/
├── index.html              ← Page d'accueil
├── prestations.html        ← Services (3 formules)
├── a-propos.html           ← Présentation Coralie
├── realisations.html       ← Portfolio mariages
├── contact.html            ← Formulaire de contact
├── blog.html               ← Liste des articles (pagination JS 9/page)
├── faq.html                ← Questions fréquentes
├── presse.html             ← Revue de presse
├── mentions-legales.html
├── cgv.html
├── 404.html
├── css/
│   ├── style.css           ← Source CSS (modifier ici)
│   └── style.min.css       ← Généré automatiquement — NE PAS MODIFIER
├── js/
│   ├── main.js             ← Source JS
│   ├── main.min.js         ← Généré automatiquement
│   ├── cookie.js           ← Bannière cookie RGPD + GTM
│   └── cookie.min.js       ← Généré automatiquement
├── assets/
│   ├── logo.png
│   ├── coralie-portrait.jpg
│   └── [photos des mariages]
├── blog/
│   └── articles/
│       ├── articles.json   ← Liste des articles pour connexes dynamiques
│       └── *.html          ← 23 articles HTML
├── agents/                 ← System prompts des agents Claude
├── .htaccess               ← Sécurité + redirections 301 + GZIP
├── sitemap.xml
└── robots.txt
```

---

## Règles importantes

### CSS
- Toujours modifier `css/style.css` (jamais `style.min.css`)
- Après chaque modification CSS, régénérer le minifié avec cette commande exacte :

```bash
python3 -c "
import re
with open('css/style.css') as f: css = f.read()
css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
css = re.sub(r'[ \t]+', ' ', css)
css = re.sub(r'\s*([{};:,>~])\s*', r'\1', css)
css = re.sub(r'\s*\{\s*', '{', css)
css = re.sub(r';\}', '}', css)
css = css.strip()
with open('css/style.min.css', 'w') as f: f.write(css)
print('CSS minifié OK:', len(css), 'bytes')
"
```

⚠️ Ce script préserve les espaces dans `calc()`. Ne pas utiliser d'autre minificateur.

### JS (cookie.js uniquement)
Après modification de `js/cookie.js`, régénérer le minifié :

```bash
python3 -c "
import re
with open('js/cookie.js') as f: js = f.read()
js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
lines = js.split('\n')
cleaned = []
for line in lines:
    if '://' in line:
        cleaned.append(line.rstrip())
    else:
        stripped = re.sub(r'\s*//(?![^\"\']*[\"\']).* $', '', line).rstrip()
        cleaned.append(stripped)
js = '\n'.join(cleaned)
js = re.sub(r'\n{2,}', '\n', js)
js = re.sub(r'[ \t]+', ' ', js)
js = js.strip()
with open('js/cookie.min.js', 'w') as f: f.write(js)
print('JS minifié OK:', len(js), 'bytes')
"
```

### Navigation
Chaque page doit avoir le même bloc nav. L'ordre des liens est :
`Accueil | Prestations | À propos | Réalisations | Blog | FAQ | Presse | [Contact bouton]`

La page active a `class="active"` sur son lien.

### Padding hero/page-header
Le header fait **100px** de haut (position fixed). Toutes les pages internes utilisent `.page-header` qui a déjà le bon padding. Ne pas modifier sans raison.

---

## Design system — variables CSS principales

```css
--color-primary: #5c8a3c       /* Vert principal */
--color-accent: #DEBEB2         /* Rose poudré */
--color-accent-dark: #9e6a50   /* Terracotta */
--color-bg-green: #f0f5eb      /* Fond vert clair */
--color-bg-warm: #fdf6f0       /* Fond beige chaud */
--font-body: 'Inter'
--font-heading: 'Playfair Display'
--font-accent: 'Cormorant Garamond'
```

---

## Déploiement

Le déploiement est **automatique** : un `git push` sur la branche `main` déclenche GitHub Actions qui FTP les fichiers sur OVH.

```bash
git add [fichiers modifiés]
git commit -m "Description courte de la modification"
git push
```

Le site est en ligne ~2 minutes après le push.

---

## Fichiers à ne JAMAIS modifier ni commiter

- `config.php` — clé API Brevo (gitignored)
- `send.php` — formulaire contact (gitignored)
- `subscribe.php` — newsletter (gitignored)
- `ratelimit.php` — sécurité (gitignored)

Ces fichiers existent uniquement sur le serveur OVH. Les modifier via FTP directement si besoin.

---

## Ajouter un article de blog

1. Créer `blog/articles/mon-slug.html` en copiant un article existant comme base
2. Modifier : titre, meta, contenu, date, articles connexes (avec `data-related` sur la `<div class="grid grid--3">`)
3. Ajouter l'article dans `blog.html` (section `<!-- ARTICLES GRID -->`)
4. Ajouter l'entrée dans `blog/articles/articles.json` (articles connexes dynamiques)
5. Ajouter l'entrée dans `sitemap.xml`
6. Régénérer le CSS si des styles ont changé
7. `git add` + `git commit` + `git push`

## Modifier les informations de Coralie

Pour toute modification de nom, téléphone, email, adresse :
- `mentions-legales.html` (section Éditeur)
- `cgv.html` (section préambule)
- Tous les footers (chercher avec grep)
- `index.html` (JSON-LD schema.org)

---

## Ce que tu dois demander à Coralie avant de modifier

- Toute suppression de section ou de page
- Tout changement de prix
- Tout ajout d'un nouveau prestataire ou partenaire nommément cité
