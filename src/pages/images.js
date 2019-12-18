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
			parent: null
		, parentid: null
		, images: []
		,	image: { credit: '', title: '', description: '', centreX: 0, centreY: 0, width: 1, height: 1 }
		,	imageid: null
		}
	}

	componentDidMount = () => {
    window.addEventListener('resize', this.updateDimensions);
		if ( this.props.match.params.imageid ){
			this.getImage( this.props.match.params.imageid ) ;
//			this.getAlbumImages( this.props.location.search.substring(7) ) ;
		}

		this.setState({ isLoaded: false });
	}
		
	componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimensions);
	}
			
	static getDerivedStateFromProps(nextProps, prevState) {
		
		if ( nextProps.match.params.imageid !== prevState.imageid ) {
			return ( { imageid: nextProps.match.params.imageid } ) ;
		} else {
			return null ;
		}
	}
				 
	componentDidUpdate(prevProps, prevState) {
			
		if ( prevState.imageid !== this.props.match.params.imageid )
		{
			if ( this.props.match.params.imageid ) {
				this.getImage( this.props.match.params.imageid ) ;
				this.setState( { imageid: this.props.match.params.imageid, image: null } )
			}
			else {
				this.setState( { imageid: null, image: null } );
			}
		}	
	}  
				 
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

	getImage = ( imageid ) => {
		this.props.security.getAccessToken().then( function( accessToken ) {
			var xhr = new XMLHttpRequest();

			xhr.onerror = function () {
				console.log( "Error getting image "+imageid ) ;
			}

			xhr.onload = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					let response = JSON.parse( xhr.response ) ;
					var image = response ;

					if ( !image.centreX ) { image.centreX = Math.round( image.width / 2 ) ; }
					if ( !image.centreY ) { image.centreY = Math.round( image.height / 2 ) ; }
					if ( !image.title ) { image.title = '' ; }
					if ( !image.description ) { image.description = '' ; }
					if ( !image.credit ) { image.credit = '' ; }  

					this.setState( { image: image, isLoaded: true } ) ;

				} else {
					console.log( "Error getting image "+imageid ) ;
				}
			}.bind(this) ;
		
			xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/images/'+imageid, true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
		
			xhr.send();
		}.bind(this)).catch ( function (error ) {
		console.log( "Error getting image", error ) ;
		}) ;
	}

	updateImage = ( image ) => {
		this.props.security.getAccessToken().then( function( accessToken ) {

			if ( image.title === '' ) { delete image.title } ;
			if ( image.description === '' ) { delete image.description } ;
			if ( image.credit === '' ) { delete image.credit } ; 

			var json = JSON.stringify( image )
			var xhr = new XMLHttpRequest();

			xhr.onerror = function () {
				console.log( "Error updating image "+image.imageId ) ;
			}

			xhr.onload = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					let response = JSON.parse( xhr.response ) ;
					var image = response ;

					this.setState( { image: image } ) ;

				} else {
					console.log( "Error updating image "+image.imageId ) ;
				}
			}.bind(this) ;
		
			xhr.open( "PUT", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/images/'+image.imageId, true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
		
			xhr.send(json);
		}.bind(this)).catch ( function (error ) {
		console.log( "Error updating image", error ) ;
		}) ;
	}

	getAlbumImages = ( albumId ) => {
		this.props.security.getAccessToken().then( function( accessToken ) {
			var xhr = new XMLHttpRequest();

			xhr.onerror = function () {
				console.log( "Error getting album images for album "+albumId ) ;
			}

			xhr.onload = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					let response = JSON.parse( xhr.response ) ;
					var images = response ;
					this.setState( { images: images } ) ;

				} else {
					console.log( "Error getting album images for album "+albumId ) ;
				}
			}.bind(this) ;
		
			xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums/'+albumId+'/images', true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
		
			xhr.send();
		}.bind(this)).catch ( function (error ) {
			console.log( "Error getting album images", error ) ;
		}) ;
	}
	
	handleDragStart = ( event, data ) => {
	}
 
	handleDragStop1 = ( event, data ) => {
		const row = document.getElementsByClassName('image-col')[0] ;

		var { image } = this.state ;

		var imageScreenWidth=0 ;
//		var imageScreenHeight=0 ;
		if ( row ) {
			imageScreenWidth = row.clientWidth-30 ;
//			imageScreenHeight = Math.round( imageScreenWidth * image.height / image.width ) ;
		}

		var boxSize = 100 ;
//		var boxSize = ( imageScreenWidth > imageScreenHeight ) ? imageScreenHeight : imageScreenWidth ;

		image.centreX = Math.round( ( data.x + 15 + boxSize / 2 ) * image.width / imageScreenWidth ) ;
		image.centreY = Math.round( image.height + ( data.y + boxSize / 2 ) * image.width / imageScreenWidth ) ;

		this.setState( { image: image } ) ;
	}
 
	handleDrag = ( event, data ) => {
		const row = document.getElementsByClassName('image-col')[0] ;

		var { image } = this.state ;

		var imageScreenWidth=0 ;
//		var imageScreenHeight=0 ;
		if ( row ) {
			imageScreenWidth = row.clientWidth-30 ;
//			imageScreenHeight = Math.round( imageScreenWidth * image.height / image.width ) ;
		}

		var boxSize = 100 ;
//		var boxSize = ( imageScreenWidth > imageScreenHeight ) ? imageScreenHeight : imageScreenWidth ;

		image.centreX = Math.round( ( data.x + 15 + boxSize / 2 ) * image.width / imageScreenWidth ) ;
		image.centreY = Math.round( image.height + ( data.y + boxSize / 2 ) * image.width / imageScreenWidth ) ;

		this.setState( { image: image } ) ;
	}
 
	validateForm() {
    return true ;
  }

	onBack = event => {
		event.preventDefault() ;

		this.props.history.goBack() ;
	}

  handleChange = event => {
		var { image } = this.state ;
		image[event.target.id] = event.target.value ;
    this.setState({ image: image });
  }
	
	handleSubmit = async event => {
		event.preventDefault();
	
		this.updateImage( this.state.image ) ;
	}
	
	render() {

		const { imageid, image, isLoaded } = this.state ;
		const row = document.getElementsByClassName('image-col')[0] ;

		var imageScreenWidth=0 ;
		var imageScreenHeight=0 ;
		if ( row ) {
			imageScreenWidth = row.clientWidth-30 ;
			imageScreenHeight = Math.round( imageScreenWidth * image.height / image.width ) ;
		}

		var boxSize = 100 ;
//		var boxSize = ( imageScreenWidth > imageScreenHeight ) ? imageScreenHeight : imageScreenWidth ;
		var axis = ( imageScreenWidth > imageScreenHeight ) ? "x" : "y" ;

		var positionX = Math.round( ( image.centreX * imageScreenWidth / image.width ) - boxSize / 2 ) - 15  ; 
		var positionY = Math.round( -imageScreenHeight + ( image.centreY * imageScreenWidth / image.width ) - boxSize / 2 ) ; 
//		var imageScreenPosition = Math.round(-imageScreenHeight + ( image.centreY * imageScreenWidth / image.width ) - imageScreenWidth / 2 ) ;

		return (
			( imageid 
			? <Container style={{marginTop: '70px'}}>
					<Navbar style={{paddingLeft:'5%', paddingRight:'5%'}} bg="white" variant="light" fixed="top" expand="lg">
						<Navbar.Brand>{(image.title ? image.title : "Untitled" )}</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav">
							<Nav className="ml-auto justify-content-end">
								<Button className="m-1" size="sm" variant="success" disabled={!this.validateForm()} onClick={this.handleSubmit}>Save</Button>
	 							<Button className="m-1" size="sm" variant="secondary" disabled>Prev</Button>
								<Button className="m-1" size="sm" variant="secondary" disabled>Next</Button>
								<Button className="m-1" size="sm" variant="primary" onClick={this.onBack}>Back</Button>
							</Nav>
						</Navbar.Collapse>
					</Navbar>
					<Row>
   					<Col sm={5} className="image-col">
							<div>
						 	<Image className="image-parent" draggable="false" fluid src={"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+'-900'}></Image>
							{ ( isLoaded
							? <Draggable
    				  	axis={axis}
								handle=".handle"
								bounds=".image-parent"
        				defaultPosition={{x: positionX, y: positionY }}
								position={null}
								positionOffset= {{x: 15, y: 0 }}
				        scale={1}
        				onStart={this.handleDragStart}
        				onDrag={this.handleDrag}
								onStop={this.handleDragStop}
								>
        					<div className="handle dragtest" style={{width: boxSize, height: boxSize }}></div>
      					</Draggable>
							: <div style={{position: 'absolute'}}></div>
							)}
							</div>
   			 		</Col>
						<Col>
							<Form onSubmit={this.handleSubmit}>
							<Form.Group as={Row} controlId="credit">
            			<Form.Label column sm="2">Credit</Form.Label>
									<Col sm="10">
	    						<FormControl 
		     						placeholder="credit"
    	  						aria-label="credit"
      							aria-describedby="image-credit"
										value={this.state.image.credit}
										onChange={this.handleChange}
    							/>
									</Col>
   							</Form.Group>
								 <Form.Group as={Row} controlId="title">
            			<Form.Label column sm="2">Title</Form.Label>
									<Col sm="10">
	    						<FormControl 
		     						placeholder="title"
    	  						aria-label="title"
      							aria-describedby="image-title"
										value={this.state.image.title}
										onChange={this.handleChange}
    							/>
									</Col>
   							</Form.Group>
								 <Form.Group as={Row} controlId="description">
            			<Form.Label column sm="2">Description</Form.Label>
									<Col sm="10">
	    						<FormControl 
		     						placeholder="description"
    	  						aria-label="description"
      							aria-describedby="image-description"
										value={this.state.image.description}
										onChange={this.handleChange}
    							/>
									</Col>
   							</Form.Group>
								<Row>
								<Col>
										<Form.Group as={Row} controlId="centreX">
            					<Form.Label column sm="4">Centre (X)</Form.Label>
											<Col sm="8">
	    									<FormControl 
		     									placeholder="centreX"
    	  									aria-label="centreX"
      										aria-describedby="image-centre-x"
													value={this.state.image.centreX}
													onChange={this.handleChange}
												/>
											</Col>
	   								</Form.Group>
									</Col>
									<Col>
										<Form.Group as={Row} controlId="centreY">
            					<Form.Label column sm="4">Centre (Y)</Form.Label>
											<Col sm="8">
	    									<FormControl 
		     									placeholder="centreY"
    	  									aria-label="centreY"
      										aria-describedby="image-centre-Y"
													value={this.state.image.centreY}
													onChange={this.handleChange}
    										/>
											</Col>
	   								</Form.Group>
									</Col>
									</Row>
									<Row>
									<Col>
										<Form.Group as={Row} controlId="width">
            					<Form.Label column sm="4">Width</Form.Label>
											<Col sm="8">
	    									<FormControl 
		     									placeholder="width"
    	  									aria-label="width"
      										aria-describedby="image-width"
													value={this.state.image.width}
													readOnly plaintext
    										/>
											</Col>
	   								</Form.Group>
									</Col>
									<Col>
										<Form.Group as={Row} controlId="height">
            					<Form.Label column sm="4">Height</Form.Label>
											<Col sm="8">
	    									<FormControl 
		     									placeholder="height"
    	  									aria-label="height"
      										aria-describedby="image-height"
													value={this.state.image.height}
													readOnly plaintext
    										/>
											</Col>
	   								</Form.Group>
									</Col>
								</Row>
						</Form>	
						</Col>
			  	</Row>
				</Container>
			: <Container>
				</Container>
			)
		) ;
	}
}

export default withRouter(Images) ;

