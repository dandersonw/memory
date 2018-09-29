import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {can_guess, board_width, board_height} from './game';
import {Board} from './board';

import '../css/app.css';

export default function game_init(root, channel) {
    ReactDOM.render(<Memory channel={channel}/>, root);
}

function Restart_button(props) {
    return <div className="restartButton">
             <p><button onClick={props.onClick}>Restart Game</button></p>
           </div>;
}

function Score_display(props) {
    return <div className="scoreDisplay"><h3>{props.score}</h3></div>;
}

class Memory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {"game": {"cells": [[]], clicks: 0, numGuesses: 0}};
        this.props.channel.join()
            .receive("ok", this.new_game_state_callback.bind(this));
    }

    new_game_state_callback(reply) {
        //console.log(reply.game);
        this.setState({game: reply.game});
        if (reply.game.coolingOffPeriod) {
            //console.log(reply.game);
            setTimeout(() => this.props.channel.push("refresh")
                       .receive("ok", this.new_game_state_callback.bind(this)), 2000);
        }
    }

    restart_game(_ev) {
        this.props.channel.push("restart")
            .receive("ok", this.new_game_state_callback.bind(this));
    }
    
    do_button_click(r, c) {
        // console.log([r, c]);
        if (can_guess(this.state.game, r, c)) {
            this.props.channel.push("guess", {r: r, c: c})
                .receive("ok", this.new_game_state_callback.bind(this));
                //.receive("error", console.log("Couldn't guess"));
        }
    }

    render() {
        // console.log("rendering");
        // console.log(this.state.game);
        return (<div>
                  <Board game={this.state.game}
                         clickHandler={this.do_button_click.bind(this)}>
                  </Board>
                  <Score_display score={this.state.game.clicks}></Score_display>
                  <Restart_button onClick={this.restart_game.bind(this)}></Restart_button>
                </div>);
    }
}


