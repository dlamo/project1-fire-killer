'use strict';

const firefighter = {
    x: 10,
    y: canvas.height,
    width: 200,
    height: 200 * 498 / 960,
    lives: 3,
    product: 'water',
    productShots: [],
    img: new Image(),
    draw: function() {
        this.img.src = 'images/firefighter-left.webp';
        //rotate the firefighter img
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(90 * Math.PI / 180);
        context.filter = 'brightness(150%)';
        context.drawImage(this.img, canvas.width / 2 - this.width, canvas.height / 2 - this.width / 2 - this.x, this.width, this.height);
    },
    drawLives: function() {
        const live = new Image();
        context.fillStyle = 'white';
        context.font = '32px Arial';
        context.fillText('Lives:', 10, 150);
        live.src = 'images/firefighter-left.webp';
        for (let i = 1; i <= this.lives; i++) {
            context.drawImage(live, 0, 120 + i * 50, this.width / 3, this.height / 3);
        };
    },
    drawHydrant: function() {
        const hydrant = new Image();
        hydrant.src = 'images/fire_hydrant.png';
        hydrant.height = 120;
        hydrant.width = 120;
        context.drawImage(hydrant, 1050, canvas.height - hydrant.height, hydrant.width, hydrant.height);
    },
    move: function(dir) {
        if (dir === 'left') {
            this.x -= 20;
        } else if (dir === 'right') {
            this.x += 20;
        };
    },
    //display the current product the player is shooting
    displayProduct: function() {
        context.fillText('Product:', 1060, 150);
        context.fillText(this.product, 1060, 240);
        const legend = new Product(this.x, this.product, context);
        legend.drawActualProduct();
    },
    //create the bubble product
    productShot: function() {
        playSound('bubbleShot');
        this.productShots.push(new Product(this.x, this.product, context));
    },
    //call the method draw inside shot
    drawproductShots: function() {
        this.productShots.forEach(shot => shot.draw());
    },
    //clear product bubble once are out of range of the fire
    clearProduct: function() {
        if (this.productShots[0] && this.productShots[0].y <= building.fires[0].y) {
            this.productShots.shift();
        };
    },
    checkBrickHit: function(bricksArr) {
        if (bricksArr[0]){
            for (let i = 0; i < bricksArr.length; i++) {
                const brick = bricksArr[i];
                //check hit of the bricks with the firefighter
                if (brick.y >= (this.y - 0.6*this.width)) {
                    const leftLimit = this.x;
                    const rightLimit = this.x + this.height;
                    if (brick.x + brick.width >= leftLimit && brick.x < rightLimit) {
                        building.bricks.splice(i, 1);
                        playSound('blockHit');
                        playSound('maleGrunt');
                        this.lives--;
                        building.gameEnd();
                    };
                };
                //check hit of each of the bricks with the bubbles
                this.productShots.forEach((shot, index) => {
                    if (brick.y + brick.height >= shot.y - shot.radius && brick.y + brick.height > shot.y) {
                        if (brick.x + brick.width >= shot.x - shot.radius && brick.x < shot.x + shot.radius) {
                            playSound('bubblePop');
                            this.productShots.splice(index, 1);
                        };
                    };
                });
            };
        };
    },
    //change the product when you are behind the hydrant
    selectExtinguishingAgent: function() {
        if (this.x >= 1010) {
            this.product == 'water' ? this.product = 'dry-chem' : this.product = 'water';
            playSound('changeProduct');
        };
    },
    drawWinner: function() {
        const img = new Image();
        img.src = 'images/trophy.png';
        img.width = 496;
        img.height = 604;
        img.onload = function() {
            context.drawImage(img, canvas.width/2 - img.width/2, canvas.height/2 - img.height/2, img.width, img.height);
        }
        context.fillStyle = 'red';
        context.strokeStyle = 'yellow';
        context.font = '900 56px Arial';
        context.fillText('Yours is the maximum score!', 155, 200);
        context.strokeText('Yours is the maximum score!', 155, 200);
    },
    drawLoser: function() {
        context.fillStyle = 'red';
        context.strokeStyle = 'yellow';
        context.font = '900 104px Arial';
        context.fillText('GAME', 430, 480);
        context.strokeText('GAME', 430, 480);
        context.fillText('OVER', 440, 730);
        context.strokeText('OVER', 440, 730);
    }
};