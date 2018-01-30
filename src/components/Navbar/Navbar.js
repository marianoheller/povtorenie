import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';


export default class NavBar extends Component {

    render() {
        return (
        <nav className="navbar" aria-label="main navigation">
            <div className="navbar-brand">
                {/* <a className="navbar-item" href="https://bulma.io">
                    <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
                </a> */}

                <button className="button navbar-burger">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <div className="navbar-menu">
                <div className="navbar-start">
                    <NavLink className="navbar-item" to="/list" >Мой словарь</NavLink>
                    <NavLink className="navbar-item" to="/" >Practice!</NavLink>
                    <NavLink className="navbar-item" to="/search" >Поиск слова</NavLink>
                </div>

                <div className="navbar-end">
                </div>
            </div>
        </nav>
        )
    }
}


