Otherwise, check if player is on Level 4, during which he is floating in the water.
else if (this.level == 4) {
    if ((this.up === true) && (555 > (555 - 50))) {
        // Player experiences upward movement of bounce.
        this.y -= 10 * dt; //-10 until 505
    } else if (555 <= (555 - 50)) { //505 = 505
        // Player begins to experience downward movement of bounce.
        this.y += 10 * dt; //+10 until 555
        this.up = false;               //higher thna 505     //less than 555
    } else if ((this.up === false) && (555 > (555 - 50)) && (555 < 555)) {
        // Player continues to experience downward movement of bounce.
        this.y += 10 * dt;
    } else if (555 >= 555) {
        Player begins to experience upward movement of bounce.
        this.y -= 10 * dt;
        this.up = true;
    }
}


Player.prototype.halfRender = function() {
    var sprite = Resources.get(this.sprite);
    var face = level === 1 ? 50 : 80; // The render position varies by level
    switch (level) {
        //This switch provides the render method based on level
        case 1:
            if(!win && this.row === 0) {
                ctx.drawImage(Resources.get(this.sprite), 0, face, sprite.width, 60, this.x, this.y + face, sprite.width, 60);
            }
            break;
        case 2:
            if (!win && this.row > 0 && this.row < 5) {
                ctx.drawImage(Resources.get(this.sprite), 0, 50, sprite.width, 60, this.x, this.y + face, 101, 60);
            }
            break;
    }


    ctx.drawImage(Resources.get(this.sprite), 0, 50, this.sprite.width, 60, this.x, this.y + this.face, 101, 60);
}
void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);



Nonplayer.prototype.render = function() {
    //If being rescued, the NPC is rendered as "carried" by player
    if (this.rescued) {
        ctx.drawImage(Resources.get(this.sprite), 0, 0, 101, 171, player.x, player.y + 20, 50, 85);
    }
    else {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};


jump() {
  if ((this.up === true) && (this.y > (this.originalY - 34))) {
    this.y -= 2 * dt; // Keep going up
  } else if (this.y == (this.originalY - 34)) {
    this.y += 3 * dt; // Start going down
    this.up = false;
  } else if ((this.up === false) && (this.y > (this.originalY - 34)) && (this.y < this.originalY)) {
    this.y += 3 * dt; // Keep going down
  } else if (this.y == this.originalY) {
    this.y -= 3 * dt; // Start going up
    this.up = true; // Set to true after finishing downward movement
  }
}
