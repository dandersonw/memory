import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {Game, gridHeight, gridWidth} from './game';
import {Cell} from './cell';


class Board extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        //console.log(JSON.stringify(this.game.guesses));
        let rows = [];
        for (let r = 0; r < gridHeight; r++) {
            let columns = [];
            for (let c = 0; c < gridWidth; c++) {
                let visible = this.props.game.guesses.some((o) => o[0] == r && o[1] == c);
                //console.log(visible);
                let cell = <Cell cell={this.props.game.cells[r][c]}
                                 clickHandler={this.props.clickHandler}
                                 r={r}
                                 c={c}
                                 showLetter={visible}>
                           </Cell>;
                columns.push(<td key={c}>{cell}</td>);
            }
            rows.push(<tr key={r}>{columns}</tr>);
        }

        let table = <table><tbody>{rows}</tbody></table>;
        return table;
    }
}

export {Board};
