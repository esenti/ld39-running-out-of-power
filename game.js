console.clear();

const game = new Phaser.Game({
  // antialias:   true,
  // enableDebug: true,
  // height:      600,
  // renderer:    Phaser.AUTO,
  // resolution:  1,
  // scaleMode:   Phaser.ScaleManager.NO_SCALE,
  // transparent: false,
  // width:       800,
});

const loadState = {
    init: function() {},

    preload: function() {
      this.load.image('test', 'assets/sprites/test.png');
    },

    create: function() {
      this.state.start('game');
    }
  }

const gameState = {
    create: function() {
      let world = this.world;
      let sprite = this.add.sprite(world.centerX, world.centerY, 'test');
      sprite.inputEnabled = true;
      sprite.events.onInputDown.add(function() { console.log('fafa'); }, this);

      this.g = this.add.graphics(0, 0);
      this.gameTime = 0;
    },

    update: function() {
      this.gameTime += this.time.elapsed;

      let step = this.gameTime / 1000;
      let steps = 30;

      if(step >= steps) {
        this.state.start('game');
      }

      let colorSteps = [
        0x000000,
        0x24859d,
        0x0000ff,
        0x76115f,
        0x000000,
      ];

      s = Math.floor((step / steps) * (colorSteps.length - 1));
      console.log(s);

      isteps = steps / (colorSteps.length - 1);
      istep =  step % isteps;

      // console.log(istep, isteps);

      i = Phaser.Color.interpolateColor(colorSteps[s], colorSteps[s + 1], isteps, istep);
      // console.log(Phaser.Color.valueToColor(i));

      this.g.clear();
      this.g.beginFill(i);
      this.g.drawRect(0, 0, 800, 300);
      this.g.endFill();

      this.g.beginFill(0xffee2d, 0.2 + 0.8 * Math.sin((step / steps) * Math.PI));
      // console.log(step / steps);
      let x = Math.floor((step / steps) * 900 - 50);
      let y = Math.floor(200 - (Math.sin((step / steps) * Math.PI) * 160));
      console.log(x,y);
      this.g.drawCircle(x, y, 100);
      this.g.endFill();
    },

    render: function() {
      // let debug = this.game.debug;
      this.renderLegend();
    },

    shutdown: function() {},

    renderLegend: function() {
      let debug = this.game.debug;
      debug.text(`Phaser ${Phaser.VERSION} ${[null, 'CANVAS', 'WEBGL'][game.renderType]}`, 10, 580, 'white', debug.font);
    }
}

game.state.add('load', loadState);
game.state.add('game', gameState);

game.state.start('load');
