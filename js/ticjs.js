$(function() {

  // cache DOM
  const $userWins = $('#user-win-count');
  const $compWins = $('#ai-win-count');
  const $ties = $('#tie-game-count');
  const $streakPlayer = $('#streak-player');
  const $streakNumber = $('#streak-number');
  const $difficulty = $('#difficulty-text');
  const $diffButton = $('.diff-button');
  const $titleBar = $('.title-bar');
  const $scoreCard = $('.scorecard');
  const $gameBoard = $('.game-board');

  // animated.css jquery functionality
  $.fn.extend({
    animateCss: function(animationName) {
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      $(this).addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
      });
    }
  });

  // tracks total games played
  let gameCount = 0;
  // tracks current winner streak;
  let streak = 0;
  // sets default ai difficulty to easy
  let difficulty = 0;
  // tracks previous game winner
  let previousWinner = undefined;
  // tracks tied games
  let tieCount = 0;

  

  // determines appropriate toast to display 
  // (based on current difficulty)
  function getToast(toast) {

    // default toastr options
    const defaultOptions = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-bottom-full-width",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    // can't make difficulty easier in middle of game
    if (toast === 'no-difficulty-down') {
      Command: toastr["error"]("You can't change the difficulty mid-game, silly.", "Nice Try!")

        toastr.options = defaultOptions;
    }

    // can't make diffuculy harder in middle of game
    if (toast === 'no-difficulty-up') {
      Command: toastr["warning"]("You may only change the diffuculty before the start of a game.", "Hold that thought!")

        toastr.options = defaultOptions;
    }

  }

  // update title-bar
  function updateScorecardColor(diff) {
    if (diff === 'Easy') {
      $scoreCard.removeClass('challenging-title');
      $scoreCard.removeClass('impossible-title');
      $scoreCard.addClass('easy-title');
    } else if (diff === 'Challenging') {
      $scoreCard.removeClass('easy-title');
      $scoreCard.removeClass('impossible-title');
      $scoreCard.addClass('challenging-title');
    } else if (diff === 'Impossible') {
      $scoreCard.addClass('impossible-title');
      $scoreCard.removeClass('challenging-title');
      $scoreCard.removeClass('easy-title');
    } else {
      $scoreCard.removeClass('challenging-title');
      $scoreCard.removeClass('impossible-title');
      $scoreCard.removeClass('easy-title');
    }
  }

  // update the difficulty displayed text
  function updateDifficultyText() {
    if (difficulty === 0) {
      $($difficulty).text('Easy');
      updateScorecardColor('Easy');
      $diffButton.removeClass('challening');
      $diffButton.removeClass('impossible');
      $diffButton.addClass('easy');
      $titleBar.removeClass('challening');
      $titleBar.removeClass('impossible');
      $titleBar.addClass('easy');

    } else if (difficulty === 1) {
      $($difficulty).text('Challenging');
      updateScorecardColor('Challenging');
      $diffButton.removeClass('easy');
      $diffButton.removeClass('impossible');
      $diffButton.addClass('challening');
      $titleBar.removeClass('easy');
      $titleBar.removeClass('impossible');
      $titleBar.addClass('challening');

    } else if (difficulty === 2) {
      $($difficulty).text('Impossible');
      updateScorecardColor('Impossible');
      $diffButton.removeClass('easy');
      $diffButton.removeClass('challening');
      $diffButton.addClass('impossible');
      $titleBar.removeClass('easy');
      $titleBar.removeClass('challening');
      $titleBar.addClass('impossible');
    }
    console.log(difficulty);
  }
  
  
  setTimeout(function() {
    updateDifficultyText();
  }, 5000);

  // update scorecard
  function updateScorecard() {

    // updateDifficultyText();

    let prevWinnerName = undefined;
    if (previousWinner !== undefined) {
      prevWinnerName = previousWinner.name;
    }

    $userWins.text(user.winCount);
    $compWins.text(ai.winCount);
    $ties.text(tieCount);

    if (streak === 0) {
      $streakPlayer.text('');
    } else {
      $streakPlayer.text(`(${prevWinnerName})`);
    }

    $streakNumber.text(streak);
  }

  // changing the difficulty
  $diffButton.click(function() {
    // if the game has not started yet, allow difficulty change
    if (unplayedSquares.length === 9) {
      if (difficulty === 2) {
        difficulty = 0;
      } else if (difficulty === 1) {
        difficulty = 2;
      } else if (difficulty === 0) {
        difficulty = 1;
      }
      updateDifficultyText();

      // game has started, don't change difficuly and display toast
    } else {
      if (difficulty === 2) {
        getToast('no-difficulty-down');
      } else {
        getToast('no-difficulty-up');
      }
    }
  });

  // update streak
  function updateStreak(player) {
    if (previousWinner === player) {
      streak += 1;
    } else {
      previousWinner = player;
      streak = 1;
    }
  }

  // initial modal to determine player letters
  function getLetterChoice(title = 'Let\s Play!', text = 'Choose your letter') {

    // user modal letter choice
    let pickedLetter = '';

    // misc messages to diplay at game start
    const startMessages = [
      'Let\'s Play',
      'Let\'s Dance',
      'Let\'s Tango',
      'Let\'s Waltz',
      'Let\'s Do This',
      'Let\'s Rendevous'
    ];

    const titleMessage = startMessages[Math.floor(Math.random() * startMessages.length)];

    // sweet alert to determine player letters
    swal({
      title: titleMessage,
      text: text,
      type: 'success',
      showCancelButton: true,
      confirmButtonColor: 'grey',
      confirmButtonText: 'X',
      cancelButtonText: 'O',
      closeOnConfirm: true,
      closeOnCancel: true
    }, function(isConfirm) {
      if (isConfirm) {
        pickedLetter = 'X';
      } else {
        pickedLetter = 'O';
      }
      // apply the appropriate letter(s) to players
      applyPlayerLetters(pickedLetter);
      // initialize the game board

      // show gameboard
      $gameBoard.removeClass('hidden').animateCss('pulse');
      $difficulty.animateCss('flash');

      refreshBoard();
    });

  }

  // game end alert modal
  function gameEndAlert(type) {
    // define end message text
    let endMessage = undefined;

    if (type === 'win') {
      endMessage = `Game Over. ${activePlayer.name} wins!`;
    } else if (type === 'tie') {
      endMessage = `It's a tie!`;
    }

    swal({
      title: endMessage,
      text: 'Play again?',
      type: 'info',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      closeOnConfirm: false,
      closeOnCancel: false
    }, function(isConfirm) {
      if (isConfirm) {
        newGame();
      } else {
        swal({
          title: 'Adios, friend',
          text: 'Thanks for playing!',
          allowEscapeKey: true,
          allowOutsideClick: true
        });

        // hide the game board
        $gameBoard.fadeOut(2000);
      }
    });
  }

  // refresh game board visibility
  function refreshBoard() {
    $gameBoard.hide();
    $gameBoard.fadeIn('slow');
  }

  // refreshBoard();
  getLetterChoice();

  // default squares
  const defaultSquares = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ];
  // unplayed squares
  let unplayedSquares = defaultSquares;
  // winning square combinations
  const winningCombinations = [
    [
      1, 2, 3
    ],
    [
      4, 5, 6
    ],
    [
      7, 8, 9
    ],
    [
      1, 4, 7
    ],
    [
      1, 5, 9
    ],
    [
      2, 5, 8
    ],
    [
      3, 6, 9
    ],
    [3, 5, 7]
  ];

  // Player constructor
  function Player(name) {
    this.name = name;
    this.letter = '';
    this.squaresPlayed = [];
    this.winCount = 0;

    this.addSquare = function(x) {
      this
        .squaresPlayed
        .push(x);
    };

    this.addWin = function() {
      this.winCount += 1;
    };

    this.clearSquares = function() {
      this.squaresPlayed = [];
    };

    this.setLetter = function(char) {
      this.letter = char;
    };

    this.getLetter = function() {
      return this.letter;
    };

    this.clearClass = function() {
      $('.game-block')
        .removeClass('letter-x')
        .removeClass('letter-o');
    }
  }

  // starts new game
  function newGame() {
    // update the scorecard
    updateScorecard();

    // update total game count
    gameCount += 1;

    // reset unplayed squares
    unplayedSquares = defaultSquares;

    // remove all played squares from players
    user.clearSquares();
    ai.clearSquares();

    // remove color classes
    user.clearClass();
    ai.clearClass();

    // remove all letters from the gameboard
    $('.game-block').text('');

    // reset active player to user
    activePlayer = user;

    // refresh the board
    getLetterChoice();
  }

  // checks whether all items in [a] are present in [b]
  function includesAll(a, b) {
    return a.every(item => b.includes(item));
  }

  // returns random value from array
  function randomOf(arr) {
    return arr[Math.floor(Math.random(arr) * arr.length)];
  }

  // returns items not shared between two arrays
  function differenceOf(x, y) {
    return x.filter(i => !y.includes(i));
  }

  // checks whether a player has won the game
  function playerWins(playerSquares = activePlayer.squaresPlayed, winCombos = winningCombinations) {

    // returns true if the active player has played all squares in...
    // ...one of the winning combinations
    return winCombos.some(combo => includesAll(combo, playerSquares));
  }

  // toggles the active player
  function toggleActivePlayer(player) {
    return player.name === 'User' ?
      ai :
      user;
  }

  // function to determine players letters
  function applyPlayerLetters(choiceLetter) {
    const compLetter = choiceLetter === 'X' ?
      'O' :
      'X';
    console.log(`TEMP LETTER: ${choiceLetter}`);
    console.log(`COMP LETTER: ${compLetter}`);
    user.setLetter(choiceLetter);
    ai.setLetter(compLetter);
  }

  // Declare players
  const user = new Player('User');
  const ai = new Player('Computer');

  // Active player is User by default
  let activePlayer = user;

  updateScorecard();

  // on game-block click...
  $('.game-block').each(function() {
    const $square = $(this).attr('id');
    $(this).click(function() {
      chooseSquare($square, unplayedSquares);
    });
  });

  // choose square for current player
  function chooseSquare(choiceSquare) {
    const choice = Number(choiceSquare);
    const played = [];

    console.log(`
      CHOICE: ${choice}
      AVAILABLE: ${unplayedSquares}
      PLAYER: ${activePlayer}
      NAME: ${activePlayer.name}
      LETTER: ${activePlayer.letter}
      `);

    // ensure chosen square is available
    if (unplayedSquares.includes(Number(choice))) {

      // display active player's letter in the chosen square
      $(`#${choice}`).text(activePlayer.letter);

      // add color class to square
      if (activePlayer.letter === 'X') {
        $(`#${choice}`).addClass('letter-x');
      } else if (activePlayer.letter === 'O') {
        $(`#${choice}`).addClass('letter-o');
      }

      // assign the chosen square to the current player
      activePlayer.addSquare(choice);

      // push played square to played array
      played.push(choice);

      // update available squares
      unplayedSquares = differenceOf(unplayedSquares, played);

      // check if player wins the game
      if (playerWins()) {

        // add to the player's win count
        activePlayer.addWin();

        // update streak stats
        updateStreak(activePlayer);

        gameEndAlert('win');

        // check for tie
      } else if (unplayedSquares.length === 0) {

        gameEndAlert('tie');

        tieCount += 1;
        streak = 0;

        // game is not over
      } else {

        activePlayer = toggleActivePlayer(activePlayer);

        console.log(`
        NOW AVAILABLE: ${unplayedSquares}
        NOW PLAYING: ${activePlayer}
        NAME: ${activePlayer.name}
        LETTER: ${activePlayer.letter}
        `);

        // ai choice
        if (activePlayer === ai) {
          getComputerMove();
        }

      }

    } else {

      // if the square is not available
      console.log('Not available. Please try another square.');

      // if the current player is the computer...try again
      if (activePlayer === ai) {
        // getComputerMove();
      }
    }
  }

  // COMPUTER MOVE HELPER FUNCTIONS
  // ==============================

  // checks whether a two arrays have at least n matching matching values
  function closeEnough(check, target, num) {
    // get the values of target that are present in check
    const present = target.filter(item => check.includes(item));
    // returns true if there are at least n values present
    return present.length >= num;
  }

  // returns array of all individual moves that would result in a win
  function playsToWin(check, target) {
    return target.map(function(sub) {
      return sub.filter(function(item) {
        return check.indexOf(item) === -1;
      });
    }).reduce((a, b) => a.concat(b), []);
  }

  // returns plays that could win in one move
  function onePlayWin(player) {
    const opponent = player === user ?
      ai :
      user;

    // retrieves winning combos in which the player has...
    // ...at least two of th three needed squares
    const closeSets = winningCombinations.filter(combo => closeEnough(player.squaresPlayed, combo, 2));

    // single array of moves that could win
    const couldWin = playsToWin(player.squaresPlayed, closeSets);

    // filters moves to only the ones that are available
    return couldWin.filter(s => !opponent.squaresPlayed.includes(s));

  }

  // Determine AI move
  function getComputerMove() {

    // list of single moves that would win the game for ai
    const compCouldWin = onePlayWin(ai);
    // list of single moves that would win the game for user
    const userCouldWin = onePlayWin(user);

    // tests whether a move avoids the sides
    function notSides(sq) {
      if ([1, 3, 5, 7, 9].includes(sq)) {
        return true;
      }
      return false;
    }

    // finds the first available option is not on the sides
    const middleOrCorner = unplayedSquares.find(option => notSides(option));

    // play a square that would win the game
    if (compCouldWin.length > 0 && difficulty >= 1) {
      chooseSquare(compCouldWin[0]);

      // play a square that would block user from winning
    } else if (userCouldWin.length > 0 && difficulty >= 1) {
      chooseSquare(userCouldWin[0]);

      // play the middle square
    } else if (unplayedSquares.includes(5) && difficulty >= 2) {
      chooseSquare(5);

      // play one of the corners
    } else if (middleOrCorner !== undefined && difficulty >= 2) {

      chooseSquare(middleOrCorner);

      // play a random available square
    } else {
      chooseSquare(randomOf(unplayedSquares));
    }
  }

});