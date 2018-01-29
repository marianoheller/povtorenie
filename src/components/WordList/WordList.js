import React, { Component } from 'react';
import { Link } from 'react-router-dom'


export default class WordList extends Component {

    render() {
        const { words } = this.props;
        return (
        <div id="word-list-container">
            <table className="table is-narrow is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th className="has-text-centered">Known words</th>
                    </tr>
                </thead>
                <tbody>
                    { words.length ?
                        words.map( (word, i) => (
                            <tr key={`word${i}`}>
                                <td className="has-text-centered">{word}</td>
                            </tr>
                        ))
                    :
                        <Link className="button is-info" to="/search">Add a word</Link>
                    }
                </tbody>
            </table>
        </div>
        )
    }
}