import React from "react";
import { withRouter } from "react-router-dom";
import {Container } from "react-bootstrap" ;
//import {LinkContainer} from "react-router-bootstrap" ;

//import "./about.css"

class Messages extends React.Component {

	render()
	{
		return (
	  	<Container>
				<h1>Messages</h1>
			</Container>
		) ;
	}
}

export default withRouter(Messages) ;