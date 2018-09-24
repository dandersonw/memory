import React from 'react';
import ReactDOM from 'react-dom';

import '../css/app.css';

class Cell extends React.Component {

    constructor(props) {
        super(props);
    }

    do_click(_ev) {
        if (!this.props.showLetter) {
            this.props.clickHandler(this.props.r, this.props.c);
        }
    }
    

    render() {
        if (this.props.cell != "") {
            let text = this.props.showLetter ? this.props.cell : "?";
            return <button className="activeCell" onClick={this.do_click.bind(this)}>{text}</button>;
        } else {
            return <button className="completedCell"></button>;
        }
    }
    
}

export {Cell};
