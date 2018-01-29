import React, { Component } from 'react';
import config from '../../config';


export default class Review extends Component {

    render() {
        let { inflectionTable } = this.props;
        if(!inflectionTable) return <div>Error! No inflection table prop</div>;
        if(!inflectionTable.length) return null;
 
        //Transpose array
        inflectionTable = inflectionTable[0].map((row, i) => inflectionTable.map(col => col[i]));

        //Filter out pronunciation stuff
        //ESTO NO TENDRIA Q ESTAR EN EL COMPONENTE DE DISPLAY
        /* inflectionTable = inflectionTable.map( (row) => row.map( (cell) => {
            const words = cell.split(' ');
            if( !/[а-яА-ЯЁё]/.test(words[0]) ) return cell;
            //return words.filter( (word) => /[а-яА-ЯЁё]/.test(word) ).join(" ");
            return words.map( (word) => word.split('').filter( (c) =>  /[а-яА-ЯЁё,-]/.test(c)).join('') ).join(" ")
        })) */


        return (
            <div id="content-display-container">
                <table className="table is-bordered is-narrow is-striped" id="inflection-table">
                    <tbody>
                    { inflectionTable.map( (row, rowNum) => (
                        <tr key={rowNum}>
                            {row.map( (cell, cellNum) => (
                                <td key={cellNum}>
                                    { config.BOLD_KEY_WORDS.some( (keyWord) => cell.indexOf(keyWord) !== -1) ?
                                    <b>{cell}</b>
                                    :
                                    cell
                                    }
                                    
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