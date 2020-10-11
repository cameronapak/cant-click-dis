// get boundaries of screen (https://stackoverflow.com/a/8876069)
const screenY = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const screenX = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

let currentLevel = 1;
let buttonTeleportDelay = 500;
let currentScore = 0;
let isGameOver = false;

let currentHealth = 100;
let healthFailStep = 25;

let stepDelayRemoval = 5;

let teleportTimeout

function getLevelText() {
  return document.getElementById('current-level')
}

function getButton() {
  return document.getElementById('btn')
}

function getScoreText() {
  return document.getElementById('score')
}

function getToastMessage() {
  return document.getElementById('toast')
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomButtonPosition() {
  let xPos = getRandomInt(screenX)
  let yPos = getRandomInt(screenY)

  if (screenX - xPos < 100) {
    xPos -= 100
  }

  if (screenY - yPos < 100) {
    yPos -= 100
  }

  return { xPos, yPos }
}

function showToastMessage(message, isFail = false) {
  getToastMessage().innerText = message
  getToastMessage().style.left = `calc(50% - ${getToastMessage().innerWidth}px / 2)`

  if (isFail) {
    getToastMessage().style.backgroundColor = 'palevioletred'
  } else {
    getToastMessage().style.backgroundColor = 'lightslategrey'
  }

  getToastMessage().classList.toggle('toast-active')
  setTimeout(() => {
    getToastMessage().classList.toggle('toast-active')
  }, 500)
}

function randomlyGrowOrShrinkButton() {
  getButton().style.transform = `scale(${Math.floor(Math.random() * 2) + 1})`
}

function teleportButton() {
  // get random x and y of screen dimensions
  const { xPos, yPos } = getRandomButtonPosition()

  // randomly place button anywhere within those boundaries
  getButton().style.top = `${xPos}px`
  getButton().style.left = `${yPos}px`
}

function setUpOnHoverListener() {
  getButton().onmouseover = () => {
    if (isGameOver) return
    teleportTimeout = setTimeout(() => {
      currentHealth -= healthFailStep;
      if (currentHealth <= 0) {
        document.getElementById('title').innerText = 'YOU LOSE 😭'
        isGameOver = true
        clearTimeout(teleportTimeout)
      } else {
        randomlyGrowOrShrinkButton()
        teleportButton()
        showToastMessage('👎 HAHA!', true)
      }
    }, buttonTeleportDelay)
  }
}

function setUpLevelUpClickListener() {
  getButton().onclick = () => {
    clearTimeout(teleportTimeout)
    if (isGameOver) return

    buttonTeleportDelay -= stepDelayRemoval
    currentScore += 25
    if (currentScore >= currentLevel * 200) {
      currentLevel += 1
      showToastMessage('🚀 Level Up!', false)
    } else {
      showToastMessage('👍 Good Job!', false)
    }
    getLevelText().innerText = `LEVEL: ${currentLevel}`
    getScoreText().innerText = `SCORE: ${currentScore}`
    teleportButton()
  }
}

// initialize app by randomly placing button
function initializeApp() {
  teleportButton()
  setUpOnHoverListener()
  setUpLevelUpClickListener()
  getLevelText().innerText = `LEVEL: ${currentLevel}`
  getScoreText().innerText = `SCORE: ${currentScore}`
}

initializeApp()