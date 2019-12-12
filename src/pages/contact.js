import React from "react";
import { withRouter } from "react-router-dom";
import {Container, Form, Button, Modal } from "react-bootstrap" ;
//import {LinkContainer} from "react-router-bootstrap" ;

import "./contact.css"

class Contact extends React.Component {

	constructor(props, context) {
    super(props, context);

		this.state = {
			message: { name: "", email: "", subject: "", text: "" }
		,	showConfirmation: false
		}
		 
		 this.handleName = this.handleName.bind(this) ;
		 this.handleConfirmation = this.handleConfirmation.bind(this);
		 this.onClick = this.onClick.bind(this) ;
		}

	handleSubmit = async event => {
		event.preventDefault()

 		var message = this.state.message ;

		var json = JSON.stringify( message ) ;

		var xhr = new XMLHttpRequest();

		xhr.onerror = function() {
			console.log( "Error sending message" ) ;
		} ;

		xhr.onload = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
			} else {
				console.log( "Error saving message") ;
			}
		} ;

		xhr.open("POST", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/messages', true);
		xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
		xhr.send(json) ;

		this.setState( { message: { name: "", email: "", subject: "", text: "" }, showConfirmation: true } ) ;
	}

	handleName = event => {
		let value = event.target.value;
		this.setState( prevState => ({ message: 
				 {...prevState.message, name: value
				 }
			 }))
	}

	handleEmail = event => {
		let value = event.target.value;
		this.setState( prevState => ({ message: 
				 {...prevState.message, email: value
				 }
			 }))
	}

	handleSubject = event => {
		let value = event.target.value;
		this.setState( prevState => ({ message: 
				 {...prevState.message, subject: value
				 }
			 }))
	}

	handleText = event => {
		let value = event.target.value;
		this.setState( prevState => ({ message: 
				 {...prevState.message, text: value
				 }
			 }))
	}

	handleConfirmation() {
		this.setState( { showConfirmation: false } ) ;

		this.props.history.push('/portfolio');
	}

	onClick( event ) {
		this.props.history.push('/portfolio');
	}
		
	renderConfirmation() {
		return (
			<Modal show={this.state.showConfirmation} onHide={this.handleConfirmation}>
				<Modal.Header closeButton>
					<Modal.Title>Confirmation</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Thank you for your message</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={this.handleConfirmation}>OK</Button>
				</Modal.Footer>
			</Modal>
		) ;
	}

	render()
	{
		return (
			<div id='contact-image' >
 		  	<Container>
							<Form onSubmit={this.handleSubmit} id='container-form'>
								<Button className="close" type="close" aria-label="Close" onClick={this.onClick}>
 									<span aria-hidden="true">&times;</span>
								</Button>		
								<h1 align="center">Contact</h1>
								<p>If you would like to contact me about a booking or other enquiry then please fill in the form below and I will reply as soon as possible</p>
								<Form.Group controlId="formBasicName">
			  	  			<Form.Label>Name</Form.Label>
    							<Form.Control type="name" placeholder="Enter your name" onChange={this.handleName} required/>
  							</Form.Group>
   							<Form.Group controlId="formBasicEmail">
								 	<Form.Label>Email address</Form.Label>
    							<Form.Control type="email" placeholder="Enter your email" onChange={this.handleEmail} required/>
  							</Form.Group>
								<Form.Group controlId="formBasicSubject">
					 				<Form.Label>Subject</Form.Label>
    							<Form.Control type="subject" placeholder="Enter your Subject" onChange={this.handleSubject} required/>
  							</Form.Group>
								<Form.Group controlId="formBasicMessage">
									<Form.Label>Message</Form.Label>
 									<Form.Control as="textarea" rows="5" onChange={this.handleText} required/>
  							</Form.Group>
  							<Button variant="primary" type="submit">
    							Submit
  							</Button>
							</Form>
				</Container>

				{this.renderConfirmation()}

			</div>
		) ;
	}
}

export default withRouter(Contact) ;