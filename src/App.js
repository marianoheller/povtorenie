import React, { Component } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

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

const DEFAULT_STATE= {
  profile: {
    isLoading: false,
    displayName: null
  },
  review: {
    activeWord: null,
    isLoading: false,
    info: {
      inflectionTable: [],
      translation: null
    }
  },
  search: {
    searchInput: "",
    isLoading: false,
    info: {
      inflectionTable: [],
      translation: null
    }
  },
  list: {
    isDefault: true,
    isLoading: false,
    words: config.DEFAULT_WORD_LIST
  }
}


class App extends Component {

  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;

    this.saveSearchInput = this.saveSearchInput.bind(this);
    this.getFullDataInfo = this.getFullDataInfo.bind(this);
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
    this.setState(DEFAULT_STATE, () => {
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
      this.getFullDataInfo(words[newIndex], 'review')
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

  getFullDataInfo(word, dest) {
    if( !/[а-яА-ЯЁё]/.test(word) ) return;
    this.setState({ [dest]: {...this.state[dest], isLoading: true}})

    Promise.all([ this.getWordTable(word), this.getWordTranslation(word) ])
    .then( ([newInflectionTable, newTranslation]) => {
      console.log("NEW TRANSLLATION", newTranslation);
      this.setState({ [dest]: {
        ...this.state[dest],
        isLoading: false,
        info: {
          ...this.state[dest].info,
          inflectionTable: newInflectionTable || [],
          translation: newTranslation || null
        }
      }});
    })
    .catch( (err) => {
      this.setState({[dest]: {...this.state[dest], isLoading: false}})
      console.log("ERROR", err);
    })
  }

  getWordTranslation(word) {
    return axios.get( config.BACKEND_URL + 'utils/translate?word=' + word)
    .then( (results) => results.data.translation )
    .catch(console.log);
  }

  getWordPronunciation(word) {
    return axios.get( config.BACKEND_URL + 'utils/sound?word=' + word)
    .then( (results) => results.data.sound )
    .catch(console.log);
  }

  getWordTable(word) {
    return axios.get( config.REPEATER_URL + config.BASE_URL + word)
    .then( (results) => scraper(results.data))
    .then( (inflectionTable) => parser(inflectionTable) )
    .catch(console.log) 
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
                <Switch>
                  <Route exact path="/" render={ (props) => 
                    <Review 
                    {...review}
                    {...props}  
                    list={list}
                    getList={this.getList} 
                    getWordData={this.getFullDataInfo} 
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
                    onSearch={this.getFullDataInfo} /> 
                  }/>
                  <Route path="/login" render={ (props) => 
                    <Login handleLogin={this.handleLogin} handleRegister={this.handleRegister} {...profile} {...props} /> 
                  }/>
                  <Route path="/logout" render={ (props) => {
                    this.handleLogout();
                    return <Redirect to="/" />
                  }
                  }/>
                  <Route render={() => <Redirect to="/"/>}/>
                </Switch>
              </div>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
