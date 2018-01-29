import React, { Component } from 'react';
import config from '../../config';
import './SearchWord.css';

export default class SearchWord extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchInput: props.searchInput || ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillUnmount() {
        const { saveSearchInput } = this.props;
        saveSearchInput(this.state.searchInput);
    }

    handleInputChange(event) {
        const value = event.target.value.split("").filter( (c) => /[а-яА-ЯЁё]/.test(c)).join("");
        this.setState({searchInput: value});
    }
    
    handleInputKeyPress(e) {
        if (e.key === 'Enter') this.handleSearch();
    }

    handleSearch() {
        const { searchInput } = this.state;
        const { onSearch } = this.props;
        console.log("SEARCHING: ", searchInput);
        onSearch(searchInput);
    }

    render() {
        const { inflectionTable } = this.props;
        if(!inflectionTable) return <div>Error! No inflection table prop</div>;

        return (
        <div id="search-word-container">
            <div id="search-input-container">
                <div className="field has-addons">
                    <div className="control is-expanded">
                        <input
                        onKeyPress={this.handleInputKeyPress.bind(this)}
                        onChange={this.handleInputChange}
                        value={this.state.searchInput}
                        name="searchInput" 
                        className="input" 
                        type="text" 
                        placeholder="Type a word" />
                    </div>
                    <div className="control" onClick={this.handleSearch.bind(this)}>
                        <a className="button is-info">
                            Search
                        </a>
                    </div>
                </div>
            </div>
            <div id="search-results-container">
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
        </div>
        )
    }
}