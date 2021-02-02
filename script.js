window.onload = () => {
  
    class Game {

        constructor(){
            this.canvasWidth = 900;
            this.canvasHeight = 600;
            this.blockSize = 30;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d'); 
            this.widthInBlocks = this.canvasWidth/this.blockSize;
            this.heightInBlocks = this.canvasHeight/this.blockSize;
            this.centreX = this.canvasWidth / 2;
            this.centreY = this.canvasHeight / 2;
            this.snakee;
            this.applee;
            this.score;
            this.timeout;
        }

        init(){
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            this.canvas.style.border = "30px solid gray";
            this.canvas.style.margin = "50px auto";
            this.canvas.style.display = "block";
            this.canvas.style.backgroundColor = "#ddd";
            document.body.appendChild(this.canvas);
            this.launch();
        }
        
        launch(){
            this.snakee = new Snake("right", [6,4], [5,4], [4,4], [3,4],[2,4]);
            this.applee = new Apple();
            this.score = 0;
            clearTimeout(this.timeout);
            this.delay=100;
            this.refreshCanvas();
        }
        
        refreshCanvas(){
            this.snakee.advance();
            if (this.snakee.checkCollision(this.widthInBlocks, this.heightInBlocks)){
                    Drawing.gameOver(this.ctx, this.centreX, this.centreY);
                }
            else{
                if(this.snakee.isEatingApple(this.applee)){
                    this.score++;
                        this.snakee.ateApple = true;
                        do{
                            this.applee.setNewPosition(this.widthInBlocks, this.heightInBlocks);  
                            }
                        while(this.applee.isOnSnake(this.snakee))       
                    }
                this.ctx.clearRect(0,0, this.canvasWidth, this.canvasHeight);
                Drawing.drawScore(this.ctx, this.centreX, this.centreY, this.score);
                Drawing.drawSnake(this.ctx, this.blockSize, this.snakee);
                Drawing.drawApple(this.ctx, this.blockSize, this.applee);
                this.timeout =
                setTimeout(this.refreshCanvas.bind(this), this.delay);   
                }
        }

        speedUp(){
            this.delay/=2;
        }
    }

    class Snake {
        constructor(direction, ...body){
            this.body = body;
            this.direction = direction;
            this.ateApple = false;
        }

        advance (){
            const nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right": 
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction"); 
            }

            this.body.unshift(nextPosition);
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
            };

        setDirection (newDirection){
                let allowedDirections;
                switch(this.direction){
                    case "left":
                    case "right":
                        allowedDirections = ["up", "down"];
                        break;
                    case "down":
                    case "up":
                        allowedDirections = ["left", "right"];
                        break;  
                default:
                    throw("Invalid Direction");        
                }
                if (allowedDirections.includes(newDirection)){
                    this.direction = newDirection;
                }
            };

        checkCollision(widthInBlocks, heightInBlocks ){
               let wallCollision = false;
               let snakeCollision = false;
               const [head, ...rest] = this.body;
               const [snakeX, snakeY]= head;
               const minX = 0;
               const minY = 0;
               const maxX = widthInBlocks - 1;
               const maxY = heightInBlocks - 1;
               const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
               const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

               if(isNotBetweenVerticalWalls || isNotBetweenHorizontalWalls){
                   wallCollision = true;
               }
               for(let block of rest){
                        if(snakeX === block[0] && snakeY === block[1]){
                            snakeCollision = true;
                        }
                    }

                return wallCollision || snakeCollision;
           };

        isEatingApple (appleToEat){
        const head = this.body[0];
        if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){ 
            return true;}
        else{
            return false;}
        };
    }
    
    class Apple{
        constructor(position = [12, 10]){
            this.position = position;
        }

        setNewPosition (widthInBlocks, heightInBlocks){
            const newX = Math.round(Math.random()*(widthInBlocks - 1 ));
            const newY = Math.round(Math.random()*(widthInBlocks - 1 ));
            this.position = [newX,newY];
        };

        isOnSnake (snakeToCheck){
            let isOnSnake = false;
            for (let block of snakeToCheck.body){
                if(this.position[0] === block[0] && this.position[1] === block[1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };

    }

    class Drawing{

        static gameOver(ctx, centreX, centreY){
            ctx.save();
            ctx.font = "bold 70px sans-serif";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.strokeText("Game Over", centreX, centreY - 180);
            ctx.fillText("Game over", centreX,centreY - 180);
            ctx.font = "bold 30px sans-serif";
            ctx.strokeText("Appuyer sur la touche Espace pour rejouer",centreX, centreY - 120);
            ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
            ctx.restore();
        };

        static drawScore(ctx, centreX, centreY, score){
            ctx.save();
            ctx.font = "bold 200px sans-serif";
            ctx.fillStyle = "gray";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(score.toString(), centreX, centreY);
            ctx.restore();
        };

        static drawSnake(ctx, blockSize, snake ){           
            ctx.save ();
            ctx.fillStyle = "#ff0000";
            for(let block of snake.body){
                this.drawBlock(ctx, block, blockSize);
            }
            ctx.restore ();  
        };

        static drawApple(ctx, blockSize, apple){
            const radius = blockSize/2;
            const x = apple.position[0]*blockSize + radius;
            const y = apple.position[1]*blockSize + radius;
            ctx.save();
            ctx.fillStyle= "#33cc33";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };

        static drawBlock(ctx, position, blockSize){
            const [x, y] = position;
            ctx.fillRect(x * blockSize ,y * blockSize , blockSize, blockSize);  
        };
        
    }

    let myGame = new Game();
    myGame.init();
        
    document.onkeydown = (e) => {
            const key = e.keyCode;
            let newDirection;
            switch(key){
                case 37:
                    newDirection = "left";
                    break;
                case 38:
                    newDirection = "up";
                    break;
                case 39:
                    newDirection = "right";
                    break; 
                case 40:
                    newDirection = "down";
                    break;
                case 32:
                    myGame.launch();
                    return;
                default :
                    return;
            }
            myGame.snakee.setDirection(newDirection);
        };

  
}
