import React from "react";
import { withRouter } from "react-router-dom";
import {Container, Accordion, Card, Table, Image, Navbar, Nav } from "react-bootstrap" ;
import {LinkContainer} from "react-router-bootstrap" ;

import "./events.css"

class Events extends React.Component {

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
				<div className="event-container" >
				<h1>Events</h1>
				<Accordion>
					<Card>
						<Accordion.Toggle className="event-header" as={Card.Header} eventKey="0">
							<strong>26/01/2020 @10am - 1pm: Portfolio Builder at Aura Studio hosted by Chris Conway</strong>	    			
						</Accordion.Toggle>
    				<Accordion.Collapse eventKey="0">
      				<Card.Body>
								<Image style={{ width:"100%", height:"auto" }} src="https://quyen-le-model.com/thumbnail/public/Banner.jpg" />
								<p>
									On the morning of <strong>Sunday 26th January</strong>, awesome photographer 
									<a href="https://www.chrisconwayphotography.co.uk/" target="_blank"> Chris Conway </a> 
									and myself will be at 
									<a href="https://aurastudio.uk/" target="_blank"> AURA Studio </a>
									in Newmarket to run this creative portfolio builder event!
								</p>
								<p>
									This will run from <strong>10am till 1pm</strong> at the price of only <strong>£55 per person</strong>. 
									The event is open to just <strong>6 photographers</strong>, and I will be modelling up to <strong>lingerie / sheer fashion</strong> levels.
								</p>
								<p>
									Throughout the event, Chris will be creating 5 different and imaginative lighting set-ups which 
									will cover a mix of genres and styles. 
								</p>
								<p>
									<a href="https://studiohireplymouth.co.uk/events-on-tour/" target="_blank">Click here </a> 
									to see examples of Chris's work and previous events!
								</p>
								<p>
									I don't often do studio days so this is a unique opportunity to work with Chris and I
									at a very reasonable price in a nice warm studio for 3 hours for a change in January.
									I offer something different with a rare South East Asian look, extensive wardrobe and striking posing. 
									I always try to make every shoot an enjoyable and productive experience.
								</p>
								<p>
									With the amazing master of lighting that is Chris Conway, 
									I hope this will be a day to remember with some fantastic images being produced. 
								</p>
								<p style={{margin:0}}>
									For full details and your chance to book please click on the link below
								</p>
								<a href="https://studiohireplymouth.co.uk/events-on-tour/201/portfolio-builder-with-quinnl-at-aura-studio/" target="_blank">
									<Image src="https://quyen-le-model.com/thumbnail/public/booknow.jpeg" />
								</a>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
 					<Card>
					 <Accordion.Toggle className="event-header" as={Card.Header} eventKey="1">
							<strong>26/01/2020 @2pm - 6pm: Creative UV Beauty portfolio builder with 2 top models!</strong>	    			
						</Accordion.Toggle>
    				<Accordion.Collapse eventKey="1">
      				<Card.Body>
								<a href="https://studiohireplymouth.co.uk/events-on-tour/199/creative-uv-beauty-portfolio-builder-at-aura-studio/" target="_blank">
									<Image style={{ width:"100%", height:"auto" }} src="https://studiohireplymouth.co.uk/image/event/thumbs/199-4652.jpg?1576783572" />
								</a>
								<p>
									The <strong>UV Beauty Portfolio Builder</strong> events have been so popular at the studio 
									in Plymouth that <a href="https://www.chrisconwayphotography.co.uk/" target="_blank">Chris Conway's</a> has
									decided to take these to other areas around the country as part of his tours! 
									This time it will be <i>Aura Studio</i> in <i>Newmarket</i>.
								</p>
								<p>
									This event is dedicated to creative beauty photography with UV reactive make-up in the mix, 
									and will run from <strong>2pm till 6pm</strong> on <strong>Sunday January 26th</strong> - open to just 6 photographers.
								</p>
								<p>
									The models for the day will be the lovely <a href="http://amieboulton.com/" target="_blank">Amie Boulton</a> and myself. 
									There will be a variety of unique looks created on each model, 
									and with variations in lighting you will leave with <strong>several different sets of images</strong> including a duo set!
								</p>
								<p>
									Chris will be hosting the portfolio builder and will produce all of the lighting set-ups and UV looks for you, 
									utilising a variety of application techniques including: airbrushing, splatter and coarse brush strokes to give lots of texture! 
									The UV light itself will be mixed in with other light sources in the studio so that it's an addition to already great photos 
									- rather than the sole focus.
								</p>
								<p style={{margin:0}}>
									Full information and online booking can be found on this 
									link: <a href="https://studiohireplymouth.co.uk/events-on-tour/199/creative-uv-beauty-portfolio-builder-at-aura-studio/" target="_blank">creative-uv-beauty-portfolio-builder-at-aura-studio</a>
								</p>
								<a href="https://studiohireplymouth.co.uk/events-on-tour/199/creative-uv-beauty-portfolio-builder-at-aura-studio/" target="_blank">
									<Image style={{ width:"33%", height:"auto" }} src="https://studiohireplymouth.co.uk/image/event/165-3920.jpg?1566663864"/>
									<Image style={{ width:"33%", height:"auto" }} src="https://studiohireplymouth.co.uk/storage/book-online-button.png" />
									<Image style={{ width:"33%", height:"auto" }} src="https://studiohireplymouth.co.uk/image/event/199-4648.jpg?1576782341" />
								</a>
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

export default withRouter(Events) ;