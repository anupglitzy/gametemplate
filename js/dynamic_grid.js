

var mainElement = document.getElementById("room");
var gameDiv = document.createElement("div");
gameDiv.className = "gameParent";
gameDiv.style.position = "absolute";
gameDiv.style.height = innerHeight + "px";
gameDiv.style.width = ((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) + "px";
gameDiv.style.left = (innerWidth / 2 - ((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) / 2) + "px";
gameDiv.style.top = 0 + "px";
mainElement.appendChild(gameDiv);

var helpDiv = document.createElement("div");
helpDiv.className = "helpDiv";
helpDiv.style.position = "relative";
helpDiv.style.height = 20 + "%";
document.querySelector(".gameParent").appendChild(helpDiv);

var gameTableDiv = document.createElement("div");
gameTableDiv.className = "game";
gameTableDiv.style.position = "relative";
gameTableDiv.style.height = 80 + "%";
document.querySelector(".gameParent").appendChild(gameTableDiv);

function createGame(n, depth) {
  var tdArray = Array(n * n);
  var elemCounter = 0;
  var randomRed = Math.floor(Math.random() * 195) + 60;
  var randomGreen = Math.floor(Math.random() * 195) + 60;
  var randomBlue = Math.floor(Math.random() * 195) + 60;
  tdArray[Math.floor(Math.random() * (n * n - 1))] = 1;
  var gameTable = document.createElement("table");
  for (var i = 0; i < n; i++) {
    var row = document.createElement("tr");
    for (var j = 0; j < n; j++) {
      var cell = document.createElement("td");
      if (tdArray[elemCounter] != undefined) {
        cell.className = "odd";
        cell.style.borderRadius = "7px";
        cell.style.backgroundColor = "rgb(" + (randomRed - depth) + "," + (randomGreen - depth) + "," + (randomBlue - depth) + ")";
      } else {
        cell.style.borderRadius = "7px";
        cell.style.backgroundColor = "rgb(" + randomRed + "," + randomGreen + "," + randomBlue + ")";
      }
      row.appendChild(cell);
      ++elemCounter;
    }
    gameTable.appendChild(row);
  }
  gameTable.cellSpacing = "10";
  gameTable.style.width = document.querySelector(".gameParent").style.width;
  gameTable.style.height = gameTable.style.width;

  var table = document.querySelector(".game").querySelector("table")
  if (table)
    document.querySelector(".game").removeChild(table);
  document.querySelector(".game").appendChild(gameTable);
}
var timerCreated = false;

function createTimerTable() {
  var timerTable = document.createElement("table");
  timerTable.style.width = 100 + "%";
  timerTable.style.height = 100 + "%";
  timerTable.style.fontSize = 35 + "px";
  timerTable.style.fontWeight = "bold";
  timerTable.style.fontFamily = "'comic sans ms','Arial Rounded MT Bold','times new roman',Arial";
  timerTable.style.color = "white";
  timerTable.style.whiteSpace = "nowrap";
  timerTable.style.textShadow = "1px 1px 2px black";
  timerTable.className = "helpTable";
  var row = document.createElement("tr");
  var timerCell = document.createElement("td");
  timerCell.className = "timerCell";
  timerCell.style.paddingTop = "15%";
  timerCell.style.width = "50%";
  timerCell.style.paddingLeft = "10px";
  timerCell.style.textAlign = "left";
  row.appendChild(timerCell);
  var levelCell = document.createElement("td");
  levelCell.className = "levelCell";
  levelCell.style.paddingTop = "15%";
  levelCell.style.width = "50%";
  levelCell.style.paddingRight = "10px";
  levelCell.style.textAlign = "right";
  row.appendChild(levelCell);
  timerTable.appendChild(row);
  var helpTable = document.querySelector(".helpDiv").querySelector(".helpTable");
  if (helpTable)
    document.querySelector(".helpDiv").removeChild(helpTable);
  document.querySelector(".helpDiv").appendChild(timerTable);
  timerCreated = true;
  window.gameInterval = setInterval(show, 100);
}
var continueCondition = false;

function ifContinue(event) {
  if (event.target.className && event.target.className == "progressChild" && continueCondition) {
    var overlay = document.querySelector(".overlay");
    overlay.style.display = "none";
    overlay.querySelector(".continue").innerHTML = "";
    overlay.querySelector(".commentDiv").innerHTML = "";
    if (_next) {
      seconds = 15;
      window.gameInterval = setInterval(show, 100);
    } else if (_won) {
      if (window.gameInterval)
        clearInterval(gameInterval);
      document.querySelector(".gameParent").removeEventListener("click", playGame);
      document.querySelector(".helpDiv").innerHTML = "";
      document.querySelector(".game").innerHTML = "<center><button class='button' onclick='location.reload()'>Retry</button>" +
        "<table class='result'>" +
        "<tr><td>Levels Cleared</td><td>" + level + "</td></tr>" +
        "<tr><td>Total Levels</td><td>40</td></tr>" +
        "<tr><td>Comment</td><td>AWESOME!, we can't believe!!!</td></tr>" +
        "</table>" +
        "</center>";
    } else {
      if (window.gameInterval)
        clearInterval(gameInterval);
      document.querySelector(".gameParent").removeEventListener("click", playGame);
      document.querySelector(".helpDiv").innerHTML = "";
      document.querySelector(".game").innerHTML = "<center><button class='button' onclick='location.reload()'>Retry</button>" +
        "<table class='result'>" +
        "<tr><td>Levels Cleared</td><td>" + level + "</td></tr>" +
        "<tr><td>Total Levels</td><td>40</td></tr>" +
        "<tr><td>Comment</td><td>WOW!!!</td></tr>" +
        "</table>" +
        "</center>";
    }
    console.log(event, event.target);
    continueCondition = false;
  }
}
var help = document.createElement("p");
help.className = "helpTable";
help.style.color = "white";
help.style.textShadow = "1px 1px 2px black";
help.innerHTML = "Click the Odd one out!";
help.style.textAlign = "center";
help.style.position = "relative";
help.style.top = "50%";
document.querySelector(".helpDiv").appendChild(help);
//the overlay starts here
var overlay = document.createElement("div");
overlay.className = "overlay";
overlay.style.position = "absolute";
overlay.style.top = overlay.style.left = 0;
overlay.style.height = 100 + "%";
overlay.style.width = 100 + "%";
overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
overlay.style.textShadow = "1px 1px 2px black";
overlay.style.textAlign = "center";
overlay.style.display = "none";
overlay.addEventListener("click", ifContinue);
//the testing starts here
var insideDiv = document.createElement("div");
insideDiv.className = "insideParent";
insideDiv.style.position = "absolute";
insideDiv.style.height = innerHeight + "px";
insideDiv.style.width = ((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) + "px";
insideDiv.style.left = (innerWidth / 2 - ((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) / 2) + "px";
insideDiv.style.top = 0 + "px";
overlay.appendChild(insideDiv);

var commentDiv = document.createElement("div");
commentDiv.className = "commentDiv";
commentDiv.style.paddingTop = "15%";
commentDiv.style.position = "relative";
commentDiv.style.height = 60 + "%";
insideDiv.appendChild(commentDiv);

var continueDiv = document.createElement("div");
continueDiv.className = "continue";
continueDiv.style.position = "relative";
continueDiv.style.height = 40 + "%";
insideDiv.appendChild(continueDiv);
//the testing finishes here
document.body.appendChild(overlay);
var _next, _won;

function showOverlay(message, next, won) {
  var overlay = document.querySelector(".overlay");
  var commentDiv = overlay.querySelector(".commentDiv");
  var continueDiv = overlay.querySelector(".continue");

  overlay.style.display = "block";
  commentDiv.innerHTML = "<p>" + message + "</p>";
  var progressDiv = document.createElement("div");
  progressDiv.className = "progress";
  var inDiv = document.createElement("div");
  inDiv.className = "progressChild";
  inDiv.style.textAlign = "center";
  inDiv.style.fontSize = "40px";
  inDiv.style.lineHeight = "1em";
  inDiv.style.fontWeight = "bold";
  inDiv.innerHTML = "Processing.......";
  progressDiv.appendChild(inDiv);
  progressDiv.style.position = "relative";
  progressDiv.style.left = (((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) / 2 - 125) + "px";
  var comment = document.createElement("p");
  comment.className = "cmtDiv";
  comment.innerHTML = ((!won) ? ((next) ? ("We are creating your next level based on your result analysis, please wait...") : ("You Played Awesome!")) : ("WOW!!! You Won The GAME!<br>How Do You Make It Look So Easy???"));
  continueDiv.appendChild(comment);
  var center = document.createElement("p");
  center.appendChild(progressDiv);
  continueDiv.appendChild(center);
  if (next) {
    _next = true;
    _won = false;
    clearInterval(gameInterval);
  } else if (won) {
    _next = false;
    _won = true;
  } else {
    _next = false;
    _won = false;

  }

  var condition = false;
  var angle = 0;

  function progr() {
    ++angle;
    document.querySelector(".progress>div").style.width = angle + "px";

    if (!condition && angle <= 250) {
      requestAnimationFrame(progr);
    } else {
      continueCondition = true;
      document.querySelector(".progress>div").innerHTML = (next) ? "Continue" : "Finish";
      document.querySelector(".cmtDiv").style.opacity = "0";
    }
  }
  requestAnimationFrame(progr);
}

function showTimer(second, millisecond) {
  if (millisecond != undefined) {
    document.querySelector(".timerCell").style.color = "red";
    document.querySelector(".timerCell").innerHTML = second + "." + "<small>" + millisecond + "</small>" + " <small style='font-weight: lighter;font-size:15px'>sec</small>";
  } else {
    document.querySelector(".timerCell").style.color = "white";
    document.querySelector(".timerCell").innerHTML = second + " <small style='font-weight: lighter;font-size:15px'>sec</small>";
  }
}

var depth = 76;
var n = m = 2;
var storedM;
var stored = false;
var level = 0;
var counter = 0;
var seconds = 15;
var milliSeconds = 9;

function gameOver() {
  clearInterval(gameInterval);
  showTimer(0, 0);
  showOverlay("Great!!! You have a Good Eye!!!, You Reached Level " + level, false, false);
}

function show() {
  if (seconds > 5)
    showTimer(seconds);
  else if (seconds > -1)
    showTimer(seconds, milliSeconds);
  else
    gameOver();
  --milliSeconds;
  if (milliSeconds < 0) {
    milliSeconds = 9;
    --seconds;
  }

}

var message = {
  10: "Wow!!! You Cleared Level 10! How do you make it look So Easy?",
  20: "You cleared Level 20!!! Awesome! You are very talented!!! you have a great eye!",
  30: "Wow... You just cleared level 30!!! you will make it to the final in just a few trials!!!",
  40: "YOU WON DEAR!!! YOU ARE AMAZING!!! JUST THE WAY YOU ARE..."
}

function playGame(event) {
  if (event.target.tagName.toLowerCase() == "td" && event.target.className && event.target.className == "odd") {
    if (!timerCreated) {
      createTimerTable();
      showTimer(15);
    }
    seconds = 15;
    clearInterval(gameInterval);
    window.gameInterval = setInterval(show, 100);

    createGame(n, depth);
    if (level % 10 == 0 && level > 1) {
      if (level % 40 == 0)
        showOverlay(message[level], false, true);
      else
        showOverlay(message[level], true, false);
    }
    console.log(n, depth, level);
    if (m > 2 && !stored) {
      if (!storedM)
        storedM = m;
      else
        ++storedM;
      stored = true;
      counter = 0;
    }
    if (stored || m <= 2) {
      ++counter;
      if (m <= 2)
        ++n;
      if (counter == storedM) {
        stored = false;
        ++n;
      }
    }
    ++level;
    ++m;
    depth -= 2;
    document.querySelector(".levelCell").innerHTML = level + "<sup style='font-weight: lighter'>Lv.</sup>";
  } else
  if (event.target.tagName.toLowerCase() == "td") {
    //start coding from here
    if (window.gameInterval) {
      seconds -= 3;
      clearInterval(gameInterval);
      window.gameInterval = setInterval(show, 100);
    }
    if (!timerCreated) {
      createTimerTable();
      showTimer(15);
      if (m > 2 && !stored) {
        if (!storedM)
          storedM = m;
        else
          ++storedM;
        stored = true;
        counter = 0;
      }
      if (stored || m <= 2) {
        ++counter;
        if (m <= 2)
          ++n;
        if (counter == storedM) {
          stored = false;
          ++n;
        }
      }
      ++level;
      ++m;
      depth -= 2;
      document.querySelector(".levelCell").innerHTML = level + "<sup style='font-weight: lighter'>Lv.</sup>";
    }
  }
}
document.querySelector(".gameParent").addEventListener("click", playGame);

function fitElements() {
  function fitElementsIn() {
    if (innerHeight >= 400 && innerWidth >= 400) {
      gameDiv.style.height = innerHeight + "px";

      var gameTable = document.querySelector(".game").querySelector("table")
      gameTable.style.width = document.querySelector(".gameParent").style.width;
      gameDiv.style.width = ((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) + "px";
      gameDiv.style.left = (innerWidth / 2 - ((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) / 2) + "px";
      gameDiv.style.top = 0 + "px";
      gameTable.style.height = gameTable.style.width;

      var overLay = document.querySelector(".overlay");
      overLay.style.height = innerHeight + "px";
      overLay.style.width = innerWidth + "px";
      var insideDiv = document.querySelector(".insideParent");
      insideDiv.style.height = innerHeight + "px";
      insideDiv.style.width = ((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) + "px";
      insideDiv.style.left = (innerWidth / 2 - ((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) / 2) + "px";
      insideDiv.style.top = 0 + "px";

      if (document.querySelector(".progress"))
        document.querySelector(".progress").style.left = ((((innerWidth < innerHeight) ? (innerWidth / 1.5) : (innerHeight / 1.5)) / 2) - 125) + "px";
    }
  }
  fitElementsIn();
  setTimeout(fitElementsIn, 50);
}
window.onresize = fitElements;

createGame(n, depth);