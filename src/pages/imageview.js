import React from "react";
import {withRouter} from "react-router-dom";
import {Container, Row, Col, Form, FormControl, Button, Image, Navbar, Nav} from "react-bootstrap" ;
//import {LinkContainer} from "react-router-bootstrap" ;
import Draggable from 'react-draggable';

import "./images.css"

class Images extends React.Component {

	constructor(props, context) {
    super(props, context);

		this.state = {
		  image: null
		}
	}

	componentDidMount = () => {
  	if ( this.props.match.params.image ){
		}
	}
		
	componentWillUnmount = () => {
	}
			
	static getDerivedStateFromProps(nextProps, prevState) {
		
		if ( nextProps.match.params.image !== prevState.image ) {
			return ( { image: nextProps.match.params.image } ) ;
		} else {
			return null ;
		}
	}
				 
	componentDidUpdate(prevProps, prevState) {
			
		if ( prevState.image !== this.props.match.params.image )
		{
			if ( this.props.match.params.image ) {
			}
			else {
				this.setState( { image: null } );
			}
		}	
	}  
				 
	render() {

		return (
			<Fragment></Fragment>
		) ;
	}
}