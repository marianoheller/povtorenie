import React, { Component } from 'react';
import config from '../../config';
import './WordInfo.css';


export default class WordInfo extends Component {
    
    render() {
        const { inflectionTable } = this.props;
        if(!inflectionTable) return <div>Error! No inflection table prop</div>;

        return (
        <div id="search-results-container">
            <table className="table is-bordered is-narrow is-striped" id="inflection-table">
                <tbody>
                { inflectionTable.map( (row, rowNum) => (
                <tr key={rowNum}>
                    {row.map( (cell, cellNum) => (
                    <td key={cellNum}>
                        { config.BOLD_KEY_WORDS.some( (keyWord) => cell.indexOf(keyWord) !== -1) ?
                        <b>{cell}</b> : cell }
                        
                    </td>
                    ))}
                </tr>
                ))}
                </tbody>
            </table>
        </div>
        )
    }
}