import React, { Component, useState } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import logo from '../images/logo_dev.png';
import isElectron from '../library/isElectron';
import Sidebar from '../components/Sidebar/index'
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLogin: true,
			showRegister: false,
			showResetPassword: false,
			showVerify: false,
			username: '',
			password: '',
			email: '',
			requestEmail: '',
			resetCode: '',
			newPassword: '',
			confirmedPassword: '',
			redirect: null,
		};
		this.onShowRegister = this.onShowRegister.bind(this);
		this.onShowLogin = this.onShowLogin.bind(this);
		this.onShowResetPassword = this.onShowResetPassword.bind(this);
		this.onShowVerify = this.onShowVerify.bind(this);

	}
	onShowRegister() {
		this.setState({
			showRegister: true,
			showLogin: false,
			showResetPassword: false,
			showVerify: false,
			redirect: null,
		});
	}
	onShowLogin() {
		this.setState({
			showRegister: false,
			showLogin: true,
			showResetPassword: false,
			showVerify: false,
			redirect: null,
		});
	}
	onShowResetPassword() {
		this.setState({
			showRegister: false,
			showLogin: false,
			showResetPassword: true,
			showVerify: false,
			redirect: null,
		});
	}

	handleUsername = (e) => {
		this.setState({ username: e.target.value });
	};

	handlePassword = (e) => {
		this.setState({ password: e.target.value });
	};

	handleEmail = (e) => {
		this.setState({ email: e.target.value });
	};

	handleRequestEmail = (e) => {
		this.setState({ requestEmail: e.target.value });
	}

	handleResetCode = (e) => {
		this.setState({ resetCode: e.target.value });
	}

	handleNewPassword = (e) => {
		this.setState({ newPassword: e.target.value });
	}

	handleConfirmedPassword = (e) => {
		this.setState({ confirmedPassword: e.target.value });
	}

	handleRequestReset = (e) => {
		e.preventDefault();

		const options = {
			headers: {
				'Content-type': 'application/json; charset=utf-8'
			}
		};

		const userObject = {
			email: this.state.requestEmail
		};

		axios.post('/api/requestreset', userObject, options)
			.then((res) => {
				console.log(res.data)
			}).catch((error) => {
				console.log(error)
			});
	}

	handleResetPassword = (e) => {
		e.preventDefault();

		const options = {
			headers: {
				'Content-type': 'application/json; charset=utf-8'
			}
		};

		const userObject = {
			email: this.state.requestEmail,
			token: this.state.resetCode,
			new_password: this.state.newPassword
		};

		axios.post('/api/resetpassword', userObject, options)
			.then((res) => {
				console.log(res.data)
			}).catch((error) => {
				console.log(error)
			});
	}

	handleLogin = (e) => {
		e.preventDefault();

		const options = {
			headers: {
				'Content-type': 'application/json; charset=utf-8'
			}
		};

		const userObject = {
			username: this.state.username,
			password: this.state.password
		};
		console.log(this.state.username);
		console.log(this.state.password);

		axios.post('/api/login', userObject, options)
			.then((res) => {
				if (res.data === "login successful" || 200) {

					axios.post('/api/user', userObject, options)
						.then((res) => {
							this.setState({
								username: res.data[0],
								email: res.data[1],
								password: res.data[2]
							});
							localStorage.setItem('loggedIn', true);
							localStorage.setItem('email', this.state.email);
							localStorage.setItem('username', this.state.username);
							localStorage.setItem('password', this.state.password);
							console.log(this.state.username);
							console.log(this.state.email);
							console.log(this.state.password);
							this.setState({ redirect: "/dashboard" });
						}).catch((error) => {
							console.log(error)
							this.setState({
								username: "",
								email: "",
								password: ""
							});
						});
				}
			}).catch((error) => {
				console.log(error)
				this.state.username = "";
				this.state.password = "";
			});
	}

	handleRegister = (e) => {
		e.preventDefault();

		const options = {
			headers: {
				'Content-type': 'application/json; charset=utf-8'
			}
		};

		const userObject = {
			username: this.state.username,
			password: this.state.password,
			email: this.state.email
		};

		axios.post('/api/register', userObject, options)
			.then((res) => {
				//console.log(res.data)
				if (res.data === "Successful Register" || 200) {
					console.log(this.state.username);

					axios.post('/api/user', userObject, options)
						.then((res) => {
							this.setState({
								username: res.data[0],
								email: res.data[1],
								password: res.data[2]
							});
							localStorage.setItem('loggedIn', true);
							localStorage.setItem('email', this.state.email);
							localStorage.setItem('username', this.state.username);
							localStorage.setItem('password', this.state.password);
							console.log(this.state.username);
							console.log(this.state.email);
							console.log(this.state.password);
							this.setState({ redirect: "/dashboard" });
						}).catch((error) => {
							console.log(error)
							this.setState({
								username: "",
								email: "",
								password: ""
							});
						});
				}
				
			}).catch((error) => {
				console.log(error)
			});

		//this.onShowResetPassword();
	}

	// 	showVerify: false

	onShowVerify() {
		this.setState({
			showRegister: false,
			showLogin: false,
			showResetPassword: false,
			showVerify: true

		});
	}
	render() {
		try {
			if(localStorage.getItem('username') !== null) {
				this.setState({
				username: localStorage.getItem('username'),
				email: localStorage.getItem('email'),
				password: localStorage.getItem('password'),
				})
			}
		  } catch (e) {
			
		  }
		if (this.state.redirect) {
			return <Redirect to={{
			  pathname: this.state.redirect,
			  state: {
				username: this.state.username,
				email: this.state.email,
				password: this.state.password 
			  }
			}}
		  />
		  }
		return (
			<div >
				<Sidebar 
					active="login" 
					is_shown="true" 
					logged_in={false}
					username={this.state.username}
					email={this.state.email}
					password={this.state.password}
				></Sidebar>


				<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
				<div id="main_content" >
				<div class="wrap-login100" style={{margin: '0 auto'}}>
					<img style={{ height: '150px', margin: '0 auto', display: isElectron() ? 'block' : 'none' }} src={logo} alt='logo' />
					<div id="banner" class="alert m-b-38" role="alert"></div>
					<form id="loginform" action="" method="post" class="login100-form validate-form" style={{ display: this.state.showLogin ? 'block' : 'none' }} onSubmit={this.handleLogin}>
						<div class="wrap-input100 validate-input" >
							<input class="input100" placeholder="Username or Email" type="text" name="USERNAME" value={this.state.username} onChange={this.handleUsername} required />

						</div>

						<div class="wrap-input100 validate-input">
							<input class="input100" placeholder="Password" type="password" name="PASSWORD" value={this.state.password} onChange={this.handlePassword} required />

						</div >
						<input type="hidden" name="ACTION" value="LOGIN" />
						<div class="container-login100-form-btn">
							<div class="wrap-login100-form-btn">
								<div class="login100-form-bgbtn"></div>
								<button type="submit" id="loginbtn" class="login100-form-btn">
									Login
								</button>
							</div>
						</div>
						<div class="text-center p-t-5" >
							<a class="txt2" onClick={this.onShowResetPassword}> Forgot Your Password?</a>
						</div >

						<div class="text-center p-t-15">
							<span class="txt1" >
								Don't have an account?
							</span>&nbsp;
							<a class="txt2 backtologin" href="#" onClick={this.onShowRegister}>
								Sign Up
							</a>
						</div>

					</form >

					<form id="registerform" action="" method="post" class="login100-form validate-form" style={{ display: this.state.showRegister ? 'block' : 'none' }} onSubmit={this.handleRegister}>
						<div class="wrap-input100 validate-input">
							<input placeholder="Email" class="input100" type="text" name="EMAIL" value={this.state.email} onChange={this.handleEmail} required />

						</div>
						<div class="wrap-input100 validate-input">
							<input placeholder="Username" class="input100" type="text" name="USERNAME" value={this.state.username} onChange={this.handleUsername} required />

						</div>
						<div class="wrap-input100 validate-input">

							<input class="input100" placeholder="Password" type="password" name="PASSWORD" value={this.state.password} onChange={this.handlePassword} required />

						</div >
						<div class="wrap-input100 validate-input">
							<input class="input100" placeholder="Confirm Password" type="password" name="CONFIRM" required />

						</div>
						<input type="hidden" name="ACTION" value="REGISTER" />
						<div class="container-login100-form-btn">
							<div class="wrap-login100-form-btn">
								<div class="login100-form-bgbtn"></div>
								<button type="submit" id="createbtn" class="login100-form-btn" >
									Register
								</button>
							</div>
						</div>

						<div class="text-center p-t-15">
							<span class="txt1">
								Already have an account?
							</span>
							&nbsp;
							<a class="txt2 backtologin" href="#" onClick={this.onShowLogin}>
								Login
							</a>
						</div>
					</form >

					<form id="resetform" action="" method="post" class="login100-form validate-form" style={{ display: this.state.showResetPassword ? 'block' : 'none' }} onSubmit={this.handleRequestReset}>
						<div class="wrap-input100 validate-input">
							<input class="input100" type="text" name="USERNAME" onChange={this.handleRequestEmail} required />
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

						<div class="text-center p-t-15">
							<span class="txt1" >
								Already have an account?
							</span>
							&nbsp;
							<a class="txt2 backtologin" href="#" onClick={this.onShowLogin}>
								Login
							</a>
						</div>
					</form>

					<form id="verifyform" action="" method="post" class="login100-form validate-form" style={{ display: this.state.showVerify ? 'block' : 'none' }} onSubmit={this.handleResetPassword}>
						<h4 class="text-center white-text">Verify Account</h4>
						<br />
						<div class="wrap-input100 validate-input">
							<input class="input100 code" type="text" name="CODE" onChange={this.handleResetCode} required />
							<span class="focus-input100" data-placeholder="Enter Code"></span>
						</div>
						<div class="wrap-input100 validate-input">
							<input class="input100" type="text" name="PASSWORD" onChange={this.handleNewPassword} required />
							<span class="focus-input100" data-placeholder="New Password"></span>
						</div>
						<div class="wrap-input100 validate-input">
							<input class="input100" type="text" name="CONFIRM" onChange={this.handleConfirmedPassword} required />
							<span class="focus-input100" data-placeholder="Confirm Password"></span>
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
					</form >
					<a href="/music-generation" style={{ 'font-size': '16px', display: isElectron() ? 'block' : 'none' }}> <span style={{ 'font-size': '12px' }} class="material-icons">arrow_back_ios</span> Go Back </a>
				</div >
				</div>
			</div >
		);
	}
}
export default Login
