import React from "react";
import { withRouter } from "react-router-dom";
import {Container, Row, Col, Card } from "react-bootstrap" ;
import {LinkContainer} from "react-router-bootstrap" ;

import "./userhome.css"

class UserHome extends React.Component {

	render()
	{
		return (
	  	<Container>
				<h1>Home</h1>
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