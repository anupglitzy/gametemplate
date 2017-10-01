var imagePart = (function() {
    return function(x, y, rows, columns, img, special) {
        var _x = x, _y = y;
        var _posX = x, _posY = y;
        var _offsetX, _offsetY;
        var _rows = rows, _columns = columns;
        var _special = special;
        var _img = img;

        this.changePosition = function(posX, posY) {
            _posX = posX;
            _posY = posY;
            this.refresh();
        }

        this.posX = function() { return _posX; }
        this.posY = function() { return _posY; }
        this.special = function() { return _special; }

        this.id = function () {
            return '#' + _posY + _posX;
        }

        this.onDatPlace = function() {
            return _posX == _x && _posY == _y;
        }

        this.refresh = function() {
            var ctx = $(this.id())[0].getContext('2d');
            _offsetX = -_x*(_img.width/_columns);
            _offsetY = -_y*(_img.height/_rows);
            if(!_special) {
                ctx.drawImage(_img, _offsetX, _offsetY);
                if(displayHelp) {
                    ctx.font = "12pt Arial";
                    ctx.fillStyle = "rgb(255,255,255)";
                    ctx.strokeStyle = "rgb(255,255,255)";
                    ctx.globalAlpha = 0.5;
                    ctx.strokeText("#"+_x+_y, 5, _img.height/_rows - 5);
                    ctx.globalAlpha = 1.0;
                }
            } else {
                ctx.fillStyle = '#000';
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
            }
        }
    }
})();

var imageParts = [];
var clicks = 0;
var displayHelp = false;

function setImage(url, rows, columns) {
    var img = new Image;
    img.onload = function() {   
        for(var i = 0; i < rows; ++i) {
            for(var j = 0; j < columns; ++j) {
                var ctx = $('#'+i+j)[0].getContext('2d');
                var imgPart;
                if(img.height>screen.height || img.width>screen.width){
                	 ctx.canvas.height = (screen.height*2/3)/rows; 
                	 ctx.canvas.width = (screen.width*2/3)/columns;
                }else{
                	 ctx.canvas.height = img.height/rows; 
                     ctx.canvas.width = img.width/columns;
                }

                if(i == rows - 1 && j == columns - 1) 
                    imgPart = new imagePart(j,i,rows,columns,img,true);
                else 
                    imgPart = new imagePart(j,i,rows,columns,img,false);

                imgPart.refresh();
                imageParts.push(imgPart);
            }
        }
    };  
    img.src = url;
}

function createTable(rows,columns) {
    $('#canvasTable').remove();
    var table = $('<table></table>')
        .attr({
            id : 'canvasTable',
            border : 0,
            cellspacing : 0,
            cellpadding : 0
        });
    for(var i = 0; i < rows; ++i) {
        var tr = $('<tr></tr>');
        for(var j = 0; j < columns; ++j) {
            var td = $('<td></td>')
                .append($('<canvas></canvas>')
                        .addClass('imagePart')
                        .attr({id : ''+i+j}))
                .addClass('tableCell');
            $(tr).append(td);
        }
        $(table).append(tr);
    }
    $('#puzzle').append(table);
}

function getImgPart(x,y) {
    for(var i in imageParts) {
        if(imageParts[i].posX() == x && imageParts[i].posY() == y) {
            return imageParts[i];
        }
    }
}

function getImgPartById(id) {
    for(var i in imageParts) {
        if(imageParts[i].id() == '#' + id) {
            return imageParts[i];
        }
    }
}

function switchParts(x1, y1, x2, y2) {
    var imgPart1 = getImgPart(x1,y1);
    var imgPart2 = getImgPart(x2,y2);

    if(imgPart1 !== imgPart2) {
        imgPart1.changePosition(x2,y2);
        imgPart2.changePosition(x1,y1);
    }
}

function clickOn(id) {
    var imgPart = getImgPartById(id);
    var special;

    for(var i in imageParts) {
        if(imageParts[i].special()) 
            special = imageParts[i];
    }

    if(special === imgPart) 
        return false;

    if(special.posX() == imgPart.posX() || special.posY() == imgPart.posY()) {
        var diffX = special.posX() - imgPart.posX();
        var diffY = special.posY() - imgPart.posY();
        var signX = diffX < 0 ? -1 : 1;
        var signY = diffY < 0 ? -1 : 1;
      
        for(var i = 0; i < Math.max(Math.abs(diffX), Math.abs(diffY)); ++i) {
            switchParts(special.posX(), special.posY(), 
                    diffX != 0 ? special.posX() - signX : special.posX(), 
                    diffY != 0 ? special.posY() - signY : special.posY());
        }
        return true;
    }   
    return false;
}

function randomize(rows, columns, iteration) {
     i = 0;
     interval = setInterval(function() {
         var rand1 = Math.floor(Math.random() * rows);
         var rand2 = Math.floor(Math.random() * columns);
         if(clickOn("" + rand1 + rand2)) i++;
         if(iteration == i) clearInterval(interval);
     }, 7);
}

function setClicks(clicks_) {
    clicks = clicks_;
    $('#clicks').text(clicks);
}

function load(rows, columns, url) {
    if(url == "" || rows == 0 || columns == 0)
        return;

    imageParts = [];
    createTable(rows,columns);
    setImage(url, rows, columns);

    $('.imagePart').click( function() {
        if(clickOn(this.id)) {
            setClicks(clicks+1);
            if(checkWin(rows, columns)) {
                alert('done right');
                setClicks(0);
            }
        }
    });
}

function checkWin(rows, columns) {
    var win = true;
    for(var obj in imageParts) {
        win &= imageParts[obj].onDatPlace();
    }
    return win;
}

$(document).ready(function() {
    var rows = 4, columns = 4;
    load(rows,columns,"https://static.gamespot.com/uploads/original/917/9176928/2555087-9491149080-tomb_.jpg");
    randomize(rows, columns, 100);

    $('#displayHelp').change( function() {
        displayHelp = !displayHelp;
        for(var i in imageParts) {
            imageParts[i].refresh();
        }
    });
  
    $('#randomize').click( function() {
        setClicks(0);
        randomize(rows, columns, 100);
    });
});