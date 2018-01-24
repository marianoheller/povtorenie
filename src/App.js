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
    axios.get(searchInput, {
      baseURL: config.BASE_URL,
      crossdomain: true,
    })
    .then( (results) => {
      console.log("RESULTS", results );
    })
    .catch( (err) => {
      console.log(err);
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
