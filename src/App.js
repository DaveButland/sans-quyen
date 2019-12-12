import React from 'react' ; // react
import { withRouter, Route, Switch } from "react-router-dom" ; //react routing
import ReactGA from 'react-ga' ; // react - google analystics

import Security from './utilities/security' ;

import Home from './pages/home' ;
import Portfolio from './pages/portfolio' ;
import SignIn from './pages/signin' ;
import Contact from './pages/contact' ;
import About from './pages/about' ;
import UserHome from './pages/userhome' ;
import Shoots from './pages/shoots' ;
import Albums from './pages/albums' ;
import Messages from './pages/messages' ;
import Calendar from './pages/cal' ;

import './App.css';

ReactGA.initialize('UA-143274884-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends React.Component {

	constructor(props, context) {
		super(props, context);
		
		this.state = {
			isAuthenticated: false,
			isAuthenticating: true,
			security: null
		} ;
	}

	componentDidMount = async () => {

		var security = new Security() ;

		await security.authenticate() ;

		this.setState( { security: security } ) ;
	}

	handleLogout = async (event) => {
		await this.state.security.signOut();
		this.props.history.push( "/" ) ;
	}

	render = () => {

		var security = this.state.security ;

		return (
			( security ) &&
			<div>
				{ !security.isAuthenticated()
        ? <div>
						<Switch>
							<Route exact path="/" component={Home} props={this.security}/>
							<Route exact path="/portfolio" component={Portfolio} props={this.security}/>
							<Route exact path="/contact" component={Contact} props={this.security}/>
							<Route exact path="/about" component={About} props={this.security}/>
							<Route exact path='/signin' render={(props) => <SignIn {...props} security={this.state.security} />} />
							<Route component={Home} props={this.security}/>
						</Switch>
					</div>
				: <div>
						<Switch>
							<Route exact path="/" component={Home} props={this.security}/>
							<Route exact path="/portfolio" component={Portfolio} props={this.security}/>
							<Route exact path="/contact" component={Contact} props={this.security}/>
							<Route exact path="/about" component={About} props={this.security}/>
							<Route exact path='/signin' render={(props) => <SignIn {...props} security={this.state.security} />} />
							<Route exact path="/home" render={(props) => <UserHome {...props} security={this.state.security} />} />
							<Route exact path="/shoots" render={(props) => <Shoots {...props} security={this.state.security} />} />
							<Route path="/shoots/:shootid" render={(props) => <Shoots {...props} security={this.state.security} />} />
							<Route exact path="/albums" render={(props) => <Albums {...props} security={this.state.security} />} />
							<Route path="/albums/:albumid" render={(props) => <Albums {...props} security={this.state.security} />} />
							<Route exact path="/messages" render={(props) => <Messages {...props} security={this.state.security} />} />
							<Route exact path="/calendar" render={(props) => <Calendar {...props} security={this.state.security} />} />
							<Route component={Home} props={this.security}/>
						</Switch>
				  </div>
				}
			</div>
		);		
	}
}

export default withRouter( App ) ;
