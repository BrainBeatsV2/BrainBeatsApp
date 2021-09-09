import React,{ Component, useState } from 'react';
import axios from 'axios';

class Login extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		showLogin: true,
		showRegister: false,
		showResetPassword: false,
		showVerify: false,
		username: '',
		password: ''
	  };
	  this.onShowRegister = this.onShowRegister.bind(this);
	  this.onShowLogin = this.onShowLogin.bind(this);
	  this.onShowResetPassword = this.onShowResetPassword.bind(this);
	}
	onShowRegister() {
		this.setState({
			showRegister: true,
			showLogin:false,
			showResetPassword:false,
			showVerify: false,
			username: '',
			password: ''
		  });
	  }
	  onShowLogin() {
		this.setState({
			showRegister: false,
			showLogin:true,
			showResetPassword:false,
			showVerify: false,
			username: '',
			password: ''
		  });
	  }
	  onShowResetPassword() {
		this.setState({
			showRegister: false,
			showLogin:false,
			showResetPassword:true,
			showVerify: false,
			username: '',
			password: ''
		  });
	  }

		handleUsername = event => {
			this.setState({username: event.target.value});
		}

		handlePassword = event => {
			this.setState({password: event.target.value});
		}

		handleLogin = event =>{
			event.preventDefault();

			const options = {
				headers: {
					'Content-type': 'application/json; charset=utf-8'
				}
			}

			let res = await axios.post('http://brainbeats.dev/api/login', options, {

		    username: this.state.username,
		    password: this.state.password
		  });
		}


	render() {
	  return (
		<div class="container-login100">
			<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
				 <div class="wrap-login100">


					 <div id="banner" class="alert m-b-38" role="alert"></div>
					 <form id="loginform" action="" method="post" class="login100-form validate-form" style={{display: this.state.showLogin ? 'block' : 'none' }} onSubmit={this.handleLogin}>
						 <div class="wrap-input100 validate-input" >
							 <input class="input100" type="text" name="USERNAME" onChange={this.handleUsername}/>
							 <span class="focus-input100" data-placeholder="Username or Email"></span>
						 </div>

						 <div class="wrap-input100 validate-input">
							 <span class="btn-show-pass">
								 <i class="material-icons">remove_red_eye</i>
							 </span>
							 <input class="input100" type="password" name="PASSWORD" onChange={this.handlePassword}/>
							 <span class="focus-input100" data-placeholder="Password"></span>
						 </div>
						 <input type="hidden" name="ACTION" value="LOGIN" />
						 <div class="container-login100-form-btn">
							 <div class="wrap-login100-form-btn">
								 <div class="login100-form-bgbtn"></div>
								 <button id="loginbtn" class="login100-form-btn">
								 Login
								 </button>
							 </div>
						 </div>
						 <div class="text-center p-t-5" >
							 <a class="txt2" onClick={this.onShowResetPassword}> Forgot Your Password?</a>


						 </div>

						 <div class="text-center p-t-55">
							 <span class="txt1" >
								 Don't have an account?
							 </span>
							 <a class="txt2 backtologin" href="#" onClick={this.onShowRegister}>
								 Sign Up
							 </a>
						 </div>

					 </form>

					 <form id="registerform" action="" method="post" class="login100-form validate-form" style={{display: this.state.showRegister ? 'block' : 'none' }}>
						 <div class="wrap-input100 validate-input">
							 <input class="input100" type="text" name="EMAIL" />
							 <span class="focus-input100" data-placeholder="Email"></span>
						 </div>
						 <div class="wrap-input100 validate-input">
							 <input class="input100" type="text" name="USERNAME" />
							 <span class="focus-input100" data-placeholder="Username"></span>
						 </div>
						 <div class="wrap-input100 validate-input">
							 <span class="btn-show-pass">
								 <i class="material-icons">remove_red_eye</i>
							 </span>
							 <input class="input100" type="password" name="PASSWORD" />
							 <span class="focus-input100" data-placeholder="Password"></span>
						 </div>
						 <div class="wrap-input100 validate-input">
							 <span class="btn-show-pass">
								 <i class="material-icons">remove_red_eye</i>
							 </span>
							 <input class="input100" type="password" name="CONFIRM" />
							 <span class="focus-input100" data-placeholder="Confirm Password"></span>
						 </div>
						 <input type="hidden" name="ACTION" value="REGISTER" />
						 <div class="container-login100-form-btn">
							 <div class="wrap-login100-form-btn">
								 <div class="login100-form-bgbtn"></div>
								 <button id="createbtn" class="login100-form-btn">
									 Register
								 </button>
							 </div>
						 </div>

						 <div class="text-center p-t-95">
							 <span class="txt1">
								 Already have an account?
							 </span>

							 <a class="txt2 backtologin" href="#" onClick={this.onShowLogin}>
								 Login
							 </a>
						 </div>
					 </form>

					 <form id="resetform" action="" method="post" class="login100-form validate-form" style={{display: this.state.showResetPassword ? 'block' : 'none' }}>
						 <div class="wrap-input100 validate-input">
							 <input class="input100" type="text" name="USERNAME" />
							 <span class="focus-input100" data-placeholder="Enter Username or Email"></span>
						 </div>
						 <input type="hidden" name="ACTION" value="RESET" />
						 <div class="container-login100-form-btn">
							 <div class="wrap-login100-form-btn">
								 <div class="login100-form-bgbtn"></div>
								 <button id="resetbtn" class="login100-form-btn">
									 Send Reset Code
								 </button>
							 </div>
						 </div>

						 <div class="text-center p-t-95">
							 <span class="txt1" >
								 Already have an account?
							 </span>

							 <a class="txt2 backtologin" href="#" onClick={this.onShowLogin}>
								 Login
							 </a>
						 </div>
					 </form>

					 <form id="verifyform" action="" method="post" class="login100-form validate-form" style={{display: this.state.showVerify ? 'block' : 'none' }}>
						 <p>Verify Account</p>
						 <br />
						 <div class="wrap-input100 validate-input">
							 <input class="input100 code" type="text" name="CODE" />
							 <span class="focus-input100" data-placeholder="Enter Code"></span>
						 </div>
						 <input id="userSID" class="input100" type="hidden" name="SID" />
						 <input type="hidden" name="ACTION" value="VERIFY" />
						 <div class="container-login100-form-btn">
							 <div class="wrap-login100-form-btn">
								 <div class="login100-form-bgbtn"></div>
								 <button id="verifycodebtn" class="login100-form-btn">
									 Verify
								 </button>
							 </div>
						 </div>
					 </form>
				 </div>
			 </div>
				);
	}
  }
export default Login

