/**
 * 
 */
var GameViewModel = function(){
  var self = this;
  /* CONSTS */
  var rowLength = $('.cell[data-x=1]').length;
  self.colors = ['red','blue','green','yellow','purple'];//,

  /* HELPERS */
  var getRandomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getCellByCoords = function (x,y){
    return $('.cell[data-x='+x+'][data-y='+y+']');
  };

  var getColorById = function(id){
    return self.colors[id];
  };

var getCellColor = function($cell){
  var cellColor = {'color': '', 'index': -1};
  self.colors.forEach(function(color, id){
    if($cell.hasClass(color)){
      cellColor = {'color': color, 'index': id};
      return;
    }
  });
  return cellColor;
};

  
  var koIncrease = function(observable, value){
    return observable(observable()+value);
  };

/* GAME LOGIC */
  self.Score = ko.observable(0);
  self.Combo = ko.observable(0);
  self.Level = ko.observable(1);
  
  self.KillColors = ko.observable(0);
  self.MoveCells = ko.observable(0);
  
  self.LevelColor = ko.observable(self.colors [0]);
  
  self.LinesMade = ko.observable(0);
  
  self.LinesInLevel = ko.computed(function(){
    return self.Level() * 5;
  });
  
  self.LinesLeft = ko.computed(function(){
    if(self.LinesInLevel() <= self.LinesMade()){
      koIncrease(self.Level,1);
      self.LinesMade(0);
      koIncrease(self.KillColors,1);
      koIncrease(self.MoveCells,1);
    }
    return self.LinesInLevel() - self.LinesMade();
  });
  
  self.Progress = ko.computed(function(){
    return self.LinesMade()/self.LinesInLevel()*100;
  });
  
  self.NextColors = ko.observableArray();
  


var findAccessibleCells = function findNearbyAccessibleFor($cell){
  var x = $cell.data('x');
  var y = $cell.data('y');
  for(var i=1; i<=4; i++){
    var sin = Math.round(Math.sin(i*(Math.PI/2)));//1,0,-1,0
    var cos = Math.round(Math.cos(i*(Math.PI/2)));//0,-1,0,1
    
    var $nearbyCell = getCellByCoords(x+sin,y+cos);
    if ($nearbyCell.length > 0){
      var isFreeCell = !$nearbyCell.hasClass('active');
      var isNonMarkedCell = !$nearbyCell.hasClass('accessible');
      if(isFreeCell && isNonMarkedCell){
        $nearbyCell.addClass('accessible');
        findNearbyAccessibleFor($nearbyCell);
      }
    }
  }//for
};

var clearAccessibleCells = function(){
  $('.cell.accessible').removeClass('accessible');
  $('#game-board').removeClass('cell-selected');
};

var checkCombos = function(){
  
  var comboFound = false;
  for(var row=1; row<=rowLength; row++){
    var stackRow = [];
    var stackCol = [];
   
    
    for(var col=1; col<=rowLength; col++){
            
      var pushComboStack = function(stack, $cell){
        
        var cellIsActive = $cell.hasClass('active');
        var stackIsEmpty = (stack.length == 0);
        var prevItemSameColor = cellIsActive && (stackIsEmpty 
        || getCellColor(stack[stack.length-1]).color ==
            getCellColor($cell).color);
        
        if(cellIsActive && !prevItemSameColor){
          stack.length = 0;
          stack.push($cell);
        } else if(cellIsActive && prevItemSameColor){
          stack.push($cell);
        }else{
          stack.length = 0;
        }
      };
      
      pushComboStack(stackRow, getCellByCoords(row,col));
      pushComboStack(stackCol, getCellByCoords(col,row));
      
      
      var checkComboStack = function(stack){
        if(stack.length > 3){
          self.LinesMade(self.LinesMade()+1);
          stack.forEach(function($cell){
            setTimeout(function(){
            $cell.removeClass('active')
            .removeClass(getCellColor($cell).color);
              self.Score(self.Score()+self.Combo());
            },300);
          });
          
          self.LevelColor(getCellColor(stack[0]).color);
          return true;
        }
        return false;
      };
      
      comboFound |= checkComboStack(stackRow) || checkComboStack(stackCol);
    }
    
  }
  
  if(comboFound){
    self.Combo(self.Combo()+ self.Level());
  }else{
    self.Combo(0);
  }
  return comboFound;
};


var selectCell = function(){
  
  var $cell = $(this);
  if($cell.hasClass('active')){ //it's active cell
    if($cell.hasClass('selected')){
      //unselect selected cell
      $cell.removeClass('selected');
      clearAccessibleCells();
    }else{
      //select current cell
      $('.cell.selected').removeClass('selected');
      clearAccessibleCells();
      $cell.addClass('selected');
      findAccessibleCells($cell);
      $('#game-board').addClass('cell-selected');
    }
  }else if($cell.hasClass('accessible')){ //it's accessible inactive cell
    //move old cell to new
    var $oldCell = $('.cell.active.selected');
    if($oldCell.length > 0){//any cell is selected
      var oldColor = getCellColor($oldCell);
      
      $oldCell.removeClass('active selected')
          .removeClass(oldColor.color);
      $cell.addClass('active').addClass(oldColor.color);
      clearAccessibleCells();
      
      if(checkCombos()==false){ // no combos found
        setTimeout(function(){addRandomCells(3);},300);
      }     
      
    }
  }
};

  

var addRandomCells = function(count){
  count = count || 1;
  for(i=0; i < self.NextColors().length; i++){
    var freeCells = $('.cell:not(.active)');
    if(freeCells.length<1){
      console.log('gameover');
      return;
    }
    
    var cellIndex = getRandomInt(0, freeCells.length-1);
    
    $(freeCells[cellIndex]).addClass('active')
    .addClass(self.NextColors()[i]);
  }
  self.NextColors([]);
  
  for(i=0; i<count; i++){
    var randomColor = getRandomInt(0, Math.min(self.Level(), self.colors.length-1));
    self.NextColors.push(self.colors[randomColor]);
  }
  setTimeout(checkCombos, 300);
};

var clearCells = function(){
  var allCells = $('.cell');
  allCells.removeClass('active selected');
  self.colors.forEach(function(color, index){
    allCells.removeClass(color);
  }); 
  
  self.Score(0);
};

  var startNewGame = function(){
    self.Score(0);
    self.Combo(0);
    self.Level(1);
    self.LinesMade(0);

    clearCells();
    addRandomCells(3);
    addRandomCells(3);
    addRandomCells(3);
  };

  var selectCombo = function(){
    $('button').removeClass('selected');
    $(this).addClass('selected');
  };
  
  var killColor = function(){
    alert('sorry, not impl. yet ;(');
    selectCombo();
    
  };
  
  var moveCell = function(){
    alert('sorry, not impl. yet ;(');
    selectCombo();
  };
  
$('#game-board').on('click','.cell', selectCell);

  $('#new-game').on('click', startNewGame);
  $('#kill-color').on('click', killColor);
  $('#move-cell').on('click', moveCell);


/* basic demo for preview */
(function(){
  [3].forEach(function(value){
    setTimeout(startNewGame,value*150);
  });
})();
}

var vm = new GameViewModel();

ko.applyBindings(vm);