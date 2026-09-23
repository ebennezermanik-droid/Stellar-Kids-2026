/* =========================================================
   STELLAR KIDS
   GAME: SUSUN PLANET
   susunplanet.js
========================================================= */


/* =========================================================
   URUTAN PLANET YANG BENAR
   Berdasarkan jarak dari Matahari
========================================================= */

const correctOrder = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune"
];


/* =========================================================
   NAMA PLANET
========================================================= */

const planetNames = {

  mercury: "Merkurius",

  venus: "Venus",

  earth: "Bumi",

  mars: "Mars",

  jupiter: "Jupiter",

  saturn: "Saturnus",

  uranus: "Uranus",

  neptune: "Neptunus"

};


/* =========================================================
   VARIABEL GAME
========================================================= */

let draggedPlanet = null;

let score = 0;

let attempts = 3;

let mistakes = 0;

let timeLeft = 60;

let timerInterval = null;

let gameStarted = false;

let gameFinished = false;


/* =========================================================
   ELEMENT HTML
========================================================= */

const dropZone =
  document.getElementById("drop-zone");

const planetContainer =
  document.getElementById("planet-container");

const placeholder =
  document.getElementById("placeholder");

const scoreElement =
  document.getElementById("score");

const timerElement =
  document.getElementById("timer");

const attemptsElement =
  document.getElementById("attempts");

const progressText =
  document.getElementById("progressText");

const progressFill =
  document.getElementById("progressFill");

const notification =
  document.getElementById("notification");

const hintBtn =
  document.getElementById("hintBtn");

const hintBox =
  document.getElementById("hintBox");

const checkBtn =
  document.getElementById("checkBtn");

const resultModal =
  document.getElementById("resultModal");

const resultIcon =
  document.getElementById("resultIcon");

const resultTitle =
  document.getElementById("resultTitle");

const resultMessage =
  document.getElementById("resultMessage");

const finalScore =
  document.getElementById("finalScore");

const finalTime =
  document.getElementById("finalTime");

const finalMistakes =
  document.getElementById("finalMistakes");

const factText =
  document.getElementById("factText");

const restartBtn =
  document.getElementById("restartBtn");


/* =========================================================
   START GAME
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializeGame
);


function initializeGame() {

  setupDragAndDrop();

  shufflePlanets();

  updateProgress();

  updateStats();

  startTimer();

}


/* =========================================================
   SHUFFLE PLANETS
========================================================= */

function shufflePlanets() {

  const cards =
    Array.from(
      planetContainer.querySelectorAll(
        ".planet-card"
      )
    );


  cards.sort(
    () => Math.random() - 0.5
  );


  cards.forEach(
    card => planetContainer.appendChild(card)
  );

}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

  gameStarted = true;

  gameFinished = false;


  clearInterval(timerInterval);


  timerInterval = setInterval(
    () => {

      if (
        !gameStarted ||
        gameFinished
      ) {

        return;

      }


      timeLeft--;


      updateStats();


      if (timeLeft <= 0) {

        timeLeft = 0;

        updateStats();

        endGame(
          false,
          "Waktu habis! Coba lagi dan susun planet dengan lebih cepat."
        );

      }

    },
    1000
  );

}


/* =========================================================
   DRAG & DROP SETUP
========================================================= */

function setupDragAndDrop() {

  const cards =
    document.querySelectorAll(
      ".planet-card"
    );


  cards.forEach(
    card => {

      card.addEventListener(
        "dragstart",
        dragStart
      );


      card.addEventListener(
        "dragend",
        dragEnd
      );

    }
  );


  dropZone.addEventListener(
    "dragover",
    dragOver
  );


  dropZone.addEventListener(
    "dragenter",
    dragEnter
  );


  dropZone.addEventListener(
    "dragleave",
    dragLeave
  );


  dropZone.addEventListener(
    "drop",
    dropPlanet
  );

}


/* =========================================================
   DRAG START
========================================================= */

function dragStart(event) {

  if (gameFinished) {

    return;

  }


  draggedPlanet =
    event.currentTarget;


  draggedPlanet.classList.add(
    "dragging"
  );


  event.dataTransfer.effectAllowed =
    "move";


  event.dataTransfer.setData(
    "text/plain",
    draggedPlanet.dataset.planet
  );

}


/* =========================================================
   DRAG END
========================================================= */

function dragEnd() {

  if (!draggedPlanet) {

    return;

  }


  draggedPlanet.classList.remove(
    "dragging"
  );


  draggedPlanet = null;

}


/* =========================================================
   DRAG OVER
========================================================= */

function dragOver(event) {

  event.preventDefault();


  if (!draggedPlanet) {

    return;

  }


  event.dataTransfer.dropEffect =
    "move";

}


/* =========================================================
   DRAG ENTER
========================================================= */

function dragEnter(event) {

  event.preventDefault();


  if (gameFinished) {

    return;

  }


  dropZone.classList.add(
    "drag-over"
  );

}


/* =========================================================
   DRAG LEAVE
========================================================= */

function dragLeave(event) {

  if (
    event.relatedTarget &&
    dropZone.contains(
      event.relatedTarget
    )
  ) {

    return;

  }


  dropZone.classList.remove(
    "drag-over"
  );

}


/* =========================================================
   DROP PLANET
========================================================= */

function dropPlanet(event) {

  event.preventDefault();


  dropZone.classList.remove(
    "drag-over"
  );


  if (
    !draggedPlanet ||
    gameFinished
  ) {

    return;

  }


  /*
    Cek apakah pemain menjatuhkan
    planet di atas planet lain.
  */

  const targetCard =
    event.target.closest(
      ".planet-card"
    );


  /*
    Jika dijatuhkan di atas planet lain,
    tentukan apakah diletakkan sebelum
    atau sesudah planet tersebut.
  */

  if (
    targetCard &&
    targetCard !== draggedPlanet &&
    targetCard.parentElement === dropZone
  ) {

    const rect =
      targetCard.getBoundingClientRect();


    const middle =
      rect.left +
      rect.width / 2;


    if (
      event.clientX < middle
    ) {

      dropZone.insertBefore(
        draggedPlanet,
        targetCard
      );

    } else {

      dropZone.insertBefore(
        draggedPlanet,
        targetCard.nextSibling
      );

    }

  } else {

    /*
      Jika drop di area kosong,
      tambahkan ke akhir.
    */

    dropZone.appendChild(
      draggedPlanet
    );

  }


  updateProgress();

}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateProgress() {

  const placedCards =
    dropZone.querySelectorAll(
      ".planet-card"
    ).length;


  progressText.textContent =
    `${placedCards} / ${correctOrder.length}`;


  const percentage =
    (
      placedCards /
      correctOrder.length
    ) * 100;


  progressFill.style.width =
    `${percentage}%`;


  if (placeholder) {

    placeholder.style.display =
      placedCards === 0
        ? "block"
        : "none";

  }

}


/* =========================================================
   CEK JAWABAN
========================================================= */

function checkOrder() {

  if (gameFinished) {

    return;

  }


  const cards =
    Array.from(
      dropZone.querySelectorAll(
        ".planet-card"
      )
    );


  /*
    Pastikan semua planet
    sudah dipindahkan.
  */

  if (
    cards.length !==
    correctOrder.length
  ) {

    showNotification(
      "⚠️ Susun semua 8 planet terlebih dahulu.",
      "warning"
    );

    return;

  }


  const userOrder =
    cards.map(
      card =>
        card.dataset.planet
    );


  const isCorrect =
    JSON.stringify(userOrder) ===
    JSON.stringify(correctOrder);


  /* ========================================
     JAWABAN BENAR
  ======================================== */

  if (isCorrect) {

    const timeBonus =
      timeLeft * 10;


    const attemptBonus =
      attempts * 50;


    score +=
      500 +
      timeBonus +
      attemptBonus;


    updateStats();


    cards.forEach(
      card => {

        card.classList.add(
          "correct-card"
        );

      }
    );


    showNotification(
      "🎉 Luar biasa! Urutan planet benar!",
      "success"
    );


    setTimeout(
      () => {

        endGame(
          true,
          "Kamu berhasil menyusun seluruh planet dengan benar!"
        );

      },
      1000
    );


    return;

  }


  /* ========================================
     JAWABAN SALAH
  ======================================== */

  attempts--;

  mistakes++;


  updateStats();


  if (attempts <= 0) {

    showNotification(
      "💥 Kesempatanmu sudah habis.",
      "error"
    );


    setTimeout(
      () => {

        endGame(
          false,
          "Kesempatanmu sudah habis. Coba pelajari kembali urutan planet."
        );

      },
      1000
    );


    return;

  }


  /*
    Cari posisi pertama yang salah.
  */

  const firstWrongIndex =
    userOrder.findIndex(
      (planet, index) =>
        planet !==
        correctOrder[index]
    );


  let message =
    "❌ Urutan masih belum tepat.";


  if (
    firstWrongIndex !== -1
  ) {

    const position =
      firstWrongIndex + 1;


    message =
      `❌ Posisi ke-${position} belum tepat. Coba periksa kembali urutan planet.`;

  }


  showNotification(
    `${message} ❤️ Kesempatan tersisa: ${attempts}`,
    "error"
  );

}


/* =========================================================
   HINT
========================================================= */

function showHint() {

  if (gameFinished) {

    return;

  }


  const cards =
    Array.from(
      dropZone.querySelectorAll(
        ".planet-card"
      )
    );


  /*
    Jika belum ada planet,
    beri petunjuk awal.
  */

  if (cards.length === 0) {

    hintBox.hidden = false;

    hintBox.textContent =
      "💡 Petunjuk: Mulailah dengan Merkurius, planet yang paling dekat dengan Matahari.";

    return;

  }


  /*
    Cari posisi pertama
    yang tidak sesuai.
  */

  const firstWrongIndex =
    cards.findIndex(
      (card, index) =>
        card.dataset.planet !==
        correctOrder[index]
    );


  /*
    Jika semua yang sudah disusun benar.
  */

  if (
    firstWrongIndex === -1
  ) {

    hintBox.hidden = false;

    hintBox.textContent =
      "💡 Bagus! Semua planet yang sudah kamu susun berada pada posisi yang benar.";

    return;

  }


  const expectedPlanet =
    planetNames[
      correctOrder[
        firstWrongIndex
      ]
    ];


  hintBox.hidden = false;


  hintBox.textContent =
    `💡 Petunjuk: posisi ke-${firstWrongIndex + 1} seharusnya adalah ${expectedPlanet}.`;

}


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(
  message,
  type = "warning"
) {

  notification.textContent =
    message;


  notification.className =
    `notification ${type}`;


  notification.style.display =
    "block";


  clearTimeout(
    notification.hideTimer
  );


  notification.hideTimer =
    setTimeout(
      () => {

        notification.style.display =
          "none";

      },
      3500
    );

}


/* =========================================================
   UPDATE SCORE / TIMER / ATTEMPTS
========================================================= */

function updateStats() {

  scoreElement.textContent =
    score;


  timerElement.textContent =
    timeLeft;


  attemptsElement.textContent =
    attempts;


  /*
    Beri warning ketika waktu
    tinggal 15 detik.
  */

  timerElement.classList.toggle(
    "timer-warning",
    timeLeft <= 15
  );

}


/* =========================================================
   END GAME
========================================================= */

function endGame(
  success,
  message
) {

  if (gameFinished) {

    return;

  }


  gameFinished = true;

  gameStarted = false;


  clearInterval(
    timerInterval
  );


  /*
    Tampilkan modal hasil.
  */

  resultModal.classList.add(
    "show"
  );


  resultModal.setAttribute(
    "aria-hidden",
    "false"
  );


  /*
    Statistik akhir.
  */

  finalScore.textContent =
    score;


  finalTime.textContent =
    `${60 - timeLeft} detik`;


  finalMistakes.textContent =
    mistakes;


  /* ========================================
     HASIL BERHASIL
  ======================================== */

  if (success) {

    resultIcon.textContent =
      "🎉";


    resultTitle.textContent =
      "Misi Berhasil!";


    resultMessage.textContent =
      message;


    factText.textContent =
      "Urutan planet dari yang paling dekat hingga paling jauh dari Matahari adalah Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus.";

  }


  /* ========================================
     HASIL GAGAL
  ======================================== */

  else {

    resultIcon.textContent =
      "🚀";


    resultTitle.textContent =
      "Misi Belum Berhasil";


    resultMessage.textContent =
      message;


    factText.textContent =
      "Urutan planet dari yang paling dekat hingga paling jauh dari Matahari adalah Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus.";

  }

}


/* =========================================================
   RESTART GAME
========================================================= */

function restartGame() {

  clearInterval(
    timerInterval
  );


  /*
    Reset variabel.
  */

  score = 0;

  attempts = 3;

  mistakes = 0;

  timeLeft = 60;

  gameStarted = false;

  gameFinished = false;


  /*
    Ambil semua kartu planet.
  */

  const cards =
    Array.from(
      document.querySelectorAll(
        ".planet-card"
      )
    );


  /*
    Kembalikan semua kartu
    ke planet bank.
  */

  cards.forEach(
    card => {

      card.classList.remove(
        "correct-card",
        "dragging"
      );


      planetContainer.appendChild(
        card
      );

    }
  );


  /*
    Acak kembali.
  */

  shufflePlanets();


  /*
    Reset tampilan.
  */

  updateStats();

  updateProgress();


  notification.style.display =
    "none";


  hintBox.hidden =
    true;


  /*
    Tutup modal.
  */

  resultModal.classList.remove(
    "show"
  );


  resultModal.setAttribute(
    "aria-hidden",
    "true"
  );


  /*
    Mulai permainan lagi.
  */

  startTimer();

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

checkBtn.addEventListener(
  "click",
  checkOrder
);


hintBtn.addEventListener(
  "click",
  showHint
);


restartBtn.addEventListener(
  "click",
  restartGame
);