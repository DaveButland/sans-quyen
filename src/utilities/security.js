import awsconfig from '../config.js'

import cookie from 'react-cookies' ;

import Auth from "@aws-amplify/auth" ;
import Amplify from 'aws-amplify';

Amplify.configure(awsconfig);

class Security {
	session = null ;
	authenticated = false ;

	isAuthenticated = () => {
		return this.authenticated ;
	}

  authenticate = async () => {

		try {
			this.session = await Auth.currentSession() ;
			await this.getCookies( this.session.getAccessToken().getJwtToken() ) ;

			this.authenticated = true ;
		}
		catch(e) {
			this.session = null ;
			this.authenticated = false ;
			this.removeCookies() ;
			if ( e !== 'No current user' ) {
				alert( 'Get Session ' + e ) ;
			}
		}
	}	

	getAccessToken = async () => {
		try
		{
			if ( !this.isAuthenticated() ) { this.authenticate() }

			// This is probably unnecessary, looks like getSession implements this logic
			if ( this.session.getAccessToken().getExpiration() - ( Date.now() / 1000 ) < 300 )
			{
				this.authenticate() ;
			}

			return this.session.getAccessToken() ;
		} catch( error ) {
			console.log( "Error getting token", error ) ;
		}
	}

	getUser = async () => { 

		try {
			var user = await Auth.currentAuthenticatedUser() ;
			console.log( user ) ;
		} catch (error) {
			console.log( error ) ;
		}
	}

	signIn = async ( username, password ) => {
		
		this.authenticated = false ;

		try {
			const user = await Auth.signIn(username, password);
			if (user.challengeName === 'SMS_MFA' || 
				user.challengeName === 'SOFTWARE_TOKEN_MFA') {
				/*
							// You need to get the code from the UI inputs
							// and then trigger the following function with a button click
				const code = getCodeFromUserInput();
							// If MFA is enabled, sign-in should be confirmed with the confirmation code
				const loggedUser = await Auth.confirmSignIn(
									user,   // Return object from Auth.signIn()
									code,   // Confirmation code  
									mfaType // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
				);
				*/
			} else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
				/*
				const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
							// You need to get the new password and required attributes from the UI inputs
							// and then trigger the following function with a button click
							// For example, the email and phone_number are required attributes
				const { username, email, phone_number } = getInfoFromUserInput();
				const loggedUser = await Auth.completeNewPassword(
					user,               // the Cognito User Object
					newPassword,       // the new password
									// OPTIONAL, the required attributes
					{
						email,
						phone_number,
					}
				);
				*/
			} else if (user.challengeName === 'MFA_SETUP') {
							// This happens when the MFA method is TOTP
							// The user needs to setup the TOTP before using it
							// More info please check the Enabling MFA part
				Auth.setupTOTP(user);
			} else {
				// handle this in authenticate longer term to get cookies etc
				this.session = await Auth.currentSession() ;
				this.authenticated = true ;
			} 
		} catch (err) {
//			this.setState( { error: JSON.stringify( err ) } ) ;
			if (err.code === 'UserNotConfirmedException') {
							// The error happens if the user didn't finish the confirmation step when signing up
							// In this case you need to resend the code and confirm the user
							// About how to resend the code and confirm the user, please check the signUp part
			} else if (err.code === 'PasswordResetRequiredException') {
							// The error happens when the password is reset in the Cognito console
							// In this case you need to call forgotPassword to reset the password
							// Please check the Forgot Password part.
			} else if (err.code === 'NotAuthorizedException') {
							// The error happens when the incorrect password is provided
			} else if (err.code === 'UserNotFoundException') {
							// The error happens when the supplied username/email does not exist in the Cognito user pool
			} else {
				console.log(err);
			}
		}

		return false ;
	}

  signOut = async () => {
		await Auth.signOut() ;
		this.removeCookies() ;
		this.authenticated = false ;
		return ;
	}

	getCookies = async accessToken => {
		return new Promise((resolve, reject) => {

			var xhr = new XMLHttpRequest();
			xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/cookies?domain='+process.env.REACT_APP_HTML_DOMAIN, true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken );
			xhr.onload = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					let values = JSON.parse( xhr.response ) ;
		
					cookie.save( "CloudFront-Key-Pair-Id", values["CloudFront-Key-Pair-Id"] ) ;
					cookie.save( "CloudFront-Policy", values["CloudFront-Policy"] ) ;
					cookie.save( "CloudFront-Signature", values["CloudFront-Signature"] ) ;

					resolve(xhr.response);
				} else {
					alert( "Error getting cookies") ;
					reject(xhr.response);
				}
			}
			xhr.send();
		});
	}

	removeCookies = async => {
		cookie.remove( "CloudFront-Key-Pair-Id" ) ;
		cookie.remove( "CloudFront-Policy" ) ;
		cookie.remove( "CloudFront-Signature" ) ;
	}

}

export default Security ;