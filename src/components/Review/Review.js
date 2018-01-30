import React, { Component } from 'react';
import WordInfo from '../WordInfo/WordInfo';


export default class Review extends Component {

    render() {
        const { inflectionTable } = this.props;

        return (
            <div id="review-container">
                <WordInfo inflectionTable={inflectionTable} />
            </div>
        )
    }
}