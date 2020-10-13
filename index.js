// initialize sounds
const failSound = new Audio('./assets/audio/fart1.mp3')
const loseSound = new Audio('./assets/audio/fart2.mp3')
const scoreSound = new Audio('./assets/audio/jump.wav')
const levelUpSound = new Audio('./assets/audio/level-up.wav')

const backgroundMusic = new Audio('./assets/audio/background-music.mp3')
backgroundMusic.loop = true

const soundsEnum = {
  FAIL: 'fail',
  LOSE: 'lose',
  SCORE: 'score',
  LEVEL_UP: 'level-up',
}

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

function playSound(sound) {
  try {
    switch (sound) {
      case soundsEnum.FAIL: {
        failSound.play()
        break
      }
      case soundsEnum.LOSE: {
        loseSound.play()
        break
      }
      case soundsEnum.SCORE: {
        scoreSound.play()
        break
      }
      case soundsEnum.LEVEL_UP: {
        levelUpSound.play()
        break
      }
      default: break
    }
  } catch {
    // can't play sound yet 
    // click the DOM my dude!
  }
}

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

function updateHealthBar() {
  document.getElementById('myBar').style.width = `${currentHealth}%`
  document.getElementById('myBar').innerText = `${currentHealth}%`

  if (currentHealth === 0) {
    document.getElementById('myBar').style.padding = '0px'
    document.getElementById('myBar').style.width = 'fit-content'
    document.getElementById('myBar').style.backgroundColor = 'transparent'
    document.getElementById('myBar').style.margin = '0px 0px 0px 8px'
    document.getElementById('myBar').innerText = ':( lol'
  }
}

function tempUpdateButtonColor(color) {
  getButton().style.backgroundColor = color
  setTimeout(() => {
    getButton().style.backgroundColor = ''
  }, buttonTeleportDelay - 200)
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
  }, 650)
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

let hasHovered
function setUpOnHoverListener() {
  getButton().onmouseover = () => {
    if (hasHovered || isGameOver) return

    hasHovered = true

    teleportTimeout = setTimeout(() => {
      currentHealth -= healthFailStep
      updateHealthBar()
      if (currentHealth <= 0) {
        playSound(soundsEnum.LOSE)
        document.getElementById('title').innerText = 'YOU LOSE 😭'
        getButton().setAttribute('disabled', true)
        isGameOver = true
        clearInterval(teleportInterval)
      } else {
        tempUpdateButtonColor('palevioletred')
        playSound(soundsEnum.FAIL)
        randomlyGrowOrShrinkButton()
        teleportButton()
        showToastMessage('👎 HAHA!', true)
      }
      hasHovered = false
    }, buttonTeleportDelay)

    console.log(teleportTimeout)
  }
}

let isFirstClick = true
let teleportInterval
function setUpLevelUpClickListener() {
  getButton().onclick = (event) => {
    if (!event.isTrusted) return

    if (isFirstClick) {
      backgroundMusic.play()
      isFirstClick = false
      teleportInterval = setInterval(() => {
        teleportButton()
      }, buttonTeleportDelay * 2)
    }

    clearInterval(teleportInterval)
    clearTimeout(teleportTimeout)

    if (isGameOver) return

    buttonTeleportDelay -= stepDelayRemoval
    currentScore += 25
    hasHovered = false

    if (currentScore >= currentLevel * 200) {
      playSound(soundsEnum.LEVEL_UP)
      currentLevel += 1
      showToastMessage('🚀 Level Up!', false)
    } else {
      playSound(soundsEnum.SCORE)
      showToastMessage('👍 Good Job!', false)
    }

    getLevelText().innerText = `LEVEL: ${currentLevel}`
    getScoreText().innerText = `SCORE: ${currentScore}`
    teleportInterval = setInterval(() => {
      teleportButton()
    }, buttonTeleportDelay * 3)
    teleportButton()
  }
}

// initialize app by randomly placing button
function initializeApp() {
  getButton().onkeypress = (e) => e.preventDefault()
  teleportButton()
  setUpOnHoverListener()
  setUpLevelUpClickListener()
  getLevelText().innerText = `LEVEL: ${currentLevel}`
  getScoreText().innerText = `SCORE: ${currentScore}`
}

initializeApp()