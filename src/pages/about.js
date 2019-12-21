import React from "react";
import { withRouter } from "react-router-dom";
import {Container, Accordion, Card, Table, Navbar, Nav } from "react-bootstrap" ;
import {LinkContainer} from "react-router-bootstrap" ;

import "./about.css"

class About extends React.Component {

	render()
	{
		return (
	  	<Container style={{ paddingTop:70, paddingBottom: 70 }}>
        <Navbar style={{paddingTop:0, paddingLeft:'5%', paddingRight:'5%'}} bg="white" variant="light" fixed="top" expand="lg">
					<Navbar.Brand className="quyen-contact"></Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto justify-content-end">
							<LinkContainer to="/portfolio">
	     					<Nav.Link className="quyen-contact" href="/about/portfolio">portfolio</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/about">
	    					<Nav.Link className="quyen-contact" href="/about">about</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/events">
	    					<Nav.Link className="quyen-contact" href="/events">events</Nav.Link>
							</LinkContainer>
						  <LinkContainer to="/contact">
	   						<Nav.Link className="quyen-contact" href="/contact">contact</Nav.Link>
							</LinkContainer>
    				</Nav>
					</Navbar.Collapse>
				</Navbar>
				<div className="about-container" >
				<h1>About</h1>
				<Accordion defaultActiveKey="0">
					<Card>
					<Accordion.Toggle className="about-header" as={Card.Header} eventKey="0">
      				Introduction
	    			</Accordion.Toggle>
    				<Accordion.Collapse eventKey="0">
      				<Card.Body>
								<p>
									I am a freelance model with a variety of experience covering a wide range of different levels. 
									I am originally from Vietnam but currently based in Cambridgeshire, UK. 
									I can travel to London, Birmingham and the rest of the UK easily and I am often on tour as I enjoy travelling. 
									If you would like to work with me then please use my contact page to get in touch and I will get back to you as soon as possible. 
								</p>
								<p>
									I also frequently travel further afield as I have yet to fully explore this part of the world and happy to try new places 
									if there is enough interest in that location. 
									Countries I have not yet visited include Switzerland, Germany and Scandinavia. 
									If you are interest in my travelling outside of the Schengen area then I may need a visa and so plenty of notice would be appreciated.
								</p>
								<p>
									I am currently modelling full time, having just finished my Master’s Degree. 
									However, this is likely to change in the near future so if you would like to work with me, now is a good time to do so.
								</p>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
 					<Card>
    				<Accordion.Toggle className="about-header" as={Card.Header} eventKey="1">
      				Physical Characteristics
	    			</Accordion.Toggle>
    				<Accordion.Collapse eventKey="1">
      				<Card.Body>
								<p>
									I am 26 years old of South East Asian ethnicity, originally from Vietnam. 
									I have black eyes and long straight fine dark brown hair. 
									I have a single tattoo in the centre of my chest (Unalome).
								</p>
								<Table striped bordered style={{maxWidth: 600}}>
 									<thead>
										<tr><th></th>
											<th className="about-table-header" width="20%" align="center">UK</th>
											<th className="about-table-header" width="20%" align="center">EU</th>
											<th className="about-table-header" width="20%" align="center">US</th></tr>
									</thead>
  								<tbody>
										<tr><td>Height</td><td width="20%" align="center">5' 3"</td><td width="20%" align="center">160cm</td><td width="20%" align="center">5' 3"</td></tr>
										<tr><td>Weight</td><td width="20%" align="center">8st</td><td width="20%" align="center">50kg</td><td width="20%" align="center">8st</td></tr>
										<tr><td>Dress Size</td><td width="20%" align="center">6</td><td width="20%" align="center">34</td><td width="20%" align="center">2</td></tr>
										<tr><td>Shoe Size</td><td width="20%" align="center">4</td><td width="20%" align="center">37</td><td width="20%" align="center">5</td></tr>
										<tr><td>Chest</td><td width="20%" align="center">34"</td><td width="20%" align="center">86cm</td><td width="20%" align="center">34"</td></tr>
										<tr><td>Waist</td><td width="20%" align="center">24"</td><td width="20%" align="center">61cm</td><td width="20%" align="center">24"</td></tr>
										<tr><td>Hips</td><td width="20%" align="center">36"</td><td width="20%" align="center">92cm</td><td width="20%" align="center">36"</td></tr>
								  </tbody>
								</Table>
							</Card.Body>
    				</Accordion.Collapse>
  				</Card>
				</Accordion>
				</div>
        <Navbar bg="white" variant="light" sticky="bottom">
					<Navbar.Brand><small>&copy; Quyen Le 2019</small></Navbar.Brand>
				</Navbar>
			</Container>
		) ;
	}
}

export default withRouter(About) ;