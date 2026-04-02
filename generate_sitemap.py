#!/usr/bin/env python3
"""
generate_sitemap.py — My Green Event
Génère sitemap.xml automatiquement depuis les fichiers du projet.
Usage : python3 generate_sitemap.py
À lancer avant chaque git push si des articles ou réalisations ont été ajoutés.
"""

import os, re
from datetime import date

BASE_URL = "https://mygreenevent.fr"
ARTICLES_DIR = "blog/articles"
TODAY = date.today().isoformat()

# ── Pages principales (ordre, changefreq, priority) ──────────────────────────
PAGES = [
    ("",                    "monthly", "1.0"),
    ("prestations.html",    "monthly", "0.9"),
    ("realisations.html",   "monthly", "0.9"),
    ("a-propos.html",       "monthly", "0.8"),
    ("contact.html",        "monthly", "0.8"),
    ("blog.html",           "weekly",  "0.8"),
    ("faq.html",            "monthly", "0.7"),
    ("presse.html",         "monthly", "0.6"),
]

def get_article_date(filepath):
    """Extrait la date depuis le commentaire DATE: dans l'article."""
    with open(filepath, encoding="utf-8") as f:
        content = f.read()
    m = re.search(r'DATE:\s*(\d{4}-\d{2}-\d{2})', content)
    return m.group(1) if m else TODAY

def get_file_lastmod(filename):
    """Retourne la date de dernière modification d'un fichier."""
    try:
        ts = os.path.getmtime(filename)
        from datetime import datetime
        return datetime.fromtimestamp(ts).strftime("%Y-%m-%d")
    except FileNotFoundError:
        return TODAY

def url_entry(loc, lastmod, changefreq, priority):
    return (
        f"  <url>\n"
        f"    <loc>{loc}</loc>\n"
        f"    <lastmod>{lastmod}</lastmod>\n"
        f"    <changefreq>{changefreq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        f"  </url>"
    )

# ── Construction du sitemap ───────────────────────────────────────────────────
entries = []

# Pages principales
for path, freq, prio in PAGES:
    full_path = "index.html" if path == "" else path
    loc = BASE_URL + "/" if path == "" else f"{BASE_URL}/{path}"
    lastmod = get_file_lastmod(full_path)
    entries.append(url_entry(loc, lastmod, freq, prio))

# Articles de blog — triés par date décroissante
articles = []
for fname in os.listdir(ARTICLES_DIR):
    if not fname.endswith(".html"):
        continue
    fpath = os.path.join(ARTICLES_DIR, fname)
    article_date = get_article_date(fpath)
    articles.append((article_date, fname))

articles.sort(reverse=True)  # plus récent en premier

entries.append("")  # ligne vide pour lisibilité
entries.append("  <!-- Articles de blog -->")
for article_date, fname in articles:
    loc = f"{BASE_URL}/blog/articles/{fname}"
    prio = "0.7" if article_date >= "2024-01-01" else "0.6"
    entries.append(url_entry(loc, article_date, "yearly", prio))

# ── Écriture du fichier ───────────────────────────────────────────────────────
sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n'
sitemap += "  <!-- Pages principales -->\n"
sitemap += "\n".join(e for e in entries if not e.startswith("  <!-- Articles")) + "\n"

# Séparer articles
article_block = "\n".join(e for e in entries if e.startswith("  <!-- Articles") or (e.startswith("  <url>") and "articles" in e))

# Reconstruction propre
lines = []
in_articles = False
for e in entries:
    if e == "  <!-- Articles de blog -->":
        in_articles = True
        lines.append("\n" + e)
    elif in_articles or e == "":
        lines.append(e)
    else:
        lines.append(e)

sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n'
sitemap += "  <!-- Pages principales -->\n"

for e in entries:
    if e == "":
        sitemap += "\n"
    elif e.startswith("  <!-- Articles"):
        sitemap += "\n" + e + "\n"
    else:
        sitemap += e + "\n"

sitemap += "\n</urlset>\n"

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap)

print(f"✅ sitemap.xml généré — {len(articles)} articles + {len(PAGES)} pages principales")
print(f"   Articles détectés :")
for d, f in articles[:5]:
    print(f"   · {d}  {f}")
if len(articles) > 5:
    print(f"   · ... et {len(articles)-5} autres")
