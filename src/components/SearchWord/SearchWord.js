import React, { Component } from 'react';
import WordInfo from '../WordInfo/WordInfo';
import './SearchWord.css';

export default class SearchWord extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchInput: props.searchInput || ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
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
        const { onSearch, saveSearchInput } = this.props;
        onSearch(searchInput, 'search');
        saveSearchInput(searchInput);
    }

    handleAddWord() {
        const { handleAddWord, searchInput } = this.props;
        handleAddWord(searchInput);
    }

    render() {
        const { inflectionTable, isLoading, searchInput: currentSearch, list } = this.props;
        const { searchInput } = this.state;

        return (
        <div id="search-word-container">
            <SearchInput 
            isLoading={isLoading}
            inputValue={searchInput}
            inputHandlers={{
                handleInputKeyPress: this.handleInputKeyPress,
                handleInputChange: this.handleInputChange,
                handleSearch: this.handleSearch
            }} />
            <AddButton 
            handleAddWord={this.handleAddWord.bind(this)}
            isLoading={isLoading}
            isAlreadyListed={!!list.words.find( (word) => word===currentSearch )}
            showing={!!inflectionTable.length}/>
            <WordInfo currentSearch={currentSearch} inflectionTable={inflectionTable} />
        </div>
        )
    }
}

class AddButton extends Component {
    render() {
        const { showing, handleAddWord, isLoading, isAlreadyListed } = this.props;
        if(!showing) return null;

        return (
            <div id="add-button-container" className="columns">
                <div className="column is-half is-offset-one-quarter has-text-centered">
                    <button 
                    disabled={isLoading || isAlreadyListed}
                    className="button is-success" 
                    title={ isAlreadyListed ? "Word already exists in list": "Add word"}
                    onClick={handleAddWord}
                    >Add this word</button>
                </div>
            </div>
        )
    }
}

class SearchInput extends Component {

    componentDidMount(){
        this.searchInput.focus();
    }

    render() {
        const { inputHandlers, isLoading, inputValue } = this.props;

        return (
            <div id="search-input-container">
                <div className="field has-addons">
                    <div className="control has-icons-left is-expanded">
                        <input
                        onKeyPress={inputHandlers.handleInputKeyPress}
                        onChange={inputHandlers.handleInputChange}
                        value={inputValue}
                        disabled={!!isLoading}
                        ref={(input) => { this.searchInput = input; }} 
                        name="searchInput" 
                        className="input is-hovered" 
                        type="text" 
                        placeholder="Type a word" />
                        <span className="icon is-small is-left">
                            <i className={`fa fa-${ isLoading ? 'spinner fa-pulse' : 'search'}`}></i>
                        </span>
                    </div>
                    <div className="control" onClick={inputHandlers.handleSearch}>
                        <a className="button is-info" disabled={!!isLoading}>
                            Поиск
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}
