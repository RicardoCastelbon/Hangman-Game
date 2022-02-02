// Global variables
const wordList = ["HELLO", "GOODBYE", "JAVASCRIPT", "WORLD", "COMPUTER"]; //list of words
let selectedWord; //word selected
let selectedWordArray; // word selected in array form
let lettersLeft; //letters left to guess
let mistakes = 0; // number of mistakes made
let letterBoxes = []; //Array of boxes(inputs)
let lettersTyped = []; //Letters that have been typed

const hangmanImg = document.querySelector("#hangman");
const msgHolder = document.querySelector("#message");
const startGameBtn = document.querySelector("#startGameBtn");
const letterButtons = [...document.querySelectorAll(".btn")];
const ulList = document.querySelector("#ulList");

//ClickEvent to start the game
startGameBtn.addEventListener("click", onStartGame);

//StartGame callback function
function onStartGame() {
  resetAndRandomizeWord();
}

//Function to reset the game and take a random word from the list of words
function resetAndRandomizeWord() {
  resetGame();
  selectedWord = wordList[Math.floor(Math.random() * wordList.length)]; // wordList randomizer
  lettersLeft = selectedWord.length; //set the number of letters left to the length of the word(string)
  createLetterBoxes();
}

// Function that brings up the boxes of letters, the number of boxes depends on which word is slipped out
function createLetterBoxes() {
  selectedWordArray = selectedWord.split("");
  selectedWordArray.forEach((element) => {
    let box = document.createElement("li");
    ulList.appendChild(box);
    let input = document.createElement("input");
    box.appendChild(input);
    letterBoxes.push(input);
  });
  guessLetter();
}

//Function that controls the clicks on the letters
function guessLetter() {
  letterButtons.forEach((element) => {
    element.addEventListener("click", onLetterClicked); //click the letters on screen funcionality
  });
  document.addEventListener("keyup", onLetterTyped); //type the letters on keyboard
}

//Callback functions
function onLetterClicked(e) {
  const letterContained = selectedWordArray.includes(e.target.value); //check if the letter clicked exist in the selectedWordArray
  if (letterContained) {
    let positions = []; //auxiliar array to store the indexes where the letters clicked are
    let index = selectedWordArray.indexOf(e.target.value); //auxiliar variable to store the index position of the letter clicked
    //push all the letters existant in the selectedWordArray into the positions array
    while (index != -1) {
      positions.push(index);
      index = selectedWordArray.indexOf(e.target.value, index + 1);
    }
    //print the letters in the positions given by the position array
    positions.forEach((element) => {
      letterBoxes[element].value = selectedWordArray[element];
      lettersLeft--; //countdown for letters left
    });
    e.target.disabled = true; //deactivate the letter pressed
    win_loseCondition();
  } else {
    mistakes++;
    e.target.disabled = true; //deactivate the letter pressed
    hangmanImgChange();
    win_loseCondition();
  }
}
function onLetterTyped(e) {
  if (e.key.match(/[a-z]/i) || e.key == "å" || e.key == "ä" || e.key == "ö") {
    const upperCaseLetter = e.key.toUpperCase(); //transform the letters typed to uppercase
    const isTyped = lettersTyped.includes(upperCaseLetter); //checks if the letter typed in included in the array of letters typed
    const letterContained = selectedWordArray.includes(upperCaseLetter); //check if the letter clicked exist in the selectedWordArray
    if (letterContained) {
      let positions = []; //auxiliar array to store the indexes where the letters clicked are
      let index = selectedWordArray.indexOf(upperCaseLetter); //auxiliar variable to store the index position of the letter clicked
      //push all the letters existant in the selectedWordArray into the positions array
      while (index != -1) {
        positions.push(index);
        index = selectedWordArray.indexOf(upperCaseLetter, index + 1);
      }
      //print the letters in the positions given by the position array
      positions.forEach((element) => {
        letterBoxes[element].value = selectedWordArray[element];
        if (!isTyped) lettersLeft--; //if the letter hasn't been typed before it does lettersLeft--
      });
      lettersTyped.push(upperCaseLetter); //adds the letter typed to the array
      disableLetterTyped(upperCaseLetter); //deactivate the letter pressed
      win_loseCondition();
    } else {
      if (!isTyped) mistakes++; //if the letter hasn't been typed before it does mistakes++
      lettersTyped.push(upperCaseLetter); //adds the letter typed to the array
      disableLetterTyped(upperCaseLetter); //deactivate the letter pressed
      hangmanImgChange();
      win_loseCondition();
    }
  }
}

//Function that controls the print of the hangman
function hangmanImgChange() {
  switch (mistakes) {
    case 0:
      hangmanImg.src = "images/h0.png";
      break;
    case 1:
      hangmanImg.src = "images/h1.png";
      break;
    case 2:
      hangmanImg.src = "images/h2.png";
      break;
    case 3:
      hangmanImg.src = "images/h3.png";
      break;
    case 4:
      hangmanImg.src = "images/h4.png";
      break;
    case 5:
      hangmanImg.src = "images/h5.png";
      break;
    case 6:
      hangmanImg.src = "images/h6.png";
      break;
    default:
      break;
  }
}

//Function that controls the mistakes & number of letters left
function win_loseCondition() {
  //Win condition
  if (lettersLeft === 0) {
    msgHolder.textContent = "You won! Play again?";
    startGameBtn.disabled = false; //activates the start button
    disableLetterButtons();
  }
  //Lose condition
  if (mistakes === 6) {
    msgHolder.textContent = "You lost! Play again?";
    startGameBtn.disabled = false; //activates the start button
    disableLetterButtons();
  }
}

//Functions to able and disable the letterButons
function ableLetterButtons() {
  letterButtons.forEach((element) => {
    element.disabled = false;
  });
}
function disableLetterButtons() {
  letterButtons.forEach((element) => {
    element.disabled = true;
  });
}
function disableLetterTyped(upperCaseLetter) {
  letterButtons.forEach((element) => {
    if (element.value == upperCaseLetter) {
      element.disabled = true;
    }
  });
}

//Function to reset the parameters of the game
function resetGame() {
  ableLetterButtons();
  letterBoxes = [];
  lettersTyped = [];
  ulList.innerHTML = ""; //delete all the children elements (li & inputs)
  mistakes = 0;
  letterButtons.forEach((element) => {
    // remove all the eventListeners added
    element.removeEventListener("click", onLetterClicked);
  });
  document.removeEventListener("keyup", onLetterTyped);
  msgHolder.textContent = "";
  startGameBtn.disabled = true;
  hangmanImgChange();
}
