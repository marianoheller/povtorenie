import React, { Component } from 'react';
import WordInfo from '../WordInfo/WordInfo';
import './Review.css';


export default class Review extends Component {

    componentDidMount() {
        const { activeWord, getWordData } = this.props;
        if(!activeWord) return;
        getWordData(activeWord, 'review');
    }

    handleGetWordClick() {
        const { assignRandomActiveWord } = this.props;
        assignRandomActiveWord();
    }

    render() {
        const { inflectionTable, activeWord, isLoading, list } = this.props;

        return (
            <div id="review-container">
                <div>
                    <button 
                    className="button is-info is-medium" 
                    onClick={this.handleGetWordClick.bind(this)}
                    disabled={!activeWord}>
                        Get new word!
                    </button>
                </div>
                <div id="review-active-word">
                    <p>Current word:{" "} 
                        <strong>{ activeWord }</strong>
                        { (!activeWord && !list.isLoading) ||
                        <i className="fa fa-spinner fa-pulse fa-fw"></i>
                        }
                        
                    </p>
                </div>
                <ReviewStatusInformer 
                isLoading={isLoading}
                listIsLoading={list.isLoading}
                cantWords={list.words ? list.words.length : 0} />
                <WordInfo inflectionTable={inflectionTable} />
            </div>
        )
    }
}


class ReviewStatusInformer extends Component {

    render() {
        const { isLoading, cantWords, listIsLoading } = this.props;

        if(isLoading) return (
            <div id="review-status-container">
                <div id="review-loading-word-data">
                    <div>
                        <i className="fa fa-spinner fa-pulse fa-fw"></i>
                        <em>{' '}Loading word data</em>
                    </div>
                    <span className="sr-only">Retrieving word data</span>
                </div>
            </div>
        )
        else if( !cantWords && !listIsLoading ) return (
            <div id="review-status-container">
                <div id="review-no-words">
                    <p><em>No words in your list</em></p>
                    <i className="fa fa-exclamation-triangle fa-3x fa-fw"></i>
                    <span className="sr-only">Empty word list</span>
                </div>
            </div>
        )
        return null;
    }
}