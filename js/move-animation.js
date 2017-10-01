var myGamePiece;
        var myObstacles = [];
        var myScore;
        var tempTreeX;
        var tempTreeY;
        var randomHeight;

        var canvas;
        var img = new Image();
        var img2 = new Image();
        var img3 = new Image();
        var img4 = new Image();
        var img5 = new Image();
        var bubble = new Image();
        var hilsmills = new Image();
        var cloud = new Image();
        img2.src = 'img/octupars.png';
        img4.src = "img/hill2.png";
        img5.src = "img/obstacle4.png";
        bubble.src = "img/bubble2.png";
        hilsmills.src = "img/hill-with-windmill.png";
        cloud.src = "img/cloud.png";
        var imgArray = new Array();

        imgArray[0] = new Image();
        imgArray[0].src = 'img/bird1.png';

        imgArray[1] = new Image();
        imgArray[1].src = 'img/bird2.png';

        imgArray[2] = new Image();
        imgArray[2].src = 'img/bird3.png';

        var frameCount = imgArray.length;
        var i = 0;
        var index = setInterval(timer, 100);

        var value;
        var bgmove = setInterval(timer2, 100);
        value = 0;

        function startGame() {
            myGamePiece = new component(30, 30, 10, 120, "character", "schar", "schar");
            myGamePiece.gravity = 0.05;
            myScore = new component("30px", "Consolas", 280, 40, "text");
            myGameArea.start();
        }

        var myGameArea = {

            start: function() {
                canvas = document.getElementById('myCanvas');
                canvas.width = 683;
                canvas.height = 319;
                //console.log( window.innerWidth/2 +"value " + window.innerHeight/2);
                ctx = canvas.getContext("2d");

                //drawImageProp(ctx, img4, value, 0, canvas.width, canvas.height, 0.1, 0.5);

                context = canvas.getContext("2d");

                tmpTreeX = window.innerWidth / 2;
                tmpTreeY = window.innerHeight / 2;
                document.body.insertBefore(canvas, document.body.childNodes[0]);
                this.frameNo = 0;
                this.interval = setInterval(updateGameArea, 20);
                canvas.onmousedown = function(e) {
                    accelerate(-0.2);


                }
                canvas.onmouseup = function(e) {
                    accelerate(0.05);

                }
            },
            clear: function() {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        function component(width, height, x, y, type, r, schar) {
            this.type = type;
            this.schar = schar;
            this.score = 0;
            this.width = width;
            this.height = height;
            this.speedX = 0;
            this.speedY = 0;
            this.x = x;
            this.y = y;
            this.r = r;
            this.gravity = 0;
            this.gravitySpeed = 0;
            this.update = function() {
                canvas = document.getElementById('myCanvas');
                ctx = canvas.getContext("2d");

                if (this.type == "text") {
                    ctx.font = this.width + " " + this.height;
                    ctx.fillText(this.text, this.x, this.y);
                } else if (this.type == "character") {

                    if (this.schar == "schar") {
                        ctx.drawImage(imgArray[frameCount], this.x, this.y - img2.height, 70, 70);
                    } else {
                        ctx.drawImage(img2, this.x, this.y - img2.height, 70, 70);
                    }
                    if ((this.y - img2.height) < 0) {
                        this.gravitySpeed = 0.1;
                    }

                } else {
                    var temp_random = Math.floor(Math.random() * 3) + 1;
                    if (this.type == "top") {

                        var temp = img5.height - this.height;
                        ctx.drawImage(img5, 0, 0, img5.width, img5.height, this.x, this.y - temp, img5.width, img5.height);

                        img5.src = 'img/obstacle4.png';
                    }
                    if (this.type == "bottom") {
                        ctx.drawImage(img, 0, 0, img.width, this.height, this.x, this.y, img.width, this.height);

                        img.src = 'img/obstacle1.png';
                    }
                }
            }
            this.newPos = function() {
                this.gravitySpeed += this.gravity;
                this.x += this.speedX;
                this.y += this.speedY + this.gravitySpeed;
                this.hitBottom();
            }
            this.hitBottom = function() {
                var rockbottom = 364;
                if (this.y > rockbottom) {
                    this.y = rockbottom;
                    this.gravitySpeed = 0;
                }
            }
            this.crashWith = function(otherobj) {

                var myleft = this.x;
                var myright = this.x + (width);
                var mytop = this.y;
                var mybottom = this.y + (height);
                var otherleft = otherobj.x;
                var otherright = otherobj.x + (otherobj.width);
                var othertop = otherobj.y;
                var otherbottom = otherobj.y + (otherobj.height);
                var crash = true;
                if ((mybottom - img2.height < othertop) || (mytop - img2.height > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
                    crash = false;
                }
                return crash;

            }
        }

        function updateGameArea() {
            var x, height1, gap, minHeight, maxHeight, minGap, maxGap;
            for (i = 0; i < myObstacles.length; i += 1) {
                if (myGamePiece.crashWith(myObstacles[i])) {

                    return;
                }
            }
            myGameArea.clear();

            for (var i = 0; i < 400; i++) {
                ctx.drawImage(cloud, value / 4 + i * cloud.width, 0, cloud.width, 114);
                ctx.drawImage(hilsmills, value / 2 + i * hilsmills.width, canvas.height - 312, hilsmills.width, 312);
                ctx.drawImage(img4, value + i * img4.width, canvas.height - 94, img4.width, 94);
            }

            //ctx.drawImage(img4, value + img4.width, canvas.height-94, img4.width, 94);

            myGameArea.frameNo += 1;
            if (myGameArea.frameNo == 1 || everyinterval(150)) {
                x = 683;
                minHeight = 20;
                maxHeight = 200;
                height1 = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
                minGap = 80;
                maxGap = 140;
                gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
                myObstacles.push(new component(10, height1, x, 0, "top", gap));
                myObstacles.push(new component(10, window.innerHeight - (height1 + gap), x, height1 + gap, "bottom", 0));

            }
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].x += -1;
                myObstacles[i].update();

            }
            if (myGameArea.frameNo > 700) {
                var temp = myGameArea.frameNo / 100 - 7;
                myScore.text = "SCORE: " + Math.round(temp);
                myScore.update();
            }
            myGamePiece.newPos();
            myGamePiece.update();
        }


        function everyinterval(n) {
            if ((myGameArea.frameNo / n) % 1 == 0) {
                return true;
            }
            return false;
        }

        function accelerate(n) {
            myGamePiece.gravity = n;

        }

        function octopusmove() {

        }

        function timer() {
            //console.log( frameCount );
            if (frameCount <= 0) {
                frameCount = imgArray.length;
                clearInterval(index);
                index = setInterval(timer, 150);
            }
            frameCount -= 1;
        }


        function timer2() {
            //console.log( frameCount );
            //if ( value <= 0 ) {
           // console.log('Reaching Stop' + value);
            clearInterval(bgmove);
            bgmove = setInterval(timer2, 10);
            //value = img4.width;
            //}
            value -= 1;
        }

        function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
            if (arguments.length === 2) {
                x = y = 0;
                w = ctx.canvas.width;
                h = ctx.canvas.height;
            }

            /// default offset is center
            offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
            offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

            /// keep bounds [0.0, 1.0]
            if (offsetX < 0) offsetX = 0;
            if (offsetY < 0) offsetY = 0;
            if (offsetX > 1) offsetX = 1;
            if (offsetY > 1) offsetY = 1;

            var iw = img.width,
                ih = img.height,
                r = Math.min(w / iw, h / ih),
                nw = iw * r, /// new prop. width
                nh = ih * r, /// new prop. height
                cx, cy, cw, ch, ar = 1;

            /// decide which gap to fill    
            if (nw < w) ar = w / nw;
            if (nh < h) ar = h / nh;
            nw *= ar;
            nh *= ar;

            /// calc source rectangle
            cw = iw / (nw / w);
            ch = ih / (nh / h);

            cx = (iw - cw) * offsetX;
            cy = (ih - ch) * offsetY;

            /// make sure source rectangle is valid
            if (cx < 0) cx = 0;
            if (cy < 0) cy = 0;
            if (cw > iw) cw = iw;
            if (ch > ih) ch = ih;

            ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
        }
        
        startGame();