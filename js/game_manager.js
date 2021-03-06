function GameManager(size, InputManager, Actuator) {
    this.size = size; // Size of the grid
    this.inputManager = new InputManager;
    this.actuator = new Actuator;

    this.running = false;

    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));

    this.inputManager.on('think', function () {
        var best = this.ai.getBest();
        this.actuator.showHint(best.move);
    }.bind(this));


    this.inputManager.on('run', function () {
        if (this.running) {
            this.running = false;
            this.actuator.setRunButton('Auto-run');
        }
        else {
            this.running = true;
            this.run()
            this.actuator.setRunButton('Stop');
        }
    }.bind(this));

    this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
    this.actuator.restart();
    this.running = false;
    this.actuator.setRunButton('Auto-run');
    this.setup();
};

// Set up the game
GameManager.prototype.setup = function () {
    this.grid = new Grid(this.size);
    this.grid.addStartTiles();

    this.ai = new AI(this.grid);

    this.score = 0;
    this.over = false;
    this.won = false;

    // Update the actuator
    this.actuate();
};


// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
    this.actuator.actuate(this.grid, {
        score: this.score,
        over: this.over,
        won: this.won
    });
};

// makes a given move and updates state
GameManager.prototype.move = function (direction) {
    var result = this.grid.move(direction);
    this.score += result.score;

    if (!result.won) {
        if (result.moved) {
            this.grid.computerMove();
        }
    }
    else {
        this.won = true;
    }

    //console.log(this.grid.valueSum());

    if (!this.grid.movesAvailable()) {
        this.over = true; // Game over!
    }

    this.actuate();
}

// moves continuously until game is over
/*
GameManager.prototype.run = function() {
  var best = this.ai.getBest();
  this.move(best.move);
  var timeout = animationDelay;
  if (this.running && !this.over && !this.won) {
    var self = this;
    setTimeout(function(){
      self.run();
    }, timeout);
  }
}


GameManager.prototype.run = function () {
    this.keys = [0, 1, 2, 3];
    this.keys.forEach(function (i) {
        setTimeout(function (i) {
            this.move(i);
        }.bind(this, i), 1000);
    }.bind(this));
    var timeout = animationDelay;
    if (this.running && !this.over && !this.won) {
        var self = this;
        setTimeout(function () {
            self.run();
        }, timeout);
    }
}
*/
GameManager.prototype.run = function () {
    //var keys = [0, 1, 2, 3];
    var i = 0;

    var cont = function cont() {
        if (!this.running || this.over || this.won) {
            return;
        }
        setTimeout(this.run.bind(this), 1000);
        var s1 = setTimeout(function(){this.move(0);}.bind(this), 1000);
        var s2 = setTimeout(function(){this.move(1);}.bind(this), 2000);
        var s3 = setTimeout(function(){this.move(2);}.bind(this), 3000);
        var s4 = setTimeout(function(){this.move(3);}.bind(this), 4000);
        clearTimeout(s1);
        clearTimeout(s2);
        clearTimeout(s3);
        clearTimeout(s4);
        /*
        while (i <= 3) {
            console.log(i)
            this.move(i);
            i++;
            if (i == 4){
                i = 0;
                return;
            }
        }
        */
        setTimeout(cont, 1000);
    }.bind(this);

    cont();
}
