import _ from 'lodash';

function can_guess(state, r, c) {
    let guess = [r, c];
    let canGuess = state.numGuesses < 2 && !state.coolingOffPeriod;
    let notAlreadyGuessed = state.cells[r][c] === "?";
    return canGuess && notAlreadyGuessed;
}

function board_height(state) {
    return state.cells.length;
}

function board_width(state) {
    return state.cells[0].length;
}

export {can_guess, board_height, board_width};
