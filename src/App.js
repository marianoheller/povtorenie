import React, { Component } from 'react';
import axios from 'axios';

import scraper from './modules/scraper';
import parser from './modules/parser';

import ContentDisplay from './components/ContentDisplay/ContentDisplay';

import config from './config';
import 'bulma/css/bulma.css'
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      inflectionTable: []
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearch = debounce( this.handleSearch.bind(this), 500);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    this.handleSearch();
  }


  handleSearch() {
    const { searchInput } = this.state;

    if( !/[а-яА-ЯЁё]/.test(searchInput) ) return;

    axios.get( config.REPEATER_URL + config.BASE_URL + searchInput)
    .then( (results) => scraper(results.data))
    .then( (newInflectionTable) => this.setState({ inflectionTable: newInflectionTable}) )
    .catch( (err) => {
      console.log("ERROR", err);
    })
  }

  render() {
    const { inflectionTable } = this.state;
    return (
      <div className="App">
        <input
            name="searchInput"
            type="text"
            value={this.state.searchInput}
            onChange={this.handleInputChange} />
          <ContentDisplay 
          inflectionTable={inflectionTable}
          />
      </div>
    );
  }
}


function debounce(callback, wait, context = this) {
  let timeout = null 
  let callbackArgs = null
  
  const later = () => callback.apply(context, callbackArgs)
  
  return function() {
    callbackArgs = arguments
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default App;
