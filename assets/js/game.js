import _ from 'lodash';

var gridWidth = 4;
var gridHeight = 4;
var scorePerMatch = 120;
var clickScoreCost = 10;

var GameState = Object.freeze({"none_guessed": 1, "one_guessed": 2, "two_guessed": 3});

export default class Game {

    constructor() {
        let letters = [];
        for (let i = 0; i < gridWidth * gridHeight; i++) {
            letters.push(String.fromCharCode("A".charCodeAt(0) + (i / 2)));
        }
        letters = _.shuffle(letters);
        
        let cells = [];
        for (let r = 0; r < gridHeight; r++) {
            let row = [];
            for (let c = 0; c < gridWidth; c++) {
                row.push(letters[r * gridWidth + c]);
            }
            cells.push(row);
        }
        this.cells = cells;
        this.state = GameState.none_guessed;
        this.guesses = [];
        this.clicks = 0;
        this.score = 0;
    }

    can_guess(r, c) {
        let guess = [r, c];
        let rightMode = this.state === GameState.none_guessed || this.state === GameState.one_guessed;
        let notAlreadyGuessed = !(this.guesses.some(g => g === guess));
        return rightMode && notAlreadyGuessed;
    }

    guess(r, c) {
        if (this.state === GameState.none_guessed) {
            this.state = GameState.one_guessed;
        } else if (this.state === GameState.one_guessed) {
            this.state = GameState.two_guessed;
        }
        this.guesses.push([r, c]);
        this.clicks += 1;
    }

    has_two_guesses() {
        return this.state === GameState.two_guessed;
    }

    has_match_on_board() {
        let a = this.guesses[0];
        let b = this.guesses[1];
        return this.state === GameState.two_guessed
            && this.cells[a[0]][a[1]] === this.cells[b[0]][b[1]];
    }

    resolve_two_guesses() {
        if (this.state === GameState.two_guessed) {
            if (this.has_match_on_board()) {
                for (let guess of this.guesses) {
                    this.cells[guess[0]][guess[1]] = "";
                }
                this.score += Math.max(scorePerMatch - clickScoreCost * this.clicks, 0);
                // this.clicks = 0;
            }
            this.guesses = [];
            this.state = GameState.none_guessed;
        }
    }

}

export {gridWidth, gridHeight, Game, GameState};
