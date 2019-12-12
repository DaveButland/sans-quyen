import awsconfig from '../config.js'

import Auth from "@aws-amplify/auth" ;
import Amplify from 'aws-amplify';

import cookie from "react-cookies";

Amplify.configure(awsconfig);

export default class Security {
	session = null ;
	authenticated = false ;

	removeCookies = async => {
		cookie.remove( "CloudFront-Key-Pair-Id" ) ;
		cookie.remove( "CloudFront-Policy" ) ;
		cookie.remove( "CloudFront-Signature" ) ;
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

	getAccessToken = async () => {
		try
		{
			if ( !this.session ) { this.getSession() }

			// This is probably unnecessary, looks like getSession implements this logic
			if ( this.session.getAccessToken().getExpiration() - ( Date.now() / 1000 ) < 300 )
			{
				this.getSession() ;
			}

//			console.log( this.session.getAccessToken().getExpiration() - ( Date.now() / 1000 ) ) ;

			return this.session.getAccessToken() ;
		} catch( error ) {
			console.log( "Error getting token", error ) ;
		}
	}

	loggedIn = () => {
		return ( this.session !== null ) ;
	}

  getSession = async () => {

		try {
			this.session = await Auth.currentSession() ;
			await this.getCookies( this.session.getAccessToken().getJwtToken() ) ;

			this.isAuthenticated = true ;
			return this.session ;
		}
		catch(e) {
			this.session = null ;
			this.removeCookies() ;
			if ( e !== 'No current user' ) {
				alert( 'Get Session ' + e ) ;
			}
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

  signOut = async () => {
		await Auth.signOut() ;
		this.removeCookies() ;
		this.authenticated = false ;
		return ;
	}

}

