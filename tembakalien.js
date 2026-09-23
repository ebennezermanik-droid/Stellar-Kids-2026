/* =========================================================
   STELLAR KIDS - TEMBAK ALIEN
   ========================================================= */


/* =========================
   DOM
========================= */

const gameContainer = document.getElementById("game-container");
const spaceship = document.getElementById("spaceship");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

const gameResult = document.getElementById("game-over");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const startMessage = document.getElementById("game-start-message");

const resultModal = document.getElementById("result-modal");
const finalScore = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");


/* =========================
   AUDIO
========================= */

const backgroundMusic =
  document.getElementById("background-music");

const shootSound =
  document.getElementById("shoot-sound");

const hitSound =
  document.getElementById("hit-sound");


/* =========================
   GAME STATE
========================= */

let score = 0;
let timeLeft = 30;

let gameInterval = null;
let alienSpawnInterval = null;

let gameRunning = false;


/* =========================
   GAME SETTINGS
========================= */

const GAME_DURATION = 30;

const PLAYER_STEP = 18;

const BULLET_SPEED = 12;

const ALIEN_SPEED = 1.5;

const ALIEN_SPAWN_RATE = 900;


/* =========================
   PREVENT PAGE SCROLL
========================= */

document.addEventListener("keydown", function (e) {

  if (!gameRunning) {
    return;
  }

  if (
    e.key === " " ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight"
  ) {

    e.preventDefault();

  }

});


/* =========================
   KEYBOARD CONTROL
========================= */

document.addEventListener("keydown", function (e) {

  if (!gameRunning) {
    return;
  }

  const currentPosition = spaceship.offsetLeft;

  if (e.key === "ArrowLeft") {

    moveSpaceship(
      currentPosition - PLAYER_STEP
    );

  }

  else if (e.key === "ArrowRight") {

    moveSpaceship(
      currentPosition + PLAYER_STEP
    );

  }

  else if (e.key === " ") {

    shootBullet();

  }

});


/* =========================
   MOVE SPACESHIP
========================= */

function moveSpaceship(newPosition) {

  const maxPosition =
    gameContainer.clientWidth -
    spaceship.offsetWidth;

  const safePosition =
    Math.max(
      0,
      Math.min(
        newPosition,
        maxPosition
      )
    );

  spaceship.style.left =
    safePosition + "px";

  spaceship.style.transform =
    "none";

}


/* =========================
   POSITION SPACESHIP
========================= */

function resetSpaceship() {

  spaceship.style.left =
    "50%";

  spaceship.style.bottom =
    "18px";

  spaceship.style.transform =
    "translateX(-50%)";

}


/* =========================
   SHOOT
========================= */

function shootBullet() {

  if (!gameRunning) {
    return;
  }


  const bullet =
    document.createElement("img");

  bullet.src =
    "alien/Peluru@4x.png";

  bullet.className =
    "bullet";


  const shipLeft =
    spaceship.offsetLeft;

  const shipWidth =
    spaceship.offsetWidth;


  bullet.style.left =
    (
      shipLeft +
      (shipWidth / 2) -
      6
    ) + "px";

  bullet.style.bottom =
    "60px";


  gameContainer.appendChild(
    bullet
  );


  playSound(
    shootSound
  );


  const bulletInterval =
    setInterval(() => {

      if (!gameRunning) {

        bullet.remove();

        clearInterval(
          bulletInterval
        );

        return;

      }


      let bottom =
        parseFloat(
          bullet.style.bottom
        );


      bottom += BULLET_SPEED;


      bullet.style.bottom =
        bottom + "px";


      /* BULLET OUT OF AREA */

      if (
        bottom >
        gameContainer.clientHeight
      ) {

        bullet.remove();

        clearInterval(
          bulletInterval
        );

        return;

      }


      /* CHECK ALIEN */

      const aliens =
        document.querySelectorAll(
          ".alien"
        );


      aliens.forEach(
        (alien) => {

          if (
            isCollide(
              bullet,
              alien
            )
          ) {

            bullet.remove();

            alien.remove();

            clearInterval(
              bulletInterval
            );

            increaseScore();

            playSound(
              hitSound
            );

          }

        }
      );

    }, 20);

}


/* =========================
   SPAWN ALIEN
========================= */

function spawnAlien() {

  if (!gameRunning) {
    return;
  }


  const alien =
    document.createElement("img");


  const randomAlien =
    Math.floor(
      Math.random() * 4
    ) + 1;


  alien.src =
    `alien/alien${randomAlien}.png`;

  alien.className =
    "alien";


  const alienWidth =
    48;


  const maxLeft =
    Math.max(
      0,
      gameContainer.clientWidth -
      alienWidth
    );


  const randomLeft =
    Math.random() *
    maxLeft;


  alien.style.left =
    randomLeft + "px";

  alien.style.top =
    "-60px";


  gameContainer.appendChild(
    alien
  );


  const alienMovement =
    setInterval(() => {

      if (!gameRunning) {

        alien.remove();

        clearInterval(
          alienMovement
        );

        return;

      }


      let top =
        parseFloat(
          alien.style.top
        );


      top += ALIEN_SPEED;


      alien.style.top =
        top + "px";


      /* ALIEN REACHES PLAYER AREA */

      if (
        top >=
        gameContainer.clientHeight -
        80
      ) {

        alien.remove();

        clearInterval(
          alienMovement
        );

        endGame(
          "💥 Alien berhasil menembus pertahanan!"
        );

        return;

      }


      /* ALIEN HITS SPACESHIP */

      if (
        isCollide(
          spaceship,
          alien
        )
      ) {

        alien.remove();

        clearInterval(
          alienMovement
        );

        endGame(
          "💥 Pesawatmu terkena alien!"
        );

      }

    }, 30);

}


/* =========================
   COLLISION
========================= */

function isCollide(
  objectA,
  objectB
) {

  const a =
    objectA.getBoundingClientRect();

  const b =
    objectB.getBoundingClientRect();


  return !(
    a.top > b.bottom ||
    a.bottom < b.top ||
    a.right < b.left ||
    a.left > b.right
  );

}


/* =========================
   SCORE
========================= */

function increaseScore() {

  score++;

  scoreDisplay.textContent =
    score;


  /* Small visual feedback */

  scoreDisplay.animate(
    [
      {
        transform: "scale(1)"
      },

      {
        transform: "scale(1.25)"
      },

      {
        transform: "scale(1)"
      }
    ],
    {
      duration: 180
    }
  );

}


/* =========================
   START GAME
========================= */

function startGame() {

  if (gameRunning) {
    return;
  }


  gameRunning = true;


  score = 0;

  timeLeft =
    GAME_DURATION;


  scoreDisplay.textContent =
    score;

  timeDisplay.textContent =
    timeLeft;


  gameResult.textContent =
    "";


  startBtn.hidden =
    true;

  restartBtn.hidden =
    true;


  closeResultModal();


  startMessage.style.display =
    "none";


  /* CLEAR OLD OBJECTS */

  clearGameObjects();


  resetSpaceship();


  /* MUSIC */

  backgroundMusic.currentTime =
    0;

  playSound(
    backgroundMusic
  );


  /* TIMER */

  gameInterval =
    setInterval(() => {

      if (!gameRunning) {
        return;
      }


      timeLeft--;


      timeDisplay.textContent =
        timeLeft;


      if (
        timeLeft <= 0
      ) {

        endGame(
          "⏱️ Waktu habis!"
        );

      }

    }, 1000);


  /* SPAWN ALIEN */

  alienSpawnInterval =
    setInterval(
      spawnAlien,
      ALIEN_SPAWN_RATE
    );

}


/* =========================
   END GAME
========================= */

function endGame(reason) {

  if (!gameRunning) {
    return;
  }


  gameRunning = false;


  /* CLEAR INTERVALS */

  clearInterval(
    gameInterval
  );

  clearInterval(
    alienSpawnInterval
  );


  gameInterval = null;

  alienSpawnInterval = null;


  /* STOP MUSIC */

  backgroundMusic.pause();


  /* REMOVE REMAINING ALIENS */

  document
    .querySelectorAll(
      ".alien, .bullet"
    )
    .forEach(
      element => element.remove()
    );


  /* BUTTON */

  restartBtn.hidden =
    false;


  /* RESULT TEXT */

  gameResult.textContent =
    reason;


  /* FINAL SCORE */

  finalScore.textContent =
    score;


  /* RESULT MESSAGE */

  if (score >= 20) {

    resultMessage.textContent =
      "🚀 Luar biasa! Kamu adalah Space Defender sejati!";

  }

  else if (score >= 10) {

    resultMessage.textContent =
      "🌟 Hebat! Pertahanan luar angkasamu sangat kuat!";

  }

  else if (score >= 5) {

    resultMessage.textContent =
      "🛸 Bagus! Terus berlatih untuk mendapatkan skor lebih tinggi!";

  }

  else {

    resultMessage.textContent =
      "🌌 Jangan menyerah! Coba lagi dan hancurkan lebih banyak alien!";

  }


  /* SHOW MODAL */

  setTimeout(() => {

    openResultModal();

  }, 450);

}


/* =========================
   RESTART
========================= */

function restartGame() {

  /* Stop previous game */

  gameRunning = false;


  clearInterval(
    gameInterval
  );

  clearInterval(
    alienSpawnInterval
  );


  gameInterval = null;

  alienSpawnInterval = null;


  /* Reset */

  score = 0;

  timeLeft =
    GAME_DURATION;


  scoreDisplay.textContent =
    score;

  timeDisplay.textContent =
    timeLeft;


  gameResult.textContent =
    "";


  restartBtn.hidden =
    true;


  startMessage.style.display =
    "none";


  closeResultModal();


  clearGameObjects();


  resetSpaceship();


  /* Start again */

  startGame();

}


/* =========================
   CLEAR OBJECTS
========================= */

function clearGameObjects() {

  document
    .querySelectorAll(
      ".alien, .bullet"
    )
    .forEach(
      element => element.remove()
    );

}


/* =========================
   SOUND
========================= */

function playSound(audio) {

  if (!audio) {
    return;
  }


  audio.currentTime =
    0;


  audio.play().catch(
    () => {
      /* Browser may block
         autoplay/audio before
         user interaction. */
    }
  );

}


/* =========================
   RESULT MODAL
========================= */

function openResultModal() {

  resultModal.classList.add(
    "show"
  );

  resultModal.setAttribute(
    "aria-hidden",
    "false"
  );

}


function closeResultModal() {

  resultModal.classList.remove(
    "show"
  );

  resultModal.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* =========================
   INITIAL STATE
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    resetSpaceship();

    timeDisplay.textContent =
      GAME_DURATION;

    scoreDisplay.textContent =
      "0";

  }
);