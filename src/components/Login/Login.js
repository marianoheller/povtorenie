import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Login.css';


export default class Auth extends Component {
    render() {
        const { displayName, isLoading, handleLogin, handleRegister } = this.props;
        if( displayName) return <Redirect to="/" />

        return (
        <div id="auth-container">
            <LoginForm handleLogin={handleLogin} isLoading={isLoading} />
            <RegisterForm handleRegister={handleRegister} isLoading={isLoading}/>
        </div>
        )
    }
}



class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state= {
            username: "",
            password: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state;
        const { handleLogin } = this.props;
        if( !username || !password ) return;
        handleLogin(username, password);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    render() {
        const { username , password } = this.state;
        const { isLoading } = this.props;

        return (
        <div id="login-container">
            <div className="columns">
                <div className="column is-12">
                    <p className="subtitle"><strong>Login</strong></p>
                </div>
            </div>
            <div className="columns">
                <form  className="column is-half is-offset-one-quarter">
                    <div className="field">
                        <p className="control has-icons-left has-icons-right">
                            <input 
                            className="input" 
                            name="username"
                            autoComplete="off"
                            type="text" 
                            value={username}
                            onChange={this.handleInputChange}
                            placeholder="Username" />
                            <span className="icon is-small is-left">
                                <i className="fa fa-user"></i>
                            </span>
                            <span className="icon is-small is-right">
                                <i className="fa fa-check"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control has-icons-left">
                            <input 
                            className="input" 
                            name="password"
                            type="password"
                            value={password}
                            onChange={this.handleInputChange}
                            placeholder="Password" />
                            <span className="icon is-small is-left">
                                <i className="fa fa-lock"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control is-pulled-right">
                            <button 
                            className="button is-success" 
                            disabled={!!isLoading} 
                            onClick={this.handleSubmit.bind(this)}>
                                { isLoading &&
                                <i className="fa fa-spinner fa-pulse"></i>
                                }
                                Login
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
        )
    }
}




class RegisterForm extends Component {
    
    constructor(props) {
        super(props);

        this.state= {
            username: "",
            password: "",
            displayName: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password, displayName } = this.state;
        const { handleRegister } = this.props;
        if( !username || !password ) return;
        handleRegister(username, password, displayName );
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    render() {
        const { displayName, username, password } = this.state;
        const { isLoading } = this.props;

        return (
        <div id="register-container" >
            <div className="columns">
                <div className="column is-12">
                    <p className="subtitle"><strong>Register</strong></p>
                </div>
            </div>
            <div className="columns">
                <form className="column is-half is-offset-one-quarter">
                    <div className="field">
                        <p className="control has-icons-left has-icons-right">
                            <input 
                            className="input" 
                            type="text" 
                            name="displayName"
                            autoComplete="off"
                            value={displayName}
                            onChange={this.handleInputChange}
                            placeholder="Display name (optional)" />
                            <span className="icon is-small is-left">
                                <i className="fa fa-user-secret"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control has-icons-left has-icons-right">
                            <input 
                            className="input" 
                            type="text" 
                            name="username"
                            autoComplete="off"
                            value={username}
                            onChange={this.handleInputChange}
                            placeholder="Username" />
                            <span className="icon is-small is-left">
                                <i className="fa fa-user"></i>
                            </span>
                            <span className="icon is-small is-right">
                                <i className="fa fa-check"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control has-icons-left">
                            <input 
                            className="input" 
                            autoComplete="off"
                            type="password" 
                            name="password"
                            value={password}
                            onChange={this.handleInputChange}
                            placeholder="Password" />
                            <span className="icon is-small is-left">
                                <i className="fa fa-lock"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control is-pulled-right">
                            <button 
                            className="button is-success" 
                            disabled={!!isLoading} 
                            onClick={this.handleSubmit.bind(this)}>
                                { isLoading &&
                                <i className="fa fa-spinner fa-pulse"></i>
                                }
                                Register
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
        )
    }
}