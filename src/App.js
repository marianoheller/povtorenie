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
import Redirect from 'react-router-dom/Redirect';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      profile: {
        isLoading: false,
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
        isDefault: true,
        isLoading: false,
        words: config.DEFAULT_WORD_LIST
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
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAddWord = this.handleAddWord.bind(this);
    this.syncWords = this.syncWords.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentDidMount() {
    this.syncWords();
  }

  resetState(cb) {
    this.setState({
      ...this.state,
      profile: {
        ...this.state.profile,
        isLoading: false,
        displayName: null
      },
      review: {
        ...this.state.review,
        activeWord: null,
        isLoading: false,
        inflectionTable: []
      },
      search: {
        ...this.state.search,
        searchInput: "",
        isLoading: false,
        inflectionTable: []
      },
      list: {
        ...this.state.list,
        isDefault: true,
        isLoading: false,
        words: config.DEFAULT_WORD_LIST
      }
    }, () => {
      if(cb) cb();
    })
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
    axios.get(config.BACKEND_URL + 'auth/profile', {withCredentials: true})
    .then( (results) => {
      this.setState({ list: { ...this.state.list, words: results.data.words, isLoading: false }}, () => {
        this.assignRandomActiveWord();
      });
    })
    .catch((err) => {
      this.setState({ list: { ...this.state.list, isLoading: false }}, () => {
        this.assignRandomActiveWord();
      });
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
    this.setState({
      profile: { ...this.state.profile, isLoading: true }
    })

    axios.post(config.BACKEND_URL + "auth/login", {
      username: username,
      password: password
    },{withCredentials: true})
    .then( (results) => {
      this.setState({
        profile: {
          ...this.state.profile,
          isLoading: false,
          displayName: results.data.displayName
        }
      }, () => {
        this.syncWords();
      })
    })
    .catch( (err) => {
      console.log(err);
      this.setState({
        profile: { ...this.state.profile, isLoading: false }
      })
    })
  }


  handleRegister(username, password, displayName) {
    this.setState({
      profile: { ...this.state.profile, isLoading: true }
    })

    axios.post(config.BACKEND_URL + "auth/register", {
      username: username,
      displayName: displayName || username,
      password: password
    }, {withCredentials: true})
    .then( (results) => {
      this.setState({
        profile: {
          ...this.state.profile,
          displayName: results.data.displayName,
          isLoading: false
        }
      }, () => this.syncWords())
    })
    .catch( (err) => {
      console.log(err);
      this.setState({
        profile: { ...this.state.profile, isLoading: false }
      })
    })
  }

  handleLogout() {
    axios.get(config.BACKEND_URL + "auth/logout", {withCredentials: true})
    .then( (results) => {
      this.resetState( () => {
        this.syncWords();
      } );
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  handleAddWord(word) {
    const { list } = this.state;
    if( list.words.find( (wordElement) => wordElement===word) ) return;
    const newWords = [ ...list.words, word]
    this.setState({ list: {...list, isDefault: false, words: newWords} }, () => this.syncWords() );
  }

  syncWords() {
    //HAY QUE VER EL TEMA SI ES DEFAULT LA LISTA

    axios.post(config.BACKEND_URL + "words/sync", {
      words: this.state.list.words
    }, {withCredentials: true})
    .then( (results) => {
      this.setState({ list: {...this.state.list, isDefault: false, words: results.data.words} }, () => {
        this.assignRandomActiveWord();
      } );
      console.log("Wordlist sync'ed");
    })
    .catch( (err) => {
      console.log("Unable to sync wordlist", err);
      this.assignRandomActiveWord();
    })
  }

  render() {
    const { list, search, review, profile } = this.state;
    return (
      <div className="App">
        <Router basename="/povtorenie">
          <div className="container is-fluid">
            <Navbar {...profile} />

            <div className="columns" id="app-content-container">
              <div className="column is-8 is-offset-2 is-12-mobile">
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
                  <WordList {...list} assignActiveWord={this.assignActiveWord} syncWords={this.syncWords} {...props} /> 
                }/>
                <Route path="/search" render={ (props) => 
                  <SearchWord {...search}  {...props}
                  list={list}
                  saveSearchInput={this.saveSearchInput} 
                  handleAddWord={this.handleAddWord}
                  onSearch={this.getWordData} /> 
                }/>
                <Route path="/login" render={ (props) => 
                  <Login handleLogin={this.handleLogin} handleRegister={this.handleRegister} {...profile} {...props} /> 
                }/>
                <Route path="/logout" render={ (props) => {
                  this.handleLogout();
                  return <Redirect to="/" />
                }
                }/>
              </div>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
