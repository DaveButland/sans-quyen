import React, { Component } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom" ;

import "./signin.css" ;

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
			password: "", 
			authenticated: false,
			user: "",
			error: "", 
			stage: "",
		};
		
		this.handleActionSignup = this.handleActionSignup.bind(this) ;
		this.handleActionForgot = this.handleActionForgot.bind(this) ;
	}
	
	handleActionSignup() {
		console.log( 'signup') ;
		this.props.history.push("/signup");
	}

	handleActionForgot() {
		this.props.history.push("/forgot");
	}

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
	
	handleSubmit = async event => {
		event.preventDefault();
	
		await this.props.security.signIn( this.state.username, this.state.password ) ;
		
		if ( this.props.security.isAuthenticated() ) {
			this.props.history.push("/home");
		} else {
			// set error text
		}
	}
	
	render() {
    return (
      <Container id="signin-container">
        <Form id="signin-form" onSubmit={this.handleSubmit}>
					<h1>Sign In</h1>
					<p>Please enter your username and password to sign in</p>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
						<Form.Control autoFocus type="username" placeholder="Enter username" value={this.state.username} onChange={this.handleChange} />
          </Form.Group>
          <Form.Group controlId="password">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Enter password" value={this.state.password} onChange={this.handleChange} />
          </Form.Group>
						<Button className="mr-2" disabled={!this.validateForm()} type="submit">Sign In</Button>
						<Button className="m-2" variant="secondary" onClick={this.handleActionSignup} disabled >Sign Up</Button>
 				</Form>	
      </Container>
    );
  }
}

export default withRouter(SignIn) ;
