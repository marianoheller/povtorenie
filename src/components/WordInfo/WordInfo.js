import React, { Component } from 'react';
import config from '../../config';
import './WordInfo.css';


export default class WordInfo extends Component {

    isCellBold(cell) {
        return config.BOLD_KEY_WORDS.some( (keyWord) => cell.indexOf(keyWord) !== -1);
    }

    isRowDark(row) {
        return config.DARK_ROW_KEY_WORDS.some( (keyword) => 
            row.some( (cell) => cell.indexOf(keyword) !== -1 )
        )
    }
    
    render() {
        const { wordInfo, currentSearch } = this.props;
        const { translation, inflectionTable } = wordInfo;
        if(!inflectionTable || !translation) return <div>Error! not enough params</div>;

        return (
        <div id="search-results-container">

            { Boolean(currentSearch) && 
            <div className="columns">
                <div className="column is-12 has-text-centered">
                    <p className="subtitle"><strong>{currentSearch}</strong></p>
                </div>
            </div>
            }

            <div className="columns">
                <div className="column is-12">
                    <p className="subtitle">Meaning: <strong>{translation}</strong></p>
                </div>
            </div>

            <div className="columns">
                <div className="column is-12"  id="table-info-container">
                    <table className="table is-narrow is-fullwidth" id="inflection-table">
                        <tbody>
                        { inflectionTable.map( (row, rowNum) => (
                        <tr key={rowNum} className={`word-info-row ${this.isRowDark(row) ? "word-info-row-dark" : ""}`}>
                            {row.map( (cell, cellNum) => (
                            <td key={cellNum}>
                                { this.isCellBold(cell) ? <b>{cell}</b> : cell }
                            </td>
                            ))}
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        )
    }
}