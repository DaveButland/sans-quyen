import React, {Fragment } from "react";
//import cookie from "react-cookies" ;
import {Container, Navbar, Nav} from "react-bootstrap" ;
import { LinkContainer } from "react-router-bootstrap";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
//import SelectedImage from "./portfolioSelectedImage";

import "./portfolio.css"

class Portfolio extends React.Component {

	constructor(props, context) {
    super(props, context);

		this.state = {
			albumId: '229e6318-3ca3-4ba7-8865-eed8b92fc233',
			album: 'portfolio',
			images: [],
			photos: [],
			modelIsOpen: false,
			currentImage: 0, 
      height: window.innerHeight, 
			width: window.innerWidth, 
		 }
		 
		 this.updateDimensions = this.updateDimensions.bind(this) ;
//		 this.imageRenderer = this.imageRenderer.bind(this);
//		 this.columns = this.columns.bind(this);
	}

	componentDidMount() {
		window.addEventListener("resize", this.updateDimensions);
		this.getPublicImages() ;
		this.updateDimensions() ;
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
  }

	updateDimensions = () => {
    this.setState({
      height: window.innerHeight, 
			width: window.innerWidth,
		});
	}

	openLightbox = ( event, { photo, index } ) => { 
		console.log( event ) ;
		console.log( index ) ;
    this.setState(state => ({ modalIsOpen: true, currentImage: index }));
	}
	
	closeLightbox = () => {
    this.setState(state => ({ modalIsOpen: false, currentImage: 0 }));
  };

	getPublicImages = async () => {
		var xhr = new XMLHttpRequest();

		xhr.onerror = function () {
			console.log( "Error getting portfolio images" ) ;
		}

		xhr.onload = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				let response = JSON.parse( xhr.response ) ;

//				this.props.security.getAccessToken().then( function (accessToken ) { console.log( accessToken.getJwtToken() )} ) ;
			
				// check if logged in before setting cookie. Only set these cookies if not logged in

//				var key       = response.cookies["CloudFront-Key-Pair-Id"] ;
//				var policy    = response.cookies["CloudFront-Policy"] ;
//				var signature = response.cookies["CloudFront-Signature"] ;
				var images    = response ;

				images.forEach( image => image.src = "https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200" ) ;

				var photos = images.map( image => { 
					return({
						src:"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1500"
					,	srcSet: [
							"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-300 300w"
						+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-600 600w"
						+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-900 900w"
						+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200 1200w"
						]
					,	sizes: ["(min-width: 480px) 50vw,(min-width: 1024px) 33.3vw,100vw"]
					, width: image.width
					, height: image.height
					, caption: "Credit: " + image.credit 
					}) 
				}) ;

				try {
//					cookie.save( "CloudFront-Key-Pair-Id", key ) ;
//					cookie.save( "CloudFront-Policy", policy ) ;
//					cookie.save( "CloudFront-Signature", signature ) ;
				} catch( err ) { 
					console.log( err ) ;
				}

				this.setState( { images: images, photos: photos } ) ;
			} else {
				console.log( "Error getting portfolio images " ) ;

//				cookie.remove( "CloudFront-Key-Pair-Id" ) ;
//				cookie.remove( "CloudFront-Policy" ) ;
//				cookie.remove( "CloudFront-Signature" ) ;
			}
		}.bind(this) ;
		
		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums/'+this.state.albumId+'/images', true ) ;
//		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums/f7b63276-0be4-4658-9d9c-cc620dc6aba5/images', true ) ;
//		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/images/public?domain='+process.env.REACT_APP_HTML_DOMAIN, true ) ;
		xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
		
		xhr.send();
	}
	
	/* If using direction="columns" columns={this.columns} */
	columns = (containerWidth) => {
		let columns = 1;
		if (containerWidth >= 500) columns = 2;
		if (containerWidth >= 900) columns = 3;
		if (containerWidth >= 1500) columns = 4;
		return columns;
	}

	/* renderImage={this.imageRenderer} - needs work
		toggleSelectAll = () => {
//			setSelectAll(!selectAll);
		};
	
		imageRenderer = (index, left, top, key, photo) => {
			return (
			<SelectedImage
				selected={false}
//				selected={selectAll ? true : false}
				key={key}
				margin={"2px"}
				index={index}
				photo={photo}
				left={left}
				top={top}
			/>
			);
		}
	*/
			
	render()
	{
		const { modalIsOpen } = this.state;
		
		return (
 	  	<Container fluid style={{ paddingTop:'70px', paddingLeft: 5+'%', paddingRight: 5+'%' }}>
			{ !modalIsOpen
        ? <Navbar style={{paddingTop:0, paddingLeft:'5%', paddingRight:'5%'}} bg="white" variant="light" fixed="top" expand="lg">
						<Navbar.Brand className="quyen-contact">
						</Navbar.Brand>
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
				: <Fragment></Fragment>}
				<div className="portfolio-container" >
				<LinkContainer to="/">
					<h1 className="quyenle-name" align="center"><a href="/">Quyen Le</a></h1>
				</LinkContainer>
 				<Gallery 
					photos={this.state.photos} 
					onClick={this.openLightbox} 
					margin={5}
//					targetRowHeight={ this.state.width / 3 }
					targetRowHeight={500}
//					direction="column"
//					columns={this.columns}
				/>
				</div>
        <Navbar bg="white" variant="light" sticky="bottom">
					<Navbar.Brand><small>&copy; Quyen Le 2019</small></Navbar.Brand>
				</Navbar>
				<ModalGateway>
        	{modalIsOpen ? (
						<Modal 
							onClose={this.closeLightbox}
							styles={{
								blanket: base => ({
									...base,
									backgroundColor: '#000',
								}),
								positioner: base => ({
									...base,
									display: 'block',
								}),
							}}
						>
							<Carousel
								currentIndex={this.state.currentImage}
								views={this.state.photos} 
							/>
          	</Modal>
        	) : null}
      	</ModalGateway>
			</Container>
	  );
	}
}

export default Portfolio ;