import React, { Component } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import scraper from './modules/scraper';
/* import parser from './modules/parser'; */

import Navbar from './components/Navbar/Navbar';
import Review from './components/Review/Review';
import WordList from './components/WordList/WordList';
import SearchWord from './components/SearchWord/SearchWord';

import config from './config';
import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css'
import './App.css';
import { setTimeout } from 'timers';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      review: {
        activeWord: null,
        inflectionTable: []
      },
      search: {
        searchInput: "",
        isSearching: false,
        inflectionTable: []
      },
      list: {
        isLoading: false,
        words: null
      }
    }

    this.saveSearchInput = this.saveSearchInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    /* this.handleSearch = debounce( this.handleSearch.bind(this), 500); */

    this.getList = this.getList.bind(this);
  }

  componentDidMount() {
    this.getList();
  }

  assignActiveWord() {
    const { list, review } = this.state;
    if(!list.words.length) return  this.setState({review: { ...this.state.review, activeWord: null }});

    let newIndex = Math.floor(Math.random()*list.words.length);
    if( list.words[newIndex]===review.activeWord ) newIndex = (newIndex+1)%list.words.length;

    this.setState({
      review: {
        ...this.state.review,
        activeWord: list.words[newIndex]
      }
    })
  }

  getList() {
    this.setState({ list: { ...this.state.list, isLoading: true }});
    setTimeout( () => {
      this.setState({ list: { ...this.state.list, words: ["работать", "быть"], isLoading: false }});
    }, 2000)
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
    this.setState({search: {...this.state.search, isSearching: true}})

    axios.get( config.REPEATER_URL + config.BASE_URL + searchInput)
    //Get useful data
    .then( (results) => scraper(results.data))
    //Transpose table
    .then( (inflectionTable) => inflectionTable[0].map((row, i) => inflectionTable.map(col => col[i])) )
    //Assign to state
    .then( (newInflectionTable) => {
      this.setState({ search: {
        ...this.state.search,
        isSearching: false,
        inflectionTable: newInflectionTable
      }});
    })
    .catch( (err) => {
      this.setState({search: {...this.state.search, isSearching: false}})
      console.log("ERROR", err);
    })
  }

  render() {
    const { list, search, review } = this.state;
    return (
      <div className="App">
        <Router>
          <div>
            <Navbar />

            <div className="columns">
              <div className="column is-8 is-offset-2">
                <Route exact path="/" render={ (props) => 
                  <Review {...review} getList={this.getList} {...props} /> 
                }/>
                <Route path="/list" render={ (props) => 
                  <WordList {...list} getList={this.getList} {...props} /> 
                }/>
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
