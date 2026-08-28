import { Module } from "@/types/curriculum";

export const CURRICULUM_DATA: Module[] = [
  {
    id: "mod-1",
    title: "Module 1 : Anatomie de l'Instrument & Repérage sur le Clavier",
    description: "Comprendre le fonctionnement acoustique et numérique du piano et maîtriser le repérage spatial des touches.",
    lessons: [
      {
        id: "lesson-1-1",
        title: "1.1 Types de Pianos, Claviers & Mécanique Interne",
        category: "Anatomy",
        description: "Distinction acoustique/numérique, rôle des marteaux et étouffoirs, alternance des touches noires.",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. Qu'est-ce qu'un son musical ?</h4>
            <p>
              Contrairement au <strong>bruit</strong> (vibration chaotique et apériodique), le <strong>son musical</strong> résulte d'une onde vibratoire régulière et harmonique.
            </p>
            <h4 class="text-lg font-semibold text-sky-400">2. Fonctionnement des Pianos Acoustiques vs Numériques</h4>
            <p>
              Dans un <strong>piano acoustique</strong> (à queue ou droit), appuyer sur une touche actionne un mécanisme à levier qui propulse un <strong>marteau garni de feutre</strong> contre des cordes en acier tendues. Dès qu'on relâche la touche, un <strong>étouffoir</strong> retombe sur la corde pour éteindre la vibration.
            </p>
            <p>
              Dans un <strong>piano numérique / clavier électronique</strong>, des capteurs de vélocité détectent la frappe et déclenchent la lecture d'échantillons sonores numérisés (sampling) restitués par des haut-parleurs.
            </p>
            <h4 class="text-lg font-semibold text-sky-400">3. Repérage des touches noires (Groupes de 2 et 3)</h4>
            <p>
              Un clavier standard comporte <strong>88 touches</strong> (ou 61 touches pour les modèles d'étude).
              Le repérage universel repose sur l'alternance visuelle :
            </p>
            <ul class="list-disc list-inside space-y-1 pl-2 text-slate-300">
              <li><strong>Groupes de 2 touches noires :</strong> le <em>Do</em> (C) se trouve toujours juste à gauche du groupe de 2 touches noires.</li>
              <li><strong>Groupes de 3 touches noires :</strong> le <em>Fa</em> (F) se trouve toujours juste à gauche du groupe de 3 touches noires.</li>
            </ul>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "C4", finger: 1, hand: "RH", durationBeats: 1 },
            { note: "D4", finger: 2, hand: "RH", durationBeats: 1 },
            { note: "E4", finger: 3, hand: "RH", durationBeats: 1 },
            { note: "F4", finger: 1, hand: "RH", durationBeats: 1 },
            { note: "G4", finger: 2, hand: "RH", durationBeats: 1 },
          ],
          bpm: 60,
        },
        practiceGuide: {
          instructions: [
            "Asseyez-vous face à votre clavier physique, le dos droit et les épaules relâchées.",
            "Parcourez du regard l'ensemble du clavier : touchez et repérez tous les groupes de 2 touches noires, puis les groupes de 3 touches noires.",
            "Posez votre index sur le Do (C) situé immédiatement à gauche de chaque paire de touches noires.",
          ],
          bpmTarget: 60,
          hand: "both",
          fingeringPattern: "Index libre pour l'exploration spatiale",
          selfChecklist: [
            "Je distingue instantanément les groupes de 2 touches noires des groupes de 3 touches noires.",
            "Je sais repérer les touches Do (C) et Fa (F) sur toute l'étendue de mon clavier physique.",
            "Je comprends la différence entre la vibration acoustique par marteaux et l'échantillonnage numérique.",
          ],
        },
        evaluation: [
          {
            id: "eval-1-1-1",
            type: "theory-quiz",
            prompt: "Dans un piano acoustique, quel élément frappe la corde pour produire la vibration sonore ?",
            options: [
              "Un plectre qui pince la corde",
              "Un marteau garni de feutre",
              "Un étouffoir amortisseur",
              "Un capteur optique",
            ],
            correctAnswerIndex: 1,
            explanation: "C'est le marteau recouvert de feutre qui est propulsé contre la corde lors de la pression sur la touche.",
          },
          {
            id: "eval-1-1-2",
            type: "theory-quiz",
            prompt: "Où se situe toujours la note 'Do' (C) sur le clavier ?",
            options: [
              "Au milieu des 3 touches noires",
              "Juste à gauche du groupe de 2 touches noires",
              "Juste à droite du groupe de 3 touches noires",
              "Entre la 2ème et la 3ème touche noire",
            ],
            correctAnswerIndex: 1,
            explanation: "Le Do (C) se trouve systématiquement sur la touche blanche située immédiatement à gauche du groupe de 2 touches noires.",
          },
          {
            id: "eval-1-1-3",
            type: "theory-quiz",
            prompt: "Quel est l'ancêtre historique du piano à cordes pincées ?",
            options: [
              "Le violoncelle",
              "L'orgue liturgique",
              "Le clavecin (Harpsichord)",
              "Le synthétiseur modulaire",
            ],
            correctAnswerIndex: 2,
            explanation: "Le clavecin pinçait les cordes à l'aide de sauteraux et de becs de plume, avant l'invention du piano-forte par Bartolomeo Cristofori permettant de frapper les cordes avec nuance.",
          },
        ],
      },
      {
        id: "lesson-1-2",
        title: "1.2 Le Do Central (Middle C) & Hauteurs de Référence",
        category: "Anatomy",
        description: "Position du Do central (C4), diapason La 440 Hz (A4) et repères cardinaux.",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. Le Do Central (Middle C / C4)</h4>
            <p>
              Le <strong>Do central (C4)</strong> est le pivot géographique et théorique du piano. Il se situe au milieu exact de l'instrument (généralement devant la serrure ou le logo de la marque sur un piano acoustique).
            </p>
            <p>
              Dans la notation musicale, le Do central est la note charnière reliant la <strong>Portée en Clé de Sol</strong> (main droite) et la <strong>Portée en Clé de Fa</strong> (main gauche), représenté sur une ligne supplémentaire au centre du système.
            </p>
            <h4 class="text-lg font-semibold text-sky-400">2. Le Diapason de Référence : Le La 440 Hz (A4)</h4>
            <p>
              Le <strong>La 440 Hz (A4)</strong> est la hauteur étalon internationale adoptée pour l'accordage des orchestres et des instruments acoustiques. Sur le clavier, le La4 se trouve dans la même octave, deux touches blanches au-dessus de Fa4 (F4).
            </p>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "C4", finger: 1, hand: "RH", durationBeats: 2 },
            { note: "A4", finger: 3, hand: "RH", durationBeats: 2 },
          ],
          bpm: 60,
        },
        practiceGuide: {
          instructions: [
            "Asseyez-vous au centre de votre instrument physique.",
            "Posez votre pouce droit (doigt 1) sur le Do central (C4).",
            "Localisez le La 440 Hz (A4) avec votre majeur droit (doigt 3).",
            "Écoutez la différence de hauteur entre C4 et A4.",
          ],
          bpmTarget: 60,
          hand: "RH",
          fingeringPattern: "C4 (Pouce 1) -> A4 (Majeur 3)",
          selfChecklist: [
            "J'ai identifié le Do central (C4) physique en face de moi.",
            "Je sais localiser immédiatement le La 440 Hz (A4) au-dessus du Do central.",
            "Ma main droite est souple, arrondie comme posée sur une petite balle.",
          ],
        },
        evaluation: [
          {
            id: "eval-1-2-1",
            type: "spotting",
            prompt: "Cliquez sur la touche du Do central (C4) sur le clavier interactif :",
            targetKeys: ["C4"],
            explanation: "Le Do central (C4) est le Do situé à la 4ème octave, au cœur du clavier.",
          },
          {
            id: "eval-1-2-2",
            type: "spotting",
            prompt: "Cliquez sur la note étalon du diapason international : le La 440 Hz (A4) :",
            targetKeys: ["A4"],
            explanation: "Le La4 (A4) vibre à 440 Hz et se situe au-dessus du Do central.",
          },
          {
            id: "eval-1-2-3",
            type: "theory-quiz",
            prompt: "À quoi correspond le Do central (C4) dans la notation en double portée ?",
            options: [
              "La ligne la plus basse de la clé de Fa",
              "La ligne supplémentaire reliant la clé de Fa et la clé de Sol",
              "La ligne médiane de la clé de Sol",
              "La note la plus aiguë du piano",
            ],
            correctAnswerIndex: 1,
            explanation: "Le Do central (C4) se note sur une ligne supplémentaire située entre la portée de clé de Fa (en bas) et la portée de clé de Sol (en haut).",
          },
        ],
      },
    ],
  },
  {
    id: "mod-2",
    title: "Module 2 : Lecture de Notes, Portées & Articulations",
    description: "Maîtriser la portée double (Grand Staff), les clés de Sol et Fa, ainsi que les nuances et articulations Legato / Staccato.",
    lessons: [
      {
        id: "lesson-2-1",
        title: "2.1 Portée, Clefs de Sol & Fa et Note Markers",
        category: "Notation",
        description: "Double portée (Grand Staff), points de repère cardinaux (C, G, F, E, B, A, D) et lecture à vue.",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. Le Système de la Double Portée (Grand Staff)</h4>
            <p>
              Le piano utilise deux portées de 5 lignes superposées :
            </p>
            <ul class="list-disc list-inside space-y-1 pl-2 text-slate-300">
              <li><strong>Portée supérieure en Clé de Sol (&𝄞;) :</strong> Dédiée principalement aux notes aiguës jouées par la <em>main droite</em>. La boucle de la clé entoure la 2ème ligne (la note Sol4 / G4).</li>
              <li><strong>Portée inférieure en Clé de Fa (&𝄢;) :</strong> Dédiée aux notes graves jouées par la <em>main gauche</em>. Les deux points encadrent la 4ème ligne (la note Fa3 / F3).</li>
            </ul>
            <h4 class="text-lg font-semibold text-sky-400">2. Les Points de Repère Cardinaux (Note Markers)</h4>
            <p>
              Pour développer une lecture à vue fluide sans compter ligne par ligne, on mémorise des points d'ancrage visuels :
            </p>
            <ul class="list-disc list-inside space-y-1 pl-2 text-slate-300">
              <li><strong>Sol (G4) :</strong> 2ème ligne en clé de Sol (repère main droite).</li>
              <li><strong>Fa (F3) :</strong> 4ème ligne en clé de Fa (repère main gauche).</li>
              <li><strong>Do central (C4) :</strong> ligne intermédiaire entre les deux clés.</li>
            </ul>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "G4", finger: 2, hand: "RH", durationBeats: 2 },
            { note: "F3", finger: 2, hand: "LH", durationBeats: 2 },
            { note: "C4", finger: 1, hand: "RH", durationBeats: 2 },
          ],
          bpm: 65,
        },
        practiceGuide: {
          instructions: [
            "Placez la main droite au-dessus de Sol4 (G4) et la main gauche au-dessus de Fa3 (F3).",
            "Jouez alternativement Sol4 (main droite, doigt 2) puis Fa3 (main gauche, doigt 2).",
            "Regardez devant vous et visualisez mentalement leur position sur la double portée.",
          ],
          bpmTarget: 65,
          hand: "both",
          fingeringPattern: "RH: G4 (2) | LH: F3 (2) | RH: C4 (1)",
          selfChecklist: [
            "Je sais que la clé de Sol indique le Sol4 sur la 2e ligne.",
            "Je sais que la clé de Fa indique le Fa3 sur la 4e ligne.",
            "Mes deux mains alternent sans hésitation ni tension dans les poignets.",
          ],
        },
        evaluation: [
          {
            id: "eval-2-1-1",
            type: "spotting",
            prompt: "Cliquez sur la note repère de la Clé de Sol : Sol4 (G4) :",
            targetKeys: ["G4"],
            explanation: "Le Sol4 (G4) est la note repère entourée par la clé de Sol (2ème ligne de la portée).",
          },
          {
            id: "eval-2-1-2",
            type: "spotting",
            prompt: "Cliquez sur la note repère de la Clé de Fa : Fa3 (F3) :",
            targetKeys: ["F3"],
            explanation: "Le Fa3 (F3) est la note repère encadrée par les deux points de la clé de Fa (4ème ligne).",
          },
          {
            id: "eval-2-1-3",
            type: "theory-quiz",
            prompt: "Quelle clé est traditionnellement attribuée au registre grave et à la main gauche au piano ?",
            options: [
              "La Clé d'Ut 3ème",
              "La Clé de Sol",
              "La Clé de Fa (Bass Clef)",
              "La Clé de Neutre rythmique",
            ],
            correctAnswerIndex: 2,
            explanation: "La Clé de Fa (&𝄢;) s'applique au registre des basses et guide la main gauche.",
          },
        ],
      },
      {
        id: "lesson-2-2",
        title: "2.2 Nuances & Articulations : Legato vs Staccato",
        category: "Notation",
        description: "Maîtrise des nuances dynamiques (p, mf, f) et des touchers Legato (lié) et Staccato (piqué).",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. Les Dynamiques & Nuances</h4>
            <p>
              L'expressivité au piano découle de la vitesse d'enfoncement de la touche :
              <em>Piano</em> (<strong>p</strong> = doux), <em>Mezzo-forte</em> (<strong>mf</strong> = modérément fort), <em>Forte</em> (<strong>f</strong> = fort).
            </p>
            <h4 class="text-lg font-semibold text-sky-400">2. Les Articulations Fondamentales</h4>
            <ul class="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>
                <strong>Legato (Jeu lié) :</strong> Indiqué par une liaison arrondie au-dessus des notes. Chaque note s'enchaîne à la suivante sans interruption de son (le doigt précédent ne quitte la touche qu'au moment précis où le suivant s'enfonce).
              </li>
              <li>
                <strong>Staccato (Jeu piqué) :</strong> Indiqué par un petit point au-dessus ou en dessous de la tête de note. La note est jouée de manière brève et détachée, avec un rebond souple du poignet.
              </li>
            </ul>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "C4", finger: 1, hand: "RH", durationBeats: 1 },
            { note: "D4", finger: 2, hand: "RH", durationBeats: 1 },
            { note: "E4", finger: 3, hand: "RH", durationBeats: 1 },
            { note: "C4", finger: 1, hand: "RH", durationBeats: 0.5 },
            { note: "D4", finger: 2, hand: "RH", durationBeats: 0.5 },
            { note: "E4", finger: 3, hand: "RH", durationBeats: 0.5 },
          ],
          bpm: 70,
        },
        practiceGuide: {
          instructions: [
            "Sur votre piano, jouez le motif Do-Ré-Mi (C4-D4-E4) avec les doigts 1-2-3 en Legato (son continu et fluide).",
            "Rejouez le même motif en Staccato (toucher bref et léger, rebond élastique).",
            "Écoutez la différence de texture sonore entre les deux modes de jeu.",
          ],
          bpmTarget: 70,
          hand: "RH",
          fingeringPattern: "C4 (1) - D4 (2) - E4 (3)",
          selfChecklist: [
            "En Legato, il n'y a aucun trou de silence entre mes notes.",
            "En Staccato, mes notes sont courtes, nettes et mon poignet reste souple.",
            "Je contrôle l'intensité sans forcer sur les articulations.",
          ],
        },
        evaluation: [
          {
            id: "eval-2-2-1",
            type: "theory-quiz",
            prompt: "Comment se note le Staccato sur une partition de piano ?",
            options: [
              "Par un trait horizontal au-dessus de la note (tenuto)",
              "Par un petit point placé directement au-dessus ou sous la note",
              "Par une grande arche de liaison reliant plusieurs mesures",
              "Par le symbole '>' d'accentuation",
            ],
            correctAnswerIndex: 1,
            explanation: "Le Staccato est noté par un point distinctif au-dessus ou au-dessous de la tête de note.",
          },
          {
            id: "eval-2-2-2",
            type: "sound-to-symbol",
            prompt: "Écoutez l'extrait musical suivant. Quelle articulation est principalement démontrée ?",
            audioPromptNotes: ["C4", "E4", "G4", "C5"],
            options: [
              "Un jeu Legato (notes liées et continues)",
              "Un jeu Staccato (notes courtes et piquées)",
              "Un glissando rapide",
              "Un accord plaqué simultané",
            ],
            correctAnswerIndex: 0,
            explanation: "L'extrait présente un phrasé fluide et continu sans interruption de son, caractéristique du Legato.",
          },
        ],
      },
    ],
  },
  {
    id: "mod-3",
    title: "Module 3 : Rythme, Valeurs de Notes & Synchronisation",
    description: "Comprendre les durées de notes et silences, la métrique binaire et ternaire (triolets), et la régularité au métronome.",
    lessons: [
      {
        id: "lesson-3-1",
        title: "3.1 Valeurs des Notes & Silences Équivalents",
        category: "Rhythm",
        description: "Ronde (4 temps), Blanche (2 temps), Noire (1 temps), Croches et silences correspondants.",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. La Pyramide des Durées Binaires</h4>
            <p>En mesure 4/4 (4 temps par mesure, la noire vaut 1 temps) :</p>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm border-collapse">
                <thead>
                  <tr class="border-b border-slate-700 text-sky-300">
                    <th class="py-2">Note</th>
                    <th class="py-2">Durée</th>
                    <th class="py-2">Silence équivalent</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td class="py-2 font-medium">Ronde (Whole note)</td>
                    <td>4 temps</td>
                    <td>Pause (Whole rest)</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-medium">Blanche (Half note)</td>
                    <td>2 temps</td>
                    <td>Demi-pause (Half rest)</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-medium">Noire (Quarter note)</td>
                    <td>1 temps</td>
                    <td>Soupir (Quarter rest)</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-medium">Croche (Eighth note)</td>
                    <td>1/2 temps</td>
                    <td>Demi-soupir (Eighth rest)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h4 class="text-lg font-semibold text-sky-400">2. Règle des Équivalences</h4>
            <p>
              1 Ronde = 2 Blanches = 4 Noires = 8 Croches = 16 Doubles-croches.
            </p>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "C4", finger: 1, hand: "RH", durationBeats: 4 },
            { note: "D4", finger: 2, hand: "RH", durationBeats: 2 },
            { note: "E4", finger: 3, hand: "RH", durationBeats: 2 },
            { note: "F4", finger: 1, hand: "RH", durationBeats: 1 },
            { note: "G4", finger: 2, hand: "RH", durationBeats: 1 },
            { note: "A4", finger: 3, hand: "RH", durationBeats: 1 },
            { note: "B4", finger: 4, hand: "RH", durationBeats: 1 },
          ],
          bpm: 60,
        },
        practiceGuide: {
          instructions: [
            "Activez le métronome à 60 BPM dans le coach de pratique.",
            "Sur votre piano, jouez sur la note Do (C4) :",
            "1. Une ronde (maintenez pendant 4 clics de métronome).",
            "2. Deux blanches (2 clics chacune).",
            "3. Quatre noires (1 clic par note).",
          ],
          bpmTarget: 60,
          hand: "RH",
          fingeringPattern: "C4 (Pouce 1) - Régularité métrique",
          selfChecklist: [
            "Je compte les temps à voix haute : 1 - 2 - 3 - 4.",
            "Mes notes commencent exactement sur le clic du métronome.",
            "Je respecte la durée exacte de maintien de chaque note sans précipiter.",
          ],
        },
        evaluation: [
          {
            id: "eval-3-1-1",
            type: "theory-quiz",
            prompt: "Combien de noires (quarter notes) durent l'équivalent d'une seule ronde en mesure 4/4 ?",
            options: ["2 noires", "3 noires", "4 noires", "8 noires"],
            correctAnswerIndex: 2,
            explanation: "Une ronde vaut 4 temps, elle équivaut donc exactement à 4 noires d'1 temps chacune.",
          },
          {
            id: "eval-3-1-2",
            type: "theory-quiz",
            prompt: "Quel silence correspond à la même durée qu'une noire (1 temps) ?",
            options: [
              "Le soupir",
              "La pause",
              "Le demi-soupir",
              "La demi-pause",
            ],
            correctAnswerIndex: 0,
            explanation: "Le soupir est le silence qui vaut exactement 1 temps, tout comme la noire.",
          },
        ],
      },
      {
        id: "lesson-3-2",
        title: "3.2 Synchronisation & Divisions Ternaires (Triolets)",
        category: "Rhythm",
        description: "Sensibilisation à la division ternaire du temps, jeu en triolet (triplets) et régularité.",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. Étymologie & Définition de la Synchronisation</h4>
            <p>
              Du grec <em>syn</em> (ensemble) et <em>chronos</em> (temps). La synchronisation pianistique consiste à coordonner la frappe et le relâchement des doigts avec une pulsation temporelle constante.
            </p>
            <h4 class="text-lg font-semibold text-sky-400">2. Le Triolet (Triplet)</h4>
            <p>
              Un <strong>triolet de croches</strong> regroupe <strong>3 notes équidistantes</strong> jouées dans le laps de temps habituellement dévolu à 2 croches ordinaires (soit 1 temps complet).
            </p>
            <p>
              On le verbalise souvent avec des onomatopées régulières : <em>« Tri-o-let »</em> ou <em>« 1 - la - li »</em>.
            </p>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "C4", finger: 1, hand: "RH", durationBeats: 1 },
            { note: "D4", finger: 2, hand: "RH", durationBeats: 1 },
            { note: "C4", finger: 1, hand: "RH", durationBeats: 0.33 },
            { note: "D4", finger: 2, hand: "RH", durationBeats: 0.33 },
            { note: "E4", finger: 3, hand: "RH", durationBeats: 0.34 },
            { note: "C4", finger: 1, hand: "RH", durationBeats: 1 },
          ],
          bpm: 60,
        },
        practiceGuide: {
          instructions: [
            "Réglez le métronome à 60 BPM.",
            "Sur une première mesure, jouez 4 noires régulières (C4-D4-E4-F4).",
            "Sur la mesure suivante, jouez des groupes de 3 notes équidistantes par battement (triolets).",
            "Veillez à ce que le premier son de chaque triolet tombe parfaitement sur le battement.",
          ],
          bpmTarget: 60,
          hand: "RH",
          fingeringPattern: "RH: 1-2-3 en pulsation ternaire",
          selfChecklist: [
            "Mes 3 notes de triolet sont d'égale intensité et d'égale durée.",
            "Le premier son de chaque groupe coïncide avec le clic du métronome.",
            "Je ne confonds pas le rythme ternaire du triolet avec un rythme pointé croche-double.",
          ],
        },
        evaluation: [
          {
            id: "eval-3-2-1",
            type: "theory-quiz",
            prompt: "Qu'est-ce qu'un triolet en musique ?",
            options: [
              "Un groupe de 3 mesures consécutives",
              "Une division ternaire où 3 notes occupent la durée normalement dévolue à 2 notes",
              "Un accord de 3 notes joué avec la pédale",
              "Un silence de 3 temps",
            ],
            correctAnswerIndex: 1,
            explanation: "Le triolet est une figure de rythme qui divise une valeur binaire en 3 parties égales.",
          },
          {
            id: "eval-3-2-2",
            type: "sound-to-symbol",
            prompt: "Écoutez la phrase rythmique suivante. S'agit-il d'une division binaire ordinaire ou d'un débit en triolets ?",
            audioPromptNotes: ["C4", "E4", "G4", "C4", "E4", "G4"],
            options: [
              "Débit en triolets (division ternaire)",
              "Débit en noires simples (1 note par temps)",
              "Silence prolongé",
              "Accords plaqués",
            ],
            correctAnswerIndex: 0,
            explanation: "Le rythme entendu découpe chaque temps en 3 impulsions égales (tri-o-let).",
          },
        ],
      },
    ],
  },
  {
    id: "mod-4",
    title: "Module 4 : Technique de Doigté & Gamme Majeure",
    description: "Numérotation universelle des doigts, principe 'Every Finger Has a Key' et formule fondamentale de la gamme majeure.",
    lessons: [
      {
        id: "lesson-4-1",
        title: "4.1 Règle Fondamentale de Doigté (Every Finger Has a Key)",
        category: "Technique",
        description: "Numérotation 1 à 5 (Pouce à Auriculaire), position de base à 5 doigts et motifs d'indépendance.",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. Numérotation Universelle des Doigts</h4>
            <p>Au piano, chaque main est numérotée de façon symétrique :</p>
            <ul class="list-disc list-inside space-y-1 pl-2 text-slate-300">
              <li><strong>1 :</strong> Pouce (Thumb)</li>
              <li><strong>2 :</strong> Index (Index)</li>
              <li><strong>3 :</strong> Majeur (Middle)</li>
              <li><strong>4 :</strong> Annulaire (Ring)</li>
              <li><strong>5 :</strong> Auriculaire (Pinky)</li>
            </ul>
            <h4 class="text-lg font-semibold text-sky-400">2. La Position de Base à 5 Doigts</h4>
            <p>
              Pour minimiser les mouvements inutiles, chaque doigt est placé au repos au-dessus d'une touche consécutive.
            </p>
            <p>
              <strong>Main Droite (Position de Do) :</strong> Pouce(1) sur C4, Index(2) sur D4, Majeur(3) sur E4, Annulaire(4) sur F4, Auriculaire(5) sur G4.<br/>
              <strong>Main Gauche (Position de Do) :</strong> Auriculaire(5) sur C3, Annulaire(4) sur D3, Majeur(3) sur E3, Index(2) on F3, Pouce(1) on G3.
            </p>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "C4", finger: 1, hand: "RH", durationBeats: 1 },
            { note: "D4", finger: 2, hand: "RH", durationBeats: 1 },
            { note: "E4", finger: 3, hand: "RH", durationBeats: 1 },
            { note: "F4", finger: 4, hand: "RH", durationBeats: 1 },
            { note: "G4", finger: 5, hand: "RH", durationBeats: 1 },
            { note: "F4", finger: 4, hand: "RH", durationBeats: 1 },
            { note: "E4", finger: 3, hand: "RH", durationBeats: 1 },
            { note: "D4", finger: 2, hand: "RH", durationBeats: 1 },
          ],
          bpm: 75,
        },
        practiceGuide: {
          instructions: [
            "Positionnez votre main droite sur C4-D4-E4-F4-G4 avec les doigts 1-2-3-4-5.",
            "Jouez le motif montant puis descendant : 1-2-3-4-5-4-3-2 à 75 BPM.",
            "Puis placez la main gauche sur C3-D3-E3-F3-G3 et exécutez le motif avec les doigts 5-4-3-2-1-2-3-4.",
          ],
          bpmTarget: 75,
          hand: "both",
          fingeringPattern: "RH: 1-2-3-4-5-4-3-2 | LH: 5-4-3-2-1-2-3-4",
          selfChecklist: [
            "Mes doigts restent naturellement courbés, sans s'aplatir sur les touches.",
            "Les doigts qui ne jouent pas restent posés souplement au contact des touches sans se crisper en l'air.",
            "Le pouce frappe avec le côté de sa pulpe, jamais à plat.",
          ],
        },
        evaluation: [
          {
            id: "eval-4-1-1",
            type: "theory-quiz",
            prompt: "À quel doigt correspond le chiffre 1 pour les deux mains en notation pianistique ?",
            options: ["L'auriculaire", "L'index", "Le pouce", "Le majeur"],
            correctAnswerIndex: 2,
            explanation: "Le chiffre 1 désigne toujours le pouce, pour la main droite comme pour la main gauche.",
          },
          {
            id: "eval-4-1-2",
            type: "theory-quiz",
            prompt: "En position de Do fondamentale à la main gauche (C3 à G3), quel doigt se place sur la note Do (C3) ?",
            options: [
              "Le doigt 1 (Pouce)",
              "Le doigt 3 (Majeur)",
              "Le doigt 5 (Auriculaire)",
              "Le doigt 2 (Index)",
            ],
            correctAnswerIndex: 2,
            explanation: "À la main gauche, la note la plus grave de la position (C3) est jouée par le doigt 5 (Auriculaire).",
          },
        ],
      },
      {
        id: "lesson-4-2",
        title: "4.2 Structure de la Gamme Majeure (W-W-H-W-W-W-H)",
        category: "Technique",
        description: "Formule Ton-Ton-Demi-ton-Ton-Ton-Ton-Demi-ton, demi-tons naturels (E-F, B-C) et transposition en Sol Majeur (F#).",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. La Formule Fondamentale de la Gamme Majeure</h4>
            <p>
              Toute gamme majeure est construite selon une succession invariable de <strong>Tons (W = Whole step)</strong> et <strong>Demi-tons (H = Half step)</strong> :
            </p>
            <div class="p-3 bg-slate-900 rounded-lg border border-sky-600/30 text-center font-mono font-bold text-sky-300 text-lg">
              Ton – Ton – Demi-ton – Ton – Ton – Ton – Demi-ton<br/>
              ( W – W – H – W – W – W – H )
            </div>
            <h4 class="text-lg font-semibold text-sky-400">2. Les Demi-tons Naturels</h4>
            <p>
              Sur le piano, deux touches blanches consécutives sans touche noire intermédiaire forment un demi-ton naturel :
            </p>
            <ul class="list-disc list-inside space-y-1 pl-2 text-slate-300">
              <li><strong>Mi – Fa (E – F)</strong></li>
              <li><strong>Si – Do (B – C)</strong></li>
            </ul>
            <h4 class="text-lg font-semibold text-sky-400">3. Transposition : La Gamme de Sol Majeur</h4>
            <p>
              En partant de Sol (G), pour respecter le demi-ton final (7e au 8e degré), nous devons hausser le Fa d'un demi-ton : il devient <strong>Fa# (F#)</strong>.
            </p>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "C4", finger: 1, hand: "RH", durationBeats: 1 },
            { note: "D4", finger: 2, hand: "RH", durationBeats: 1 },
            { note: "E4", finger: 3, hand: "RH", durationBeats: 1 },
            { note: "F4", finger: 1, hand: "RH", durationBeats: 1 },
            { note: "G4", finger: 2, hand: "RH", durationBeats: 1 },
            { note: "A4", finger: 3, hand: "RH", durationBeats: 1 },
            { note: "B4", finger: 4, hand: "RH", durationBeats: 1 },
            { note: "C5", finger: 5, hand: "RH", durationBeats: 1 },
          ],
          bpm: 75,
        },
        practiceGuide: {
          instructions: [
            "Jouez la gamme de Do Majeur (C4 à C5) en observant les deux demi-tons naturels E-F et B-C.",
            "Partez maintenant de la note Sol (G4) et appliquez la formule Ton-Ton-Demi-ton-Ton-Ton-Ton-Demi-ton.",
            "Constatez la nécessité d'utiliser la touche noire Fa# (F#4) pour le 7ème degré.",
          ],
          bpmTarget: 75,
          hand: "RH",
          fingeringPattern: "C Major & G Major (avec passage F#)",
          selfChecklist: [
            "Je sais réciter la formule W-W-H-W-W-W-H sans hésiter.",
            "Je repère les deux paires de touches blanches sans noire intermédiaire (E-F et B-C).",
            "J'ai joué la gamme de Sol majeur en intégrant correctement le Fa# (F#4).",
          ],
        },
        evaluation: [
          {
            id: "eval-4-2-1",
            type: "spotting",
            prompt: "Cliquez sur l'altération essentielle nécessaire pour former la gamme de Sol Majeur : Fa# (F#4) :",
            targetKeys: ["F#4"],
            explanation: "Le Fa# (F#4) est la note altérée indispensable pour créer le demi-ton d'attraction vers le Sol dans la gamme de Sol majeur.",
          },
          {
            id: "eval-4-2-2",
            type: "theory-quiz",
            prompt: "Quelles sont les deux paires de touches blanches séparées par un demi-ton naturel (sans touche noire) ?",
            options: [
              "Do-Ré et Fa-Sol",
              "Mi-Fa et Si-Do (E-F et B-C)",
              "Ré-Mi et La-Si",
              "Sol-La et Do-Ré",
            ],
            correctAnswerIndex: 1,
            explanation: "Entre Mi-Fa (E-F) et Si-Do (B-C), il n'y a pas de touche noire : ce sont les deux demi-tons diatoniques naturels.",
          },
        ],
      },
    ],
  },
  {
    id: "mod-5",
    title: "Module 5 : Harmonie Fondamentale, Degrés & Accords",
    description: "Comprendre les degrés piliers (I, V, VII), la tension/résolution et la construction des accords pivots (C, F, G7).",
    lessons: [
      {
        id: "lesson-5-1",
        title: "5.1 Les Trois Degrés Piliers (I, V, VII)",
        category: "Harmony",
        description: "Tonique (I - repos/stabilité), Dominante (V - tension) et Sensible (VII - attraction magnétique vers I).",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. La Notion de Degré Harmonique</h4>
            <p>
              Chaque note d'une tonalité joue un rôle fonctionnel spécifique par rapport à la note de référence :
            </p>
            <ul class="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>
                <strong>Degré I (Tonique / Tonic) :</strong> Point de départ et de résolution finale. Il apporte un sentiment absolu de repos, de stabilité et de consonance.
              </li>
              <li>
                <strong>Degré V (Dominante / Dominant) :</strong> Situé à la quinte au-dessus de la tonique. C'est le pôle d'énergie dynamique et de tension maximale qui appelle le retour vers la tonique.
              </li>
              <li>
                <strong>Degré VII (Sensible / Leading Tone) :</strong> Situé un demi-ton juste en dessous de la tonique. Son attraction magnétique vers le haut (résolution sur le I) est irrésistible.
              </li>
            </ul>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "G4", finger: 2, hand: "RH", durationBeats: 2 },
            { note: "B4", finger: 4, hand: "RH", durationBeats: 2 },
            { note: "C5", finger: 5, hand: "RH", durationBeats: 4 },
          ],
          bpm: 60,
        },
        practiceGuide: {
          instructions: [
            "Sur votre piano, jouez la note Si (B4) : écoutez attentivement le sentiment d'inachèvement et de tension (Sensible).",
            "Jouez ensuite immédiatement le Do (C5) : ressentez le soulagement et la libération de tension (Résolution sur la Tonique).",
            "Enchaînez la cadence mélodique V (Sol4) -> VII (Si4) -> I (Do5).",
          ],
          bpmTarget: 60,
          hand: "RH",
          fingeringPattern: "G4 (2) -> B4 (4) -> C5 (5)",
          selfChecklist: [
            "J'entends distinctement l'attraction magnétique de la sensible (B) vers la tonique (C).",
            "Je comprends la fonction de repos du Degré I et de tension du Degré V.",
            "Mon geste au clavier traduit la détente physique sur l'accord ou la note de résolution.",
          ],
        },
        evaluation: [
          {
            id: "eval-5-1-1",
            type: "sound-to-symbol",
            prompt: "Écoutez la phrase suivante : se termine-t-elle sur une sensation de tension non résolue (Dominante/Sensible) ou de repos parfait (Tonique) ?",
            audioPromptNotes: ["G4", "B4", "C5"],
            options: [
              "Repos parfait et accomplissement (Résolution sur la Tonique I)",
              "Tension maximale suspendue dans le vide (Dominante V)",
              "Instabilité totale",
              "Dissonance non résolue",
            ],
            correctAnswerIndex: 0,
            explanation: "La mélodie s'achève sur le Do (Tonique I), conférant une stabilité et une résolution harmonique totale.",
          },
          {
            id: "eval-5-1-2",
            type: "theory-quiz",
            prompt: "Quel est le rôle harmonique du Degré VII (Sensible) situé 1/2 ton sous la tonique ?",
            options: [
              "Créer une pause silencieuse",
              "Exercer une puissante force d'attraction vers la tonique",
              "Remplacer la basse",
              "Annuler la tonalité",
            ],
            correctAnswerIndex: 1,
            explanation: "La sensible porte ce nom car sa proximité d'un demi-ton avec la tonique crée une irrésistible tension vers le repos.",
          },
        ],
      },
      {
        id: "lesson-5-2",
        title: "5.2 Construction d'Accords & Cadence Fondamentale (C, F, G7)",
        category: "Harmony",
        description: "Accords parfaits en tierces superposées, triade de Do (C), Fa (F) et accord de 7e de dominante (G7).",
        theoryHtml: `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-sky-400">1. Qu'est-ce qu'un Accord Parfait ?</h4>
            <p>
              Un accord parfait majeur (Triade) se forme en superposant deux tierces au-dessus de sa fondamentale :
              <strong>Fondamentale + Tierce Majeure (2 tons) + Quinte Juste (3,5 tons)</strong>.
            </p>
            <h4 class="text-lg font-semibold text-sky-400">2. Les 3 Accords Magiques de la Tonalité</h4>
            <ul class="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li><strong>Accord I (Do Majeur / C) :</strong> Notes <em>Do - Mi - Sol</em> (C - E - G) avec doigtés 1 - 3 - 5.</li>
              <li><strong>Accord IV (Fa Majeur / F) :</strong> Notes <em>Do - Fa - La</em> (C - F - A en renversement) avec doigtés 1 - 3 - 5 ou 1 - 4 - 5.</li>
              <li><strong>Accord V7 (Sol 7ème / G7) :</strong> Notes <em>Si - Fa - Sol</em> (B - F - G) ou <em>Sol - Si - Ré - Fa</em> avec doigtés 1 - 2 - 4 - 5.</li>
            </ul>
            <p>
              L'enchaînement <strong>I - IV - V7 - I</strong> constitue la cadence fondamentale présente dans des milliers de chefs-d'œuvre classiques et de chansons populaires.
            </p>
          </div>
        `,
        demonstration: {
          sequence: [
            { note: "C4", finger: 1, hand: "RH", durationBeats: 2 },
            { note: "E4", finger: 3, hand: "RH", durationBeats: 2 },
            { note: "G4", finger: 5, hand: "RH", durationBeats: 2 },
            { note: "C4", finger: 1, hand: "RH", durationBeats: 2 },
          ],
          bpm: 65,
        },
        practiceGuide: {
          instructions: [
            "Placez votre main droite en accord de Do majeur : Pouce(1) sur C4, Majeur(3) sur E4, Auriculaire(5) sur G4.",
            "Enfoncez les 3 touches simultanément pour faire résonner l'accord plaqué.",
            "Entraînez-vous à enchaîner C (Do-Mi-Sol) -> F (Do-Fa-La) -> G7 (Si-Fa-Sol) -> C.",
          ],
          bpmTarget: 65,
          hand: "RH",
          fingeringPattern: "C (1-3-5) -> F (1-4-5) -> G7 (1-2-5)",
          selfChecklist: [
            "Mes 3 notes de l'accord de Do majeur sonnent exactement en même temps.",
            "Mon poignet amortit l'impact lors de la frappe de l'accord plaqué.",
            "Je reconnais la couleur lumineuse et chaleureuse de l'accord de Do majeur.",
          ],
        },
        evaluation: [
          {
            id: "eval-5-2-1",
            type: "spotting",
            prompt: "Sélectionnez l'accord parfait de Do Majeur (C4, E4, G4) sur le clavier interactif :",
            targetKeys: ["C4", "E4", "G4"],
            explanation: "L'accord parfait de Do Majeur est composé de la fondamentale Do (C4), de la tierce Mi (E4) et de la quinte Sol (G4).",
          },
          {
            id: "eval-5-2-2",
            type: "theory-quiz",
            prompt: "Comment se construit un accord parfait majeur fondamental ?",
            options: [
              "En jouant 4 notes conjointes",
              "Par la superposition d'une tierce majeure et d'une quinte juste",
              "En appuyant sur toutes les touches noires",
              "Par une seconde mineure suivie d'un triton",
            ],
            correctAnswerIndex: 1,
            explanation: "Une triade majeure fondamentale superpose une tierce majeure (4 demi-tons) et une quinte juste (7 demi-tons au-dessus de la tonique).",
          },
        ],
      },
    ],
  },
];
