import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {Game, gridHeight, gridWidth} from './game';
import {Board} from './board';

import '../css/app.css';

export default function game_init(root) {
    ReactDOM.render(<Starter />, root);
}

function Restart_button(props) {
    return <div className="restartButton">
             <p><button onClick={props.onClick}>Restart Game</button></p>
           </div>;
}

function Score_display(props) {
    return <div className="scoreDisplay"><h3>{props.score}</h3></div>;
}

class Starter extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.new_game_state();
    }

    new_game_state(_ev) {
        return {game: new Game()};
    }

    restart_game(_ev) {
        this.setState(this.new_game_state());
    }
    
    do_button_click(r, c) {
        console.log([r, c]);
        if (this.state.game.can_guess(r, c)) {
            this.state.game.guess(r, c);
            console.log(this.state);
            this.setState({game: this.state.game});
            console.log(this.state);
            if (this.state.game.has_two_guesses()) {
                let timeout = this.state.game.has_match_on_board() ? 250 : 1000;
                setTimeout(() => {this.state.game.resolve_two_guesses();
                                  this.setState({game: this.state.game});},
                           timeout);
            }
        }
    }

    render() {
        // console.log("rendering");
        return (<div>
                  <Board game={this.state.game}
                         clickHandler={this.do_button_click.bind(this)}>
                  </Board>
                  <Score_display score={this.state.game.clicks}></Score_display>
                  <Restart_button onClick={this.restart_game.bind(this)}></Restart_button>
                </div>);
    }
}


