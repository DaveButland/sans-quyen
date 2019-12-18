import React from "react";
import { withRouter } from "react-router-dom";
import {Container, Navbar, Nav, Button, Row } from "react-bootstrap" ;
//import {LinkContainer} from "react-router-bootstrap" ;

//import "./about.css"

class Messages extends React.Component {

	onBack = event => {
		event.preventDefault() ;

		this.props.history.goBack() ;
	}

	render()
	{
		return (
			<Container style={{marginTop: '70px'}}>
				<Navbar style={{paddingLeft:'5%', paddingRight:'5%'}} bg="white" variant="light" fixed="top" expand="lg">
					<Navbar.Brand>Messages</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="ml-auto justify-content-end">
							<Button className="m-1" size="sm" variant="primary" onClick={this.onBack}>Back</Button>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Row>
				</Row>
			</Container>
		) ;
	}
}

export default withRouter(Messages) ;