export const Player = class {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.numwin = 0;
  }
  win = () => this.numwin++;
};
