# Assets — photos à déposer ici

Place les photos suivantes dans ce dossier (en JPG ou PNG, idéalement 300 dpi pour le print) :

| Fichier attendu | Usage | Format conseillé |
|---|---|---|
| `datacenter.jpg` | Intérieur droit · zone hero photo | 1500×1000 px min, paysage |
| `facade-01.jpg` à `facade-06.jpg` | Coque architecturale (panneaux facettés) | 2000×1100 px min |
| `drone-campus.jpg` | Vue aérienne hub Doha | 1500×1000 px |
| `pastor-logo.svg` | Logo JB Pastor & Fils (vectoriel idéal) | SVG |

Une fois les fichiers déposés, recompile :

```bash
typst compile main.typ
```

Le pattern facetté généré par `components.typ → facet-pattern()` est fait
pour évoquer la coque sans avoir besoin de la photo. Tu peux donc démarrer
sans aucune photo et ajouter au fil de l'eau.
