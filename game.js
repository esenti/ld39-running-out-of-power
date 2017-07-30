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
      this.load.image('generator', 'assets/sprites/generator.png');
      this.load.image('o2_generator', 'assets/sprites/o2_generator.png');
      this.load.image('battery', 'assets/sprites/battery.png');
      this.load.image('o2', 'assets/sprites/o2.png');
      this.load.image('city', 'assets/sprites/city.png');
      this.load.spritesheet('button', 'assets/spritesheets/button.png', 40, 40);
      this.load.spritesheet('switch', 'assets/spritesheets/switch.png', 50, 100);
      this.load.spritesheet('red_lamp', 'assets/spritesheets/red_lamp.png', 50, 50);
    },

    create: function() {
      this.state.start('eod');
    }
  }

const gameState = {
    create: function() {
      let world = this.world;

      this.g = this.add.graphics(0, 0);
      this.add.sprite(0, 0, 'city');
      this.gameTime = 0;
      this.energy = 0;
      this.oxygen = 50;

      let font = { font: '24px Visitor', fill: '#ffffff' };
      let font2 = { font: '16px Visitor', fill: '#ffffff' };

      this.add.sprite(0, 340, 'generator');

      let generator1_button = this.add.sprite(36, 360, 'switch');
      generator1_button.inputEnabled = true;
      generator1_button.events.onInputDown.add(function(self) {
        if(self.frame == 0) {
          self.frame = 1;
          this.generator1.on = true;
          this.generator1.lamp.frame = 1;
        } else {
          self.frame = 0;
          this.generator1.on = false;
          this.generator1.lamp.frame = 0;
        }
      }, this);

      let g1_lamp = this.add.sprite(80, 386, 'red_lamp');
      let g1_temp = this.add.text(140, 446, 0, font);
      this.generator1 = {
        on: false,
        temp: 20,
        temp_text: g1_temp,
        button: generator1_button,
        lamp: g1_lamp,
      };

      this.add.sprite(340, 340, 'o2_generator');
      this.add.sprite(240, 410, 'o2');

      let o_level = this.add.text(264, 444, 0, font2);

      let oxygen_button = this.add.sprite(376, 360, 'switch');
      oxygen_button.inputEnabled = true;

      oxygen_button.events.onInputDown.add(function(self) {
        if(self.frame == 0) {
          self.frame = 1;
          this.oxygen_generator.on = true;
          this.oxygen_generator.lamp.frame = 1;
        } else {
          self.frame = 0;
          this.oxygen_generator.on = false;
          this.oxygen_generator.lamp.frame = 0;
        }
      }, this);

      let o_lamp = this.add.sprite(420, 386, 'red_lamp');
      let o_temp = this.add.text(480, 446, 0, font);

      this.oxygen_generator = {
        on: false,
        temp: 0,
        button: oxygen_button,
        level_text: o_level,
        temp_text: o_temp,
        lamp: o_lamp,
      };

      this.add.sprite(240, 340, 'battery');

      this.t = this.add.text(264, 374, this.energy, font2);
    },

    update: function() {
      this.gameTime += this.time.elapsed;

      let step = this.gameTime / 1000;
      let steps = 30;

      if(this.generator1.on) {
        this.generator1.temp += this.time.elapsed * 0.01;
        this.energy += this.time.elapsed * 0.01;

        if(this.generator1.temp >= 120) {
          this.generator1.on = false;
          this.generator1.button.frame = 0;
          this.generator1.lamp.frame = 0;
        }
      } else {
        this.generator1.temp = Math.max(this.generator1.temp - this.time.elapsed * 0.01, 20);
      }

      this.generator1.temp_text.text = Math.round(this.generator1.temp) + '°C';

      if(this.oxygen_generator.on) {
        this.oxygen_generator.temp += this.time.elapsed * 0.01;
        this.energy = Math.max(this.energy - this.time.elapsed * 0.007, 0);

        if(this.energy > 0) {
          this.oxygen += this.time.elapsed * 0.0021;
        }

        if(this.oxygen_generator.temp >= 80 || this.energy <= 0) {
          this.oxygen_generator.on = false;
          this.oxygen_generator.button.frame = 0;
          this.oxygen_generator.lamp.frame = 0;
        }
      } else {
        this.oxygen_generator.temp = Math.max(this.oxygen_generator.temp - this.time.elapsed * 0.01, 20);
      }

      this.oxygen_generator.level_text.text = Math.round(this.oxygen) + 'kg';
      this.oxygen_generator.temp_text.text = Math.round(this.oxygen_generator.temp) + '°C';

      this.oxygen = Math.max(this.oxygen - this.time.elapsed * 0.002, 0);

      this.t.text = Math.round(this.energy) + 'kWh';

      if(this.oxygen <= 0) {
        this.state.start('game_over');
      }

      if(step >= steps) {
        this.day += 1;
        this.state.start('eod');
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


      i = Phaser.Color.interpolateColor(colorSteps[s], colorSteps[s + 1], isteps, istep);

      this.g.clear();
      this.g.beginFill(i);
      this.g.drawRect(0, 0, 800, 340);
      this.g.endFill();

      this.g.beginFill(0xffee2d, 0.2 + 0.8 * Math.sin((step / steps) * Math.PI));
      let x = Math.floor((step / steps) * 900 - 50);
      let y = Math.floor(240 - (Math.sin((step / steps) * Math.PI) * 200));

      this.g.drawCircle(x, y, 100);
      this.g.endFill();
    },

    render: function() {
      // let debug = this.game.debug;
      // this.renderLegend();
    },

    shutdown: function() {},

    renderLegend: function() {
      let debug = this.game.debug;
      debug.text(`Phaser ${Phaser.VERSION} ${[null, 'CANVAS', 'WEBGL'][game.renderType]}`, 10, 580, 'white', debug.font);
    }
}

const EODState = {
    create: function() {
      let world = this.world;
      this.day = 1;
      let font = { font: '30px Visitor', fill: '#ffffff', align: 'center' };
      let font2 = { font: '54px Visitor', fill: '#ffffff', align: 'center' };
      let day = this.add.text(this.world.centerX, this.world.centerY - 50, 'Day ' + this.day, font2);
      day.anchor.setTo(0.5);
      let text = this.add.text(this.world.centerX, this.world.centerY, 'Start', font);
      text.anchor.setTo(0.5);
      text.inputEnabled = true;
      text.events.onInputDown.add(function() { this.state.start('game') }, this);
    },
}

const gameoverState = {

    create: function() {
      let font = { font: '64px Visitor', fill: '#ffffff', align: 'center' };
      let text = this.add.text(this.world.centerX, this.world.centerY, 'Game over', font);
      text.anchor.setTo(0.5);
    }
}

game.state.add('load', loadState);
game.state.add('game', gameState);
game.state.add('eod', EODState);
game.state.add('game_over', gameoverState);

game.state.start('load');
