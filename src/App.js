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
import Login from './components/Login/Login';

import config from './config';
import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css'
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      profile: {
        displayName: null
      },
      review: {
        activeWord: null,
        isLoading: false,
        inflectionTable: []
      },
      search: {
        searchInput: "",
        isLoading: false,
        inflectionTable: []
      },
      list: {
        isLoading: false,
        words: null
      }
    }

    this.saveSearchInput = this.saveSearchInput.bind(this);
    this.getWordData = this.getWordData.bind(this);
    /* this.handleSearch = debounce( this.handleSearch.bind(this), 500); */
    this.getList = this.getList.bind(this);
    this.assignActiveWord = this.assignActiveWord.bind(this);
    this.assignRandomActiveWord = this.assignRandomActiveWord.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    this.getList();
  }

  assignActiveWord(word) {
    this.setState({
      review: {
        ...this.state.review,
        activeWord: word
      }
    })
  }

  assignRandomActiveWord() {
    const { review, list } = this.state;
    const { words } = list;
    if(!words.length) return  this.setState({review: { ...this.state.review, activeWord: null }});

    let newIndex = Math.floor(Math.random()*words.length);
    if( words[newIndex]===review.activeWord ) newIndex = (newIndex+1)%words.length;

    this.setState({
      review: {
        ...this.state.review,
        activeWord: words[newIndex]
      }
    }, () => {
      this.getWordData(words[newIndex], 'review')
    } );
    
  }

  getList() {
    //const newWords = ["работать", "быть", "бежать"];

    this.setState({ list: { ...this.state.list, isLoading: true }});
    axios.get(config.BACKEND_URL + 'auth/profile')
    .then( (results) => {
      this.setState({ list: { ...this.state.list, words: results.data.words, isLoading: false }}, () => {
        this.assignRandomActiveWord();
      });
    })
    .catch((err) => {
      this.setState({ list: { ...this.state.list, isLoading: false }});
      console.log(err);
    })
  }

  saveSearchInput(searchInput) {
    this.setState({
      search: {
        ...this.state.search,
        searchInput: searchInput
      }
    })
  }

  getWordData(word, dest) {
    if( !/[а-яА-ЯЁё]/.test(word) ) return;
    this.setState({ [dest]: {...this.state[dest], isLoading: true}})

    axios.get( config.REPEATER_URL + config.BASE_URL + word)
    //Get useful data
    .then( (results) => scraper(results.data))
    //Transpose table
    .then( (inflectionTable) => parser(inflectionTable) )
    //Assign to state
    .then( (newInflectionTable) => {
      this.setState({ [dest]: {
        ...this.state[dest],
        isLoading: false,
        inflectionTable: newInflectionTable
      }});
    })
    .catch( (err) => {
      this.setState({[dest]: {...this.state[dest], isLoading: false}})
      console.log("ERROR", err);
    })
  }

  handleLogin(username, password) {
    axios.post(config.BACKEND_URL + "auth/login", {
      username: username,
      password: password
    })
    .then( (results) => {
      this.setState({
        profile: {
          ...this.state.profile,
          displayName: results.data.displayName
        }
      })
    })
    .catch( (err) => {
      console.log(err);
    })
  }


  handleRegister(username, password, displayName) {
    axios.post(config.BACKEND_URL + "auth/register", {
      username: username,
      displayName: displayName || username,
      password: password
    })
    .then( (results) => {
      this.setState({
        profile: {
          ...this.state.profile,
          displayName: results.data.displayName
        }
      })
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  render() {
    const { list, search, review, profile } = this.state;
    return (
      <div className="App">
        <Router>
          <div>
            <Navbar {...profile} />

            <div className="columns">
              <div className="column is-8 is-offset-2">
                <Route exact path="/" render={ (props) => 
                  <Review 
                  {...review}
                  {...props}  
                  list={list}
                  getList={this.getList} 
                  getWordData={this.getWordData} 
                  assignRandomActiveWord={this.assignRandomActiveWord}
                  /> 
                }/>
                <Route path="/list" render={ (props) => 
                  <WordList {...list} assignActiveWord={this.assignActiveWord} getList={this.getList} {...props} /> 
                }/>
                <Route path="/search" render={ (props) => 
                  <SearchWord {...search} saveSearchInput={this.saveSearchInput} onSearch={this.getWordData} {...props} /> 
                }/>
                <Route path="/login" render={ (props) => 
                  <Login handleLogin={this.handleLogin} handleRegister={this.handleRegister} {...profile} {...props} /> 
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
