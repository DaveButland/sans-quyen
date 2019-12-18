import React from "react";
import { withRouter } from "react-router-dom";
import {Container, Row, Col, Card, Navbar, Nav } from "react-bootstrap" ;
import {LinkContainer} from "react-router-bootstrap" ;

import "./userhome.css"

class UserHome extends React.Component {

	render()
	{
		return (
 			<Container style={{ marginTop: '70px', paddingLeft: '5%', paddingRight: '5%' }}>
				<Navbar style={{paddingLeft:'5%', paddingRight:'5%'}} bg="white" variant="light" fixed="top" expand="lg">
					<Navbar.Brand>Home</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="ml-auto justify-content-end">
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Row>
					<Col>
						<LinkContainer to="/shoots">
							<Card>
								<Card.Body>
									<Card.Img variant="top" src="/camera.svg"/>
								</Card.Body>
								<Card.Footer align="center">Shoots</Card.Footer>
							</Card>
						</LinkContainer>
					</Col>
					<Col>
						<LinkContainer to="/albums">
							<Card>
								<Card.Body>
									<Card.Img variant="top" src="/album.svg"/>
								</Card.Body>
								<Card.Footer align="center">Albums</Card.Footer>
							</Card>
						</LinkContainer>
					</Col>
					<Col>
						<LinkContainer to="/">
							<Card>
								<Card.Body>
									<Card.Img variant="top" src="/portfolio.svg"/>
								</Card.Body>
								<Card.Footer align="center">Portfolio</Card.Footer>
							</Card>
						</LinkContainer>
					</Col>
					<Col>
						<LinkContainer to="/messages">
							<Card>
								<Card.Body>
									<Card.Img variant="top" src="/messages.svg" />
								</Card.Body>
								<Card.Footer align="center">Messages</Card.Footer>
							</Card>
						</LinkContainer>
					</Col>
					<Col>
						<LinkContainer to="/calendar">
							<Card>
								<Card.Body>
									<Card.Img variant="top" src="/calendar.svg" />
								</Card.Body>
								<Card.Footer align="center">Calendar</Card.Footer>
							</Card>
						</LinkContainer>
					</Col>
				</Row>
			</Container>
		) ;
	}
}

export default withRouter(UserHome) ;