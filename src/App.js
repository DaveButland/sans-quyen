import React from 'react' ; // react
import { withRouter, Route, Switch } from "react-router-dom" ; //react routing
import ReactGA from 'react-ga' ; // react - google analystics

import Security from './utilities/security' ;

import Home from './pages/home' ;
import Portfolio from './pages/portfolio' ;
import SignIn from './pages/signin' ;
import Contact from './pages/contact' ;

import './App.css';

ReactGA.initialize('UA-143274884-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends React.Component {

	constructor(props, context) {
		super(props, context);
		
		this.state = {
			isAuthenticated: false,
			isAuthenticating: true,
			security: new Security()
		} ;
	}

	componentDidMount = async () => {
		var security = new Security() ;
		await security.getSession() ;

		this.setState( { security: security } ) ;
	}

	handleLogout = async (event) => {
		await this.state.security.signOut();
		this.props.history.push( "/" ) ;
	}

	render = () => {
		return (
//			!( this.state.isAuthenticating ) &&
			<div>
				{ !this.state.isAuthenticated
        ? <div>
						<Switch>
							<Route exact path="/" component={Home} props={this.security}/>
							<Route exact path="/portfolio" component={Portfolio} props={this.security}/>
							<Route exact path="/contact" component={Contact} props={this.security}/>
							<Route exact path="/signin" component={SignIn} props={this.security}/>
							<Route component={Home} props={this.security}/>
						</Switch>
					</div>
				: <div>
						<Switch>
							<Route exact path="/" component={Home} props={this.security}/>
							<Route exact path="/portfolio" component={Portfolio} props={this.security}/>
							<Route exact path="/contact" component={Contact} props={this.security}/>
							<Route component={Home} props={this.security}/>
						</Switch>
				  </div>
				}
			</div>
		);		
	}
}

export default withRouter( App ) ;
