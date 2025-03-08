# Ajouter l'extension
- Allez dans chrome://extensions/ sur google avec votre compte connecté
- Charger l'extension non empaquetée
- importer le folder de ce projet
- Aller sur l'intra et activer l'extension google 


# Documentation de l'Extension de Gestion des Couleurs

Cette documentation présente une vue d'ensemble de l'organisation et du fonctionnement de l'extension qui permet de gérer dynamiquement des variables CSS à partir d'une interface (popup).

---

## 1. Organisation des Couleurs

## TODO

- [ ] Générer une case à cocher pour activer/désactiver les couleurs custom
- [ ] Intégrer le localStorage pour :
  - Sauvegarder les custom colors
  - Permettre l'exportation et l'importation des custom colors
- [ ] Créer plusieurs profils custom pour gérer différentes configurations de couleurs
- [ ] Suggerer a l'utilisateurs des patterns custom cohérent pour la gestion des custom colors (ex : que les couleur allant de 50 à 300)
- [ ] Intégrer une nouvelle librairie CSS pour la gestion des custom colors, il existe d'autre package, le premier est en flat
- [ ] Améliorer la disposition des boutons dans l'interface
- [ ] Ajouter un menu (si nécessaire) pour accéder aux options supplémentaires




- **Liste des Couleurs**  
  La variable `colors` contient une liste de noms de couleurs (ex. `"turquoise"`, `"green-sea"`, `"emerald"`, etc.).

- **Intensités des Couleurs**  
  La variable `colorsIntensity` contient les suffixes d'intensité (ex. `""`, `"-50"`, `"-100"`, …) qui permettent de générer des classes dynamiques comme `"peter-river-50"`.

---

## 2. Structure du Front-End (Popup)

- **Boutons Custom**  
  Dans la popup, plusieurs boutons ont des identifiants commençant par `"custom-"` (par exemple : `custom-primary`, `custom-secondary`, etc.).  
  - Ces boutons représentent les différents types de variables CSS personnalisées.
  - Lorsqu’un bouton est cliqué, il passe de l'état inactif (`neu-button-inactive`) à l'état actif (`neu-button-active`).
  - Lors du clic, l'objet global `currentCustomColor` est mis à jour en définissant la propriété `type` (en retirant le préfixe `"custom-"` de l'ID).

- **Palette de Couleurs**  
  La palette est générée dynamiquement à partir des tableaux `colors` et `colorsIntensity`.  
  - Chaque couleur est affichée dans un bouton créé dans une `div`.
  - Lorsqu’un bouton de la palette est cliqué, sa couleur (récupérée via `getComputedStyle`) est assignée à `currentCustomColor.value`.
  - Un message est alors envoyé au background pour mettre à jour la variable CSS correspondante dans la page active.

---

## 3. Les Listeners

### 3.1. Listeners sur les Boutons Custom

- **Action :**  
  Lorsque l'utilisateur clique sur un bouton custom, le listener :
  - Active ou désactive le bouton (en basculant entre `neu-button-active` et `neu-button-inactive`).
  - Met à jour `currentCustomColor.type` (extrait de l'ID du bouton en supprimant `"custom-"`).
  - Stocke l'ID actif dans la variable `activeButtonId` pour assurer que la bonne variable est modifiée.

### 3.2. Listeners sur la Palette de Couleurs

- **Action :**  
  Lorsque l'utilisateur clique sur un bouton de la palette :
  - Le listener vérifie qu'un bouton custom a déjà été sélectionné (via `activeButtonId`).
  - Il récupère la couleur affichée sur le bouton cliqué et met à jour `currentCustomColor.value`.
  - Ensuite, un message est envoyé (via `chrome.runtime.sendMessage`) avec l'objet `currentCustomColor` afin que la variable CSS correspondante soit mise à jour dans la page active.

---

## 4. Le Background Script

Le **background.js** gère la logique centrale et la communication entre la popup et la page active :

- **Écoute des messages :**  
  Le background écoute les messages envoyés (par exemple, l'action `"changeCustomColor"`) contenant l'objet `currentCustomColor`.

- **Injection de Script :**  
  À réception d'un message pour changer la couleur, il utilise `chrome.scripting.executeScript` pour injecter un script dans la page active.  
  Ce script modifie la variable CSS sur la page en exécutant :
  ```js
  document.documentElement.style.setProperty('--' + newColor.type, newColor.value);
