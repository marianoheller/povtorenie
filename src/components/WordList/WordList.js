import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './WordList.css';

export default class WordList extends Component {

    componentDidMount() {
        const { getList } = this.props;
        getList();
    }

    handleWordClickFactory(word) {
        const { assignActiveWord, history } = this.props;
        return () => {
            assignActiveWord(word);
            history.push('/');
        }
    }

    render() {
        let { words } = this.props;
        const { isLoading } = this.props;

        if(!words) words = [];

        return (
        <div id="word-list-container">
            <table className="table is-narrow is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th className="has-text-centered">
                            Known words ({words.length})
                            { isLoading &&
                            <i className="fa fa-spinner fa-spin" title="Sync in progress"></i>
                            }
                        </th>
                    </tr>
                </thead>
                <tbody>
                    { words.map( (word, i) => (
                        <tr key={`word${i}`} onClick={this.handleWordClickFactory(word)}  className="table-word-row">
                            <td className="word-cell has-text-centered">{word}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div id="add-word-button-container">
                <Link className="button is-info" to="/search">Add a word</Link>
            </div>
        </div>
        )
    }
}
