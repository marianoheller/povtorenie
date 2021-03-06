import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from './povtorenie2.png';



export default class NavBar extends Component {


    render() {
        const { displayName } = this.props;

        return (
        <nav className="navbar is-white" aria-label="main navigation">
            <div className="navbar-brand">
                <NavLink className="navbar-item" activeClassName="" to="/" exact>
                    <img src={logo} alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
                </NavLink>
                {/* <a className="navbar-item" href="/">
                    <img src={logo} alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
                </a> */}

                <button className="button navbar-burger" data-target="navMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <div className="navbar-menu" id="navMenu">
                <div className="navbar-start">
                    <NavLink className="navbar-item" activeClassName="is-active" to="/" exact>
                        <i className="fa fa-gavel fa-fw"></i>
                        Practice!
                    </NavLink>
                    <NavLink className="navbar-item" activeClassName="is-active" to="/list" >
                        <i className="fa fa-book fa-fw"></i>
                        Мой словарь
                    </NavLink>
                    <NavLink className="navbar-item" activeClassName="is-active" to="/search" >
                        <i className="fa fa-search fa-fw"></i>
                        Поиск слова
                    </NavLink>
                </div>

                <div className="navbar-end">
                    {   displayName ?
                    <NavLink className="navbar-item" to="/logout" >
                        <i className="fa fa-sign-out fa-fw"></i>
                        {displayName}, logout
                    </NavLink>
                    :
                    <NavLink className="navbar-item" activeClassName="is-active" to="/login" >
                        <i className="fa fa-sign-in fa-fw"></i>
                        Login
                    </NavLink>
                    }
                    
                </div>
            </div>
        </nav>
        )
    }
}


  

