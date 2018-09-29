import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {board_width, board_height} from './game';
import {Cell} from './cell';


class Board extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        //console.log(JSON.stringify(this.game.guesses));
        let rows = [];
        for (let r = 0; r < board_height(this.props.game); r++) {
            let columns = [];
            for (let c = 0; c < board_width(this.props.game); c++) {
                //console.log(visible);
                let cell = <Cell cell={this.props.game.cells[r][c]}
                                 clickHandler={this.props.clickHandler}
                                 r={r}
                                 c={c}>
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
