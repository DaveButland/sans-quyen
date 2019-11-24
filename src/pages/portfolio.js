import React from "react";
import cookie from "react-cookies" ;
import {Container, Navbar, Nav} from "react-bootstrap" ;
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

import "./portfolio.css"

class Portfolio extends React.Component {

	constructor(props, context) {
    super(props, context);

		this.state = {
			folderId: 'be4d4ba9-388c-4715-8634-cf5cf40d0f8c',
			album: 'portfolio',
			images: [],
			photos: [],
			modelIsOpen: false,
			currentImage: 0
 		}
	}

	openLightbox = ( event, { photo, index } ) => { 
		console.log( event ) ;
		console.log( index ) ;
    this.setState(state => ({ modalIsOpen: true, currentImage: index }));
	}
	
	closeLightbox = () => {
    this.setState(state => ({ modalIsOpen: false, currentImage: 0 }));
  };

	componentDidMount() {
		this.getPublicImages() ;
	}

	getPublicImages = async () => {
		var xhr = new XMLHttpRequest();

		xhr.onerror = function () {
			console.log( "Error getting home page images" ) ;
		}

		xhr.onload = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				let response = JSON.parse( xhr.response ) ;

//				this.props.security.getAccessToken().then( function (accessToken ) { console.log( accessToken.getJwtToken() )} ) ;
			
				// check if logged in before setting cookie. Only set these cookies if not logged in

				var key       = response.cookies["CloudFront-Key-Pair-Id"] ;
				var policy    = response.cookies["CloudFront-Policy"] ;
				var signature = response.cookies["CloudFront-Signature"] ;
				var images    = response.images ;

				images.forEach( image => image.src = "https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200" ) ;

				var photos = images.map( image => { 
					return({
						src:"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1500"
					,	srcSet: [
							"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-300 300w"
						,	"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-600 600w"
						,	"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-900 900w"
						,	"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200 1200w"
						,	"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1500 1500w"
						]
					,	sizes: ["(min-width: 480px) 50vw,(min-width: 1024px) 33.3vw,100vw"]
					, width: image.width
					, height: image.height
					, caption: image.title
					}) 
				}) ;

				try {
					cookie.save( "CloudFront-Key-Pair-Id", key ) ;
					cookie.save( "CloudFront-Policy", policy ) ;
					cookie.save( "CloudFront-Signature", signature ) ;
				} catch( err ) { 
					console.log( err ) ;
				}

				this.setState( { images: images, photos: photos } ) ;
			} else {
				console.log( "Error getting front page images " ) ;

				cookie.remove( "CloudFront-Key-Pair-Id" ) ;
				cookie.remove( "CloudFront-Policy" ) ;
				cookie.remove( "CloudFront-Signature" ) ;
			}
		}.bind(this) ;
		
		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/images/public?domain='+process.env.REACT_APP_HTML_DOMAIN, true ) ;
		xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
		
		xhr.send();
	}
	
	render()
	{
    const { modalIsOpen } = this.state;

		return (
  	  <Container fluid style={{ paddingTop:70, paddingLeft: 70, paddingRight: 70 }}>
				<Navbar style={{paddingTop:20, paddingRight:70}} bg="white" variant="light" fixed="top">
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="ml-auto">
     					<Nav.Link className="quyen-contact" href="/contact">Contact</Nav.Link>
    				</Nav>
					</Navbar.Collapse>
				</Navbar>
				<h1 className="quyenle-name" align="center">Quyen Le</h1>
 				<Gallery 
					photos={this.state.photos} 
					onClick={this.openLightbox} 
					margin={10}
					targetRowHeight={500}
				/>
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