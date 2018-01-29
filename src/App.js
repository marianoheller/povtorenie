import React, { Component } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import scraper from './modules/scraper';
import parser from './modules/parser';

import Navbar from './components/Navbar/Navbar';
import Review from './components/Review/Review';
import WordList from './components/WordList/WordList';
import SearchWord from './components/SearchWord/SearchWord';

import config from './config';
import 'bulma/css/bulma.css'
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      review: {
        activeWord: "",
        inflectionTable: []
      },
      search: {
        searchInput: "",
        inflectionTable: []
      },
      list: {
        words: [
          "работать", "быть"
        ]
      }
    }

    this.saveSearchInput = this.saveSearchInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    /* this.handleSearch = debounce( this.handleSearch.bind(this), 500); */
  }

  saveSearchInput(searchInput) {
    this.setState({
      search: {
        ...this.state.search,
        searchInput: searchInput
      }
    })
  }

  handleSearch(searchInput) {

    if( !/[а-яА-ЯЁё]/.test(searchInput) ) return;

    axios.get( config.REPEATER_URL + config.BASE_URL + searchInput)
    //Get useful data
    .then( (results) => scraper(results.data))
    //Transpose table
    .then( (inflectionTable) => inflectionTable[0].map((row, i) => inflectionTable.map(col => col[i])) )
    //Assign to state
    .then( (newInflectionTable) => this.setState({ search: {
      ...this.state.search,
      inflectionTable: newInflectionTable
    }}) )
    .catch( (err) => {
      console.log("ERROR", err);
    })
  }

  render() {
    const { list, search } = this.state;
    return (
      <div className="App">
        <Router>
          <div>
            <Navbar />

            <div className="columns">
              <div className="column is-8 is-offset-2">
                <Route exact path="/" component={Review}/>
                <Route path="/list" render={ (props) => <WordList {...list} {...props} /> }/>
                <Route path="/search" render={ (props) => 
                  <SearchWord {...search} saveSearchInput={this.saveSearchInput} onSearch={this.handleSearch} {...props} /> 
                }/>
              </div>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

/* 

function debounce(callback, wait, context = this) {
  let timeout = null 
  let callbackArgs = null
  
  const later = () => callback.apply(context, callbackArgs)
  
  return function() {
    callbackArgs = arguments
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
} */

export default App;
