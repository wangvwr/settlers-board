

const colorStone = 'rgb(179, 179, 179)'; //gray
const colorWheat = 'rgb(244, 180, 0)'; //yellow
const colorWool = 'rgb(164, 198, 57)'; //light green
const colorWood = 'rgb(15, 157, 88)'; //dark green
const colorClay = 'rgb(219, 68, 55)'; //red
const colorDesert = 'rgb(198, 162, 57)'; //brown
const colorBackground = 'white';
const colorDefault = 'rgb(66, 133, 244)'; //blue

const resourceColors = [
  colorStone, colorWheat, colorWool,
  colorWood, colorClay, colorDesert,
];

const numberOfTiles = 37;
const boardTiles = [ //list of element ids, land and port 
  '0', '2', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '16', '17', '18', '19',
  '20', '21', '22', '23', '24', '25', '26',
  '29', '30', '31', '32', '33', '35',
];

const landTiles = [
  '5', '6', '7', '10', '11', '12', '13', '16', '17', '18', '19',
  '20', '23', '24', '25', '26', '29', '30', '31',
];

const portTiles = ['0', '2', '8', '9', '21', '22', '32', '33', '35']; 

const landTileNumbers = [
  '2', '3', '4', '5', '6', '8', '9', '10', '11', '12',
  '11', '10', '9', '8', '6', '5', '4', '3',
];

const portTileNumbers = [
  '2:1', '2:1', '2:1', '2:1',
  '2:1', '3:1', '3:1', '3:1', '3:1',
];


//Event Listeners
function init() {
  const buttonUndo = document.querySelector('#undo-icon'); 
  buttonUndo.addEventListener('click', undoBoardState, false);

  const buttonRedo = document.querySelector('#redo-icon');
  buttonRedo.addEventListener('click', redoBoardState, false);

  const buttonRandom = document.querySelector('#random-icon');
  buttonRandom.addEventListener('click', randomizeBoard, false);

  const buttonClear = document.querySelector('#clear-icon');
  buttonClear.addEventListener('click', clearBoard, false);

  let element = [];
  for (let i = 0; i < numberOfTiles; i++) {
    const setTile = setTileByUser.bind(null, i); 
    element[i] = document.querySelector('#number' + i);
    element[i].addEventListener('click', setTile, false); 
  }
}

function initBoard() {
  for (let i = 0; i < numberOfTiles; i++) {
    document.querySelector('#hex' + i).style.color = colorBackground;
    document.querySelector('#number' + i).innerHTML = '0';
    document.querySelector('#number' + i).style.opacity = 1;
  }
}


//History Stack
class BoardHistory {
  constructor() {
    this.data = [];
    this.top = 0;
  }
  push(element) {
    this.data[this.top] = element;
    this.top = this.top + 1;
  }
  length() {
    return this.top;
  }
  peek() {
    return this.data[this.top - 1];
  }
  isEmpty() {
    return this.top === 0;
  }
  pop() {
    if (this.isEmpty() === false) {
      this.top = this.top - 1;
      return this.data.pop();
    }
  }
}


//Undo / Redo
let undoStack = new BoardHistory();
let redoStack = new BoardHistory();

function undoBoardState() {
  if (undoStack.length() > 1) {
    popUndoStack();
    let board = undoStack.peek();
    loadBoardState(board);
 }
}

function redoBoardState() {
  if (redoStack.length() > 0) {
    let board = redoStack.peek();
    loadBoardState(board);
    popRedoStack();
  }
}

function popUndoStack() {
  let board = undoStack.pop();
  redoStack.push(board);
}

function popRedoStack() {
  let board = redoStack.pop();
  undoStack.push(board);
}

function clearRedoStack() {
  while (redoStack.length() > 0) {
    redoStack.pop();
  }
}


//Save / Load State
function saveBoardState() {
  let boardState = [];

  for (let i = 0; i < boardTiles.length; i++) {
    const tile = document.querySelector('#hex' + boardTiles[i]);
    const number = document.querySelector('#number' + boardTiles[i]);
    const tileProperties = {
      resource: tile.style.color,
      number: number.innerHTML,
      opacity: number.style.opacity,
    };

    boardState[i] = tileProperties;
  }

  undoStack.push(boardState);
  clearRedoStack();
  return boardState;
}
 
function loadBoardState(board) {
  for (let i = 0; i < boardTiles.length; i++) {
    const tile = document.querySelector('#hex' + boardTiles[i]);
    const number = document.querySelector('#number' + boardTiles[i]);

    tile.style.color = board[i].resource;
    number.innerHTML = board[i].number;
    number.style.opacity = board[i].opacity;

    const num = parseInt(number.innerHTML);
      if (num < 10) {
        number.style.right = '68px';
      } else {
        number.style.right = '84px';
      }
  }
}


//Manual Input
function selectResourceRadioButton() {
  const radios = document.querySelectorAll('[name="color"]');
  let selectedRadio;

  for (i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      selectedRadio = radios[i].value;
      break;
    }
  }
  return selectedRadio;
}

function setTileResource(number) {
  const resource = selectResourceRadioButton();
  const tile = document.querySelector('#hex' + number); 

  switch (resource) {
    case 'stone':
      tile.style.color = colorStone;
      break;
    case 'wheat':
      tile.style.color = colorWheat;
      break;
    case 'wool':
      tile.style.color = colorWool;
      break;
    case 'wood':
      tile.style.color = colorWood;
      break;
    case 'clay':
      tile.style.color = colorClay;
      break;
    case 'desert':
      tile.style.color = colorDesert;
      break;
    case 'off': 
      break;
    default:
      tile.style.color = colorDefault;
  }
}

function setTileByUser(boardTile) { 
  const tileNumber = document.querySelector('#number' + boardTile); 
  
  let userInput; 
  do {  
    userInput = prompt('Enter a resource number: ');
    if (userInput === null) {
      break;
    } 
  } while (!isValidNumber(userInput));

  if (userInput !== null) {
    if (userInput === '') {
      tileNumber.style.opacity = 0;
    } else {
      tileNumber.innerHTML = userInput;
      tileNumber.style.opacity = 1;
    }

    setTileResource(boardTile);
    const board = saveBoardState();
    loadBoardState(board);
  }
  
}

function isValidNumber(input) {
  const validInput = [
    '', '2', '3', '4', '5', '6', '8', '9',
    '10', '11', '12','3:1', '2:1',
  ];

  return validInput.includes(input);
}


//Intro Board
function setIntroBoard() {

  setLandTileResource(0, 2, colorClay); 
  setLandTileResource(3, 6, colorWool);
  setLandTileResource(7, 11, colorWheat); 
  setLandTileResource(12, 15, colorWood);
  setLandTileResource(16, 18, colorStone); 
  setLandTileResource(9, 9, colorDesert);

  setPortTileResource(0, 0, colorStone);
  setPortTileResource(1, 1, colorWood);
  setPortTileResource(2, 2, colorClay);
  setPortTileResource(3, 3, colorWool);
  setPortTileResource(4, 4, colorWheat);
  setPortTileResource(5, 8, colorDefault);

  setLandTileNumber();
  setPortTileNumber();

  const board = saveBoardState();
  loadBoardState(board);
}

function setLandTileResource(start, end, resourceColor) {
  for (let i = start; i <= end; i++) {
    document.querySelector('#hex' + landTiles[i]).style.color = resourceColor;
  }
}

function setPortTileResource(start, end, resourceColor) {
  for (let i = start; i <= end; i++) {
    document.querySelector('#hex' + portTiles[i]).style.color = resourceColor;
  }
}

function setLandTileNumber() {
  let iter = 0; //doesn't iterate if desert
  for (let i = 0; i < landTiles.length; i++) {
    const element = document.querySelector('#number' + landTiles[i]);
    
    if(isDesert(i)) {
      element.innerHTML = 0;
      element.style.opacity = '0';
    } else { 
      element.innerHTML = landTileNumbers[iter];
      iter++; 
    }
  }
}

function setPortTileNumber() {
  for (let i = 0; i < portTileNumbers.length; i++) {
    let portTile = document.querySelector('#hex' + portTiles[i]);
    if (portTile.style.color == colorDefault) {
      document.querySelector('#number' + portTiles[i]).innerHTML = '3:1';
    } else {
      document.querySelector('#number' + portTiles[i]).innerHTML = '2:1';
    } 
  }
}

function isDesert(iter) {
  const element = document.querySelector('#hex' + landTiles[iter]);
  return element.style.color == colorDesert;
}


//Random
function randomizeBoard() {
  initBoard(); 
  randomizeLandTileResource(); 
  randomizePortResource(); 
  randomizeLandNumber();             
  setPortTileNumber();

  const board = saveBoardState(); 
  loadBoardState(board);
}

function randomizeLandTileResource() {
  let landTilesMap = {map: Array(19).fill(0)};
  setLandTileResourceRandom(3, colorStone, landTilesMap);
  setLandTileResourceRandom(4, colorWheat, landTilesMap);
  setLandTileResourceRandom(4, colorWool, landTilesMap);
  setLandTileResourceRandom(4, colorWood, landTilesMap);
  setLandTileResourceRandom(3, colorClay, landTilesMap);
  setLandTileResourceRandom(1, colorDesert, landTilesMap);
} 

function setLandTileResourceRandom(iter, resourceColor, tilesMap) { 
  for (let i = 0; i < iter; i++) {
    let numberIsUnique = false;
    while (numberIsUnique === false) {
      let randomNum = Math.floor(Math.random() * 19);
      if (tilesMap.map[randomNum] === 0) {
        document.querySelector('#hex' + landTiles[randomNum]).style.color = resourceColor;
        tilesMap.map[randomNum]++;
        numberIsUnique = true;
      }
    }
  }
}

function randomizePortResource() { 
  let portTileMap = Array(portTiles.length).fill(0);
  for (let i = 0; i < portTiles.length; i++) {
      document.querySelector('#hex' + portTiles[i]).style.color = colorDefault;
  }
  
  for (let i = 0; i < 5; i++) {
    let numberIsUnique = false;
    while (numberIsUnique === false) {
      let randomNum = Math.floor(Math.random() * 9);
      if (portTileMap[randomNum] === 0) {
        document.querySelector('#hex' + portTiles[randomNum]).style.color = resourceColors[i];
        portTileMap[randomNum]++;
        numberIsUnique = true;
      }
    }
  }
}

function randomizeLandNumber() {
  let landTilesNumbersMap = Array(18).fill(0);

  for (let i = 0; i < landTiles.length; i++) {
    let element = document.querySelector('#number' + landTiles[i]);

    if (isDesert(i)) {
      element.innerHTML = 0;
      element.style.opacity = 0;
    } else {
      let numberIsUnique = false; //rename unique to is

      while (numberIsUnique === false) {
        let randomIndex = Math.floor(Math.random() * 18);

        if (landTilesNumbersMap[randomIndex] === 0) { 
          element.innerHTML = landTileNumbers[randomIndex]; //hex plot gets random number
          landTilesNumbersMap[randomIndex]++; //random number has been marked as used
          numberIsUnique = true; //exit the while loop looking for random number
        }
      }
    }
  } 
}


//Clear board
function clearBoard() {
  for (let i = 0; i < boardTiles.length; i++) {
    const tile = document.querySelector('#hex' + boardTiles[i]);
    const number = document.querySelector('#number' + boardTiles[i]);
    //tile.style.color = colorDefault;
    tile.style.color = colorBackground;
    number.style.opacity = 0;
  }

  const board = saveBoardState();
  loadBoardState(board);
}

clearBoard();
init();