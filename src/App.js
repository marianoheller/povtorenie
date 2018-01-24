import React, { Component } from 'react';
import axios from 'axios';

import config from './config';
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchInput: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearch = debounce( this.handleSearch.bind(this), 750);
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

    axios.post( config.REPEATER_URL, {
      targetURL: config.BASE_URL + searchInput 
    })
    .then( (results) => {
      console.log("RESULTS", results.data );
    })
    .catch( (err) => {
      console.log("ERROR", err);
    })
  }

  render() {
    return (
      <div className="App">
        <input
            name="searchInput"
            type="text"
            value={this.state.searchInput}
            onChange={this.handleInputChange} />
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
