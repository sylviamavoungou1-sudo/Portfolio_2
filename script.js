// ===== petit script : le site fonctionne aussi sans, il ajoute juste du confort =====

var conteneur = document.getElementById('conteneur');
var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
var interrupteur = document.getElementById('interrupteur-theme');

// ----- theme : on se souvient du choix (jour / nuit) -----
if (document.documentElement.classList.contains('jour-au-demarrage')) {
  interrupteur.checked = true;
}

interrupteur.addEventListener('change', function () {
  try {
    localStorage.setItem('theme', interrupteur.checked ? 'jour' : 'nuit');
  } catch (e) {}
  interrupteur.setAttribute('aria-label', interrupteur.checked ? 'Activer le mode nuit' : 'Activer le mode jour');
});

// ----- navigation : on change de page uniquement en cliquant sur le menu -----
// (le glissement a la molette, au trackpad ou au doigt est desactive dans le CSS)
var numeroCourant = 0;

function allerA(numero, animation) {
  numeroCourant = numero;
  conteneur.scrollTo({ left: numero * conteneur.clientWidth, behavior: animation ? 'smooth' : 'auto' });
}

function numeroDe(id) {
  return pages.findIndex(function (page) { return page.id === id; });
}

// tous les liens internes (menu, logo, bouton "Voir mes projets"...)
document.querySelectorAll('a[href^="#"]').forEach(function (lien) {
  lien.addEventListener('click', function (e) {
    var numero = numeroDe(lien.getAttribute('href').slice(1));
    if (numero < 0) return;
    e.preventDefault();
    allerA(numero, true);
    history.replaceState(null, '', lien.getAttribute('href'));
  });
});

// si on arrive avec une adresse du type ...index.html#projets
function allerAuHash() {
  var numero = numeroDe(location.hash.slice(1));
  if (numero >= 0) allerA(numero, false);
}
allerAuHash();
window.addEventListener('load', allerAuHash);

// quand la fenetre change de taille, on reste bien cale sur la page en cours
window.addEventListener('resize', function () {
  allerA(numeroCourant, false);
});

// ----- page visible : on met en avant le bon point / lien et on lance l'animation -----
var liens = document.querySelectorAll('.nav-liens a');

var observateur = new IntersectionObserver(function (entrees) {
  entrees.forEach(function (entree) {
    if (!entree.isIntersecting) {
      entree.target.classList.remove('visible');
      return;
    }
    entree.target.classList.add('visible');
    liens.forEach(function (lien) {
      var estActif = lien.getAttribute('href') === '#' + entree.target.id;
      lien.classList.toggle('actif', estActif);
      if (estActif) {
        lien.setAttribute('aria-current', 'true');
      } else {
        lien.removeAttribute('aria-current');
      }
    });
  });
}, { root: conteneur, threshold: 0.6 });

pages.forEach(function (page) { observateur.observe(page); });

// ----- accueil : texte qui s'ecrit tout seul, comme dans un terminal -----
var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var zoneTexte = document.getElementById('texte-tape');

var phrases = [
  "développeuse d'applications",
  'curieuse, rigoureuse et autonome',
  'passionnée de cybersécurité',
  'C++ · Java · JavaScript · SQL',
  'disponible en stage dès le 29/03/2027'
];

if (zoneTexte && !mouvementReduit) {
  var numeroPhrase = 0;
  var nbLettres = zoneTexte.textContent.length;
  var efface = true; // on commence par effacer la phrase deja affichee

  function taper() {
    var phrase = phrases[numeroPhrase];
    var attente;

    if (efface) {
      nbLettres--;
      attente = 35;
      if (nbLettres <= 0) {
        efface = false;
        numeroPhrase = (numeroPhrase + 1) % phrases.length;
        attente = 400;
      }
    } else {
      nbLettres++;
      attente = 70 + Math.random() * 60; // vitesse un peu irreguliere, plus naturelle
      if (nbLettres >= phrase.length) {
        efface = true;
        attente = 2200; // on laisse la phrase affichee un moment
      }
    }

    zoneTexte.textContent = phrases[numeroPhrase].slice(0, Math.max(nbLettres, 0));
    setTimeout(taper, attente);
  }

  setTimeout(taper, 2500);
}

// ----- accueil : les taches de couleur suivent un peu la souris -----
var fondAnime = document.querySelector('.fond-anime');

if (fondAnime && !mouvementReduit) {
  document.addEventListener('mousemove', function (e) {
    var x = (e.clientX / window.innerWidth - 0.5) * 40;
    var y = (e.clientY / window.innerHeight - 0.5) * 40;
    fondAnime.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  });
}
