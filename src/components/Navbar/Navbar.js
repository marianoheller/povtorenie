import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


export default class NavBar extends Component {

    render() {
        return (
        <nav className="navbar" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="https://bulma.io">
                    <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
                </a>

                <button className="button navbar-burger">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <div className="navbar-menu">
                <div className="navbar-start">
                    <NavLink className="navbar-item" to="/list" >My list</NavLink>
                    <NavLink className="navbar-item" to="/" >Review!</NavLink>
                    <NavLink className="navbar-item" to="/search" >Search word</NavLink>
                </div>

                <div className="navbar-end">
                </div>
            </div>
        </nav>
        )
    }
}


