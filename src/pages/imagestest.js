import React from "react";
import {withRouter} from "react-router-dom";
import {Container, Navbar, ToggleButtonGroup, ToggleButton, Button, Image, Row, Col, Card} from "react-bootstrap" ;

import "./imagestest.css"

class ImagesTest extends React.Component {

	constructor(props, context) {
    super(props, context);

		this.state = {
			isLoaded: false
		,	imageid: "920335e6-3b65-4932-8f99-63aaa93a4ce9"
		, image: null
		, screen: { width: null, height: null }
		, type: "fill"
		}
	}

	componentDidMount = () => {
		window.addEventListener('resize', this.updateDimensions);
		if ( this.props.match.params.imageid ){
			this.getImage( this.props.match.params.imageid ) ;
			this.updateDimensions() ;
		}
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
				this.setState( { imageid: this.props.match.params.imageid, image: null, isLoaded: false } )
				this.getImage( this.props.match.params.imageid ) ;
			}
			else {
				this.setState( { imageid: null, image: null } );
			}
		}	
	}  
				 
  updateDimensions = () => {
		const row = document.getElementsByClassName('imageboundscard')[0] ;
		var clientWidth = 0 ;
		var clientHeight = 0 ;

		if ( row ) {
			clientWidth = row.clientWidth ;
			clientHeight = row.clientHeight ;
		}

		this.setState( { screen: { width: window.innerWidth, height: window.innerHeight }
									 , parent: { width: clientWidth, height:clientHeight } 
									 } 
									);
	}

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

	handleChange = ( type ) => { 
		this.setState( { type: type } ) ;
	}

	calculateOffset = ( image, window ) => {
		var scaledImage = { width: 0, height: 0, centre: { x: 0, y: 0 }, offset: { x: 0, y: 0 } } ;

		image.centre = { x: ( image.centreX || ( image.width / 2 ) ), y: ( image.centreY || ( image.height / 2 )) } ;

		scaledImage.width = Math.round( image.width * window.height / image.height ) ;
		scaledImage.height = Math.round( image.weight * window.width / image.width ) ;
		scaledImage.centre.x = Math.round( image.centre.x * window.height / image.height ) ;
		scaledImage.centre.y = Math.round( image.centre.y * window.width / image.width ) ;

		scaledImage.offset.x = Math.round( scaledImage.centre.x -  ( window.width / 2 ) ) ;
		if ( scaledImage.offset.x < 0 ) { scaledImage.offset.x = 0 } ; 
		if ( scaledImage.offset.x > scaledImage.width - window.width ) { scaledImage.offset.x = scaledImage.width - window.width ; }  

		scaledImage.offset.y = Math.round( scaledImage.centre.y -  ( window.height / 2 ) ) ;
		if ( scaledImage.offset.y < 0 ) { scaledImage.offset.y = 0 } ; 
		if ( scaledImage.offset.y > scaledImage.height - window.height ) { scaledImage.offset.y = scaledImage.height - window.height ; }  

		return scaledImage.offset ;
	}

	render() {

		const { image, isLoaded, screen, type } = this.state ;

		var window ;
		const row = document.getElementsByClassName('imageboundscard')[0] ;
		if ( row ) {
			window = { width: row.clientWidth, height: row.clientHeight } ;
		} else {
			window = { height: screen.height/2 } ;
		}
		var source = "" ;
		var imageStyle = {height:"100vh",width:"auto", display:"block", marginLeft:"auto", marginRight:"auto"} ;

		if ( isLoaded ) {
			source = "https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+'-1800' ;
			if ( type === "fit" ){
				if ( image.height * window.width / image.width > window.height ) { imageStyle.height=window.height; imageStyle.width="auto" }
				else { imageStyle.height="auto"; imageStyle.width=window.width} ;
			} else if ( type === "fill" ) {
				var imageOffset = this.calculateOffset( image, window ) ;
				if ( image.height * window.width / image.width < window.height ) { 
					imageStyle.height=window.height; 
					imageStyle.width="auto" ;
					imageStyle.position="relative" ;
					imageStyle.top = 0;
					imageStyle.left=-imageOffset.x ;
				} else { 
					imageStyle.height="auto"; 
					imageStyle.width=window.width ;
					imageStyle.position="relative" ;
					imageStyle.top=-imageOffset.y ;
					imageStyle.left=0 ;
				} 
			}
		}

		console.log( window, imageStyle ) ;

		return (
			<Container style={{margin: 0, padding: '70px'}}>
				<Navbar bg="white" variant="light" fixed="top">
					<Navbar.Brand>Images</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav">
								<ToggleButtonGroup className="ml-auto justify-content-end" size="sm" type="radio" name="options" value={this.state.type} onChange={this.handleChange}>
									<ToggleButton variant="success" size="sm" value={"1:1"}>1:1</ToggleButton>
									<ToggleButton variant="success" size="sm" value={"fit"}>Fit</ToggleButton>
									<ToggleButton variant="success" size="sm" value={"fill"}>Fill</ToggleButton>
								</ToggleButtonGroup>
								<Button className="m-1" size="sm" variant="primary" >Back</Button>
						</Navbar.Collapse>
					</Navbar>
				{( isLoaded 
				?	<Row>
						<Col sm={4} style={{padding:'5%'}}>
							<Card>
								<Card.Header>{( image ? ( image.title ? image.title : "Untitled" ): "" )}</Card.Header>
								<div className="imageboundscard">
									<Card.Img draggable="false"  style={imageStyle} src={source} />
								</div>
								<Card.Footer>Photographer: Dave Butland</Card.Footer>
							</Card>
						</Col>
						<Col sm={4} style={{padding:'5%'}}>
							<Card>
								<Card.Header>{( image ? ( image.title ? image.title : "Untitled" ): "" )}</Card.Header>
								<div className="imageboundscard">
									<Card.Img draggable="false"  style={imageStyle} src={source} />
								</div>
								<Card.Footer>Photographer: Dave Butland</Card.Footer>
							</Card>
						</Col>
					</Row>
				: <div></div>
				)}
			</Container>
		) ;
	}
}

export default withRouter(ImagesTest) ;

