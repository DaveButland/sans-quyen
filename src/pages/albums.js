import React, {useState} from "react";
//import { render } from "react-dom";
import { Container, Card, Row, Col, Button, Modal, Dropdown, FormControl, InputGroup } from "react-bootstrap";
//import { LinkContainer } from "react-router-bootstrap" ;

import arrayMove from "array-move";
import SortableGallery from "./sortablegallery" ;

import "./albums.css"

function compareFolders(a, b) {
  // Use toUpperCase() to ignore character casing
  const folderNameA = a.folderName.toUpperCase();
  const folderNameB = b.folderName.toUpperCase();

	let comparison = 0;
	
  if (folderNameA > folderNameB) {
    comparison = -1 ;
  } else if (folderNameA < folderNameB) {
    comparison = 1;
  }
  return comparison;
}

/*
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));
*/

const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            child =>
              !value || child.props.children.toLowerCase().includes(value.toLowerCase()),
          )}
        </ul>
      </div>
    );
  },
);

class Albums extends React.Component {
	constructor(props, context) {
    super(props, context);

		this.state = {
			showAddImages: false,
			isLoading: true,
			updated: false,
			shoots: [],
			shootid: null,
			folder: null,
			shootImages: [],
			albums: [],
			albumid: null, 
			album: null,
			images: []
		}

		this.onImageSelect = this.onImageSelect.bind(this) ;
		this.onShootSelect = this.onShootSelect.bind(this) ;
		this.onBack = this.onBack.bind(this);

		this.handleShowAddAlbum = this.handleShowAddAlbum.bind(this) ;
		this.handleCancelAddAlbum = this.handleCancelAddAlbum.bind(this) ;
		this.handleActionAddAlbum = this.handleActionAddAlbum.bind(this) ;
	}

	componentDidMount = () => {

//		console.log( 'componentDidMount' ) ;
		this.setState({ isLoading: true });

		this.getAlbums() ;
		this.getShoots() ;
	}

	componentWillUnmount = () => {
	}
	
	static getDerivedStateFromProps(nextProps, prevState) {

//		console.log( 'getDerivedStateFromProps ' + nextProps.match.params.albumid + " " + prevState.albumid + " " + (nextProps.match.params.albumid !== prevState.albumid)) ;

		if ( nextProps.match.params.albumid !== prevState.albumid ) {
			return ( { albumid: nextProps.match.params.albumid } ) ;
		} else {
			return null ;
		}
	}
		 
	componentDidUpdate(prevProps, prevState) {
	
//		console.log( 'componentDidUpdate ' + prevState.albumid + " " + this.props.match.params.albumid + " " + ( prevState.albumid !== this.props.match.params.albumid ) ) ;

		if ( prevState.albumid !== this.props.match.params.albumid )
		{
				if ( this.props.match.params.albumid ) {
					var album = this.state.albums.filter( album => album.albumid === this.props.match.params.albumid ) ;
					this.getAlbumImages( this.state.albumid ) ;
					this.setState( { albumid: this.props.albumid, album: album[0], images: [] } )
				}
				else {
					this.setState( { albumid: null, album: null, images: [] } );
				}
		}	
	}  
		 
	getShoots = () => {
		var xhr = new XMLHttpRequest();

		xhr.onerrror = function( error ) {
			console.log( "Error getting folder", error ) ;
		}

		xhr.onload = function () {
			var shoots = JSON.parse(xhr.responseText);
			if (xhr.readyState === 4 && xhr.status === 200) {
				shoots.sort( compareFolders ) ;
				this.setState( { shoots: shoots  } ) ;
			} else {
				console.log( "Error getting folders") ;
			}
		}.bind(this) ;

		xhr.open("GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/folders', true);
		xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
		xhr.send() ;
	} 

	getShootImages = ( shootid ) => {
		var xhr = new XMLHttpRequest();

		xhr.onerror = function () {
			console.log( "Error getting folder images for folder "+shootid ) ;
		}

		xhr.onload = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				let response = JSON.parse( xhr.response ) ;
				var shootImages = response ;

//				albumImages.forEach( image => image.src = "https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200" ) ;

//				var images = shootImages.map( ( image ) => { 
//					return({
//					,	srcSet: [
//							"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-300 300w"
//						+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-600 600w"
//						+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-900 900w"
//						+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200 1200w"
//						]
//					,	sizes: ["(min-width: 480px) 50vw,(min-width: 1024px) 33.3vw,100vw"]
//					, width: image.width
//					, height: image.height
//					, caption: image.title
//					, key: image.imageId 
//					}) 
//				}) ;

				this.setState( { shootid: shootid, shootImages: shootImages } ) ;
			} else {
				console.log( "Error getting shoot images for shoot "+shootid ) ;
			}
		}.bind(this) ;
		
		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/folders/'+shootid+'/images', true ) ;
//		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums/f7b63276-0be4-4658-9d9c-cc620dc6aba5/images', true ) ;
//		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/images/public?domain='+process.env.REACT_APP_HTML_DOMAIN, true ) ;
		xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
		
		xhr.send();
	}
	
	getAlbums = () => {
		this.props.security.getAccessToken().then( function( accessToken ) {
			var xhr = new XMLHttpRequest();

			xhr.onerrror = function( error ) {
				console.log( "Error getting albums", error ) ;
			}

			xhr.onload = function () {
				var albums = JSON.parse(xhr.responseText);
				if (xhr.readyState === 4 && xhr.status === 200) {
					var album = albums.filter( album => album.albumid === this.props.match.params.albumid ) ; // in case someone hits the url directly (doesn't work?)
					if ( this.props.match.params.albumid ) {
						this.getAlbumImages( this.props.match.params.albumid ) ;
					}
					this.setState( { albums: albums, isLoading: false, album: album[0]  } ) ;
				} else {
					console.log( "Error getting albums") ;
				}
			}.bind(this) ;

			xhr.open("GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums', true);
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
			xhr.send() ;
		}.bind(this)) ;
	}

	addAlbum = ( title ) => {
		this.props.security.getAccessToken().then( function( accessToken ) {
			var album = {};
			album.title = title ;
			album.cover = {} ;
			album.images = [] ;

			var json = JSON.stringify(album);

			var xhr = new XMLHttpRequest();

			xhr.onerror = function ( error ) {
				alert( "Error adding album" , error) ;
			}

			xhr.onload = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					// get the folder id and set it as the current folder
					this.getAlbums() ;
				} else {
					alert( "Error creating shoot") ;
				}
			}.bind(this);

			xhr.open("POST", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums', true);
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
			xhr.send(json);
		}.bind(this));
	}

	updateAlbum = ( album ) => {

		var json = JSON.stringify( album ) ;

//		this.props.security.getAccessToken().then( function( accessToken ) {

			var xhr = new XMLHttpRequest();

			xhr.onerror = function() {
				console.log( "Error updating album" ) ;
			} ;

			xhr.onload = function () {
//				var album = JSON.parse(xhr.responseText);
				if (xhr.readyState === 4 && xhr.status === 200) {
					this.getAlbumImages( album.albumid ) ;
					//					this.setState( { page: page } ) ;
				} else {
					console.log( "Error saving page") ;
				}
			}.bind(this) ;

			xhr.open("PUT", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums/'+album.albumid, true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
	//		xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
			xhr.send(json) ;
	//	}).catch ( function (error ) {
	//		console.log( "Error updating album", error ) ;
	//	});
	}

	deleteAlbum = ( album ) => {

		var json = JSON.stringify( album ) ;

		this.props.security.getAccessToken().then( function( accessToken ) {

			var xhr = new XMLHttpRequest();

			xhr.onerror = function() {
				console.log( "Error deleting album" ) ;
			} ;

			xhr.onload = function () {
//				var album = JSON.parse(xhr.responseText);
				if (xhr.readyState === 4 && xhr.status === 200) {
//					this.setState( { page: page } ) ;
				} else {
					console.log( "Error deleting album") ;
				}
			} ; //.bind(this) ;

			xhr.open("DELETE", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums/'+album.albumid, true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
			xhr.send(json) ;
		}).catch ( function (error ) {
			console.log( "Error deleting album", error ) ;
		});
	}

	getAlbumImages = ( albumId ) => {
		var xhr = new XMLHttpRequest();

		xhr.onerror = function () {
			console.log( "Error getting album images for album "+albumId ) ;
		}

		xhr.onload = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				let response = JSON.parse( xhr.response ) ;
				var albumImages = response ;

//				albumImages.forEach( image => image.src = "https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200" ) ;

				var images = albumImages.map( ( image, index ) => { 
					return({
						src:"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-900"
					,	srcSet: [
							"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-900 900w"
//						+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-600 600w"
//						+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-900 900w"
//						+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200 1200w"
						]
					,	sizes: ["(min-width: 480px) 50vw,(min-width: 1024px) 33.3vw,100vw"]
					, width: image.width
					, height: image.height
					, caption: image.credit
					, key: image.imageId
					}) 
				}) ;
				this.setState( { images: images } ) ;

			} else {
				console.log( "Error getting album images for album "+albumId ) ;
			}
		}.bind(this) ;
		
		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums/'+albumId+'/images', true ) ;
//		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/albums/f7b63276-0be4-4658-9d9c-cc620dc6aba5/images', true ) ;
//		xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/images/public?domain='+process.env.REACT_APP_HTML_DOMAIN, true ) ;
		xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
		
		xhr.send();
	}
	
	onBack = event => {
		event.preventDefault() ;

		this.props.history.goBack() ;
	}

	onSave = event => {
		event.preventDefault() ;

		this.updateAlbum( this.state.album ) ;
	}

	onDelete = event => {
		event.preventDefault() ;

//		this.deleteAlbum( this.state.album ) ;

//		albums = this.state.albums ;
//		albums.splice( album.albumid, 1 ) ;
	}

	onAlbumSelect = ( eventKey, event ) => {

	}

	onImageSelect = ( eventKey, event ) => {
		
		var album = this.state.album ;

		if ( eventKey === 'cover' ) {
			album.cover.folder = album.images[event.target.id].folder ;
			album.cover.image  = album.images[event.target.id].image ;
		} else if ( eventKey === 'remove' ) {
			album.images.splice( event.target.id, 1 ) ;
		}

		this.setState( { album: album } ) ;
	}

	handleChange = event => {

		var album = this.state.album ;

		album[event.target.id] = event.target.value ;

    this.setState( { album: album } ) ;		
	}

	handleChecked= event => {
		var album = this.state.album ;

		album[event.target.id] = event.target.checked ;

    this.setState( { album: album } ) ;		
	}

	handleAlbumClick = event => {
		//this.getAlbumImages
//		this.getAlbumImages( event.target.parentNode.id ) ;
		this.props.history.push('/albums/'+event.target.parentNode.id) ;
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({ images:arrayMove(this.state.images, oldIndex, newIndex)});
  };

	onShootSelect = ( eventKey, event ) => {

		var shootid = eventKey ;

		this.getShootImages( shootid ) ;
		this.setState( { shootid: shootid, shootImages: [] } ) ;
	}

	handleShowAddAlbum() {
    this.setState({ newAlbumName: '', showAddAlbum: true });
  }

  handleCancelAddAlbum() {
    this.setState({ showAddAlbum: false });
  }

  handleActionAddAlbum() {
		this.addAlbum( this.state.newAlbumName ) ;

		this.setState({ showAddAlbum: false });
	}
	
	handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
	}
	
	renderAddAlbum() {
		return (
			<Modal show={this.state.showAddAlbum} onHide={this.handleCancelAddAlbum}>
				<Modal.Header closeButton>
					<Modal.Title>Create Album</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup className="mb-3">
			    	<InputGroup.Prepend>
      				<InputGroup.Text id="albumlabel">Album Name</InputGroup.Text>
    				</InputGroup.Prepend>
   		 			<FormControl
							id="newAlbumName"
      				placeholder="Album Name"
      				aria-label="AlbumName"
							aria-describedby="albumlabel"
							value={this.state.newAlbumName}
							onChange={this.handleChange}
							autoFocus
    				/>
				  </InputGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.handleCancelAddAlbum}>Cancel</Button>
					<Button variant="primary" onClick={this.handleActionAddAlbum}>Create</Button>
				</Modal.Footer>
			</Modal>
		) ;
	}

	renderAlbums() {
		return (
			<Container fluid style={{ paddingLeft: 70, paddingRight: 70 }}>
				<Row>
					<Col>
						<h1 className="d-inline mt-3 mr-2">Albums</h1>
						<Button varient="primary" size="sm" className='float-right mt-2' onClick={this.onBack}>Back</Button>
						<Button variant="success" size="sm" className='float-right mt-2 mr-2' onClick={this.handleShowAddAlbum}>Add</Button>
					</Col>
				</Row>
				<Row>
					{ this.state.albums.map( ( album, index ) => {
						return (
							<Col lg={2} key={album.albumid} className={"px-1 py-1"} >
								<Card draggable className="text-center img-container" onClick={this.handleAlbumClick} id={album.albumid} key={album.albumid} style={{height:250+'px'}} >
									{ album.cover
									? <div className="album-image" id={album.albumid} >
											<Card.Img className="img-image" key={album.albumid} style={{width:100+'%', height:'auto'}} src={"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+album.cover.folder+"/"+album.cover.image+'-300' } alt="album.title" />
										</div>
									: <div></div>
									}
									<Card.Footer>{album.title}</Card.Footer>
								</Card>
							</Col>
						) ;
					})}
				</Row>
				{this.renderAddAlbum()}
			</Container>
		) ;
	}

	onSelectImage = (event) => {
		console.log( 'Selected event ', event ) ;
	}

	onDeleteImage = (event, photo, index ) => {
		var images = this.state.images ;
		var album = this.state.album ;

		var filteredImages = images.filter(function(image){
			return image.key !== photo.key ;
		});

		var filteredAlbumImages = album.images.filter(function(image){
			return image.image !== photo.key ;
		});

		album.images = filteredAlbumImages ;

		this.setState( { images: filteredImages, album: album } ) ;
	}

	handleAlbumSave = () => {

		var album = this.state.album ;
		var images = this.state.images ;
		var albumImages = [] ;

		//sort album images to match viewed images
		for( var i = 0 ; i < images.length ; i++ ) {
			for( var j = 0 ; j < album.images.length ; j++ ) {
				if ( album.images[j].image === images[i].key ) {
					albumImages.push( album.images[j] ) ;
				}
			}
		}

		album.images = albumImages ;
		this.updateAlbum( album ) ;
		this.setState( { album: album } ) ;
	}

	handleSliderChange = (event) => {
		console.log( event );
	}

	renderAlbum() {
		var album = this.state.album ;
		var images = this.state.images ;

		return (				
			<Container fluid style={{ paddingLeft: 70, paddingRight: 70 }}>
				<h1 className="d-inline mt-3 ml-2">{album.title}</h1>
				<Button variant="primary" className='float-right mt-2 mr-2' size="sm" onClick={this.onBack}>Back</Button>
				<Button variant="secondary" size="sm" className='float-right mt-2 mr-2' disabled>Edit</Button>
				<Button variant="success" size="sm" className='float-right mt-2 mr-2' onClick={this.handleAlbumSave}>Save</Button>
				<Button variant="success" size="sm" className='float-right mt-2 mr-2' onClick={this.handleAddImagesShow}>Add</Button>
				<SortableGallery 
					items={images} 
					onSortEnd={this.onSortEnd} 
					axis={"xy"} 
					onClick={this.onSelectImage} 
					onDelete={this.onDeleteImage}					
					margin={5}
					targetRowHeight={500}
				/>
				{ this.renderAddImages() }
			</Container>
		);
	}

	handleAddImagesClose = () => {
		this.setState( { showAddImages: false } ) ;
	}

	handleAddImagesShow = () => {
		this.setState( { showAddImages: true } ) ;
	}

	handleAddImagesAdd = () => {
		this.setState( { showAddImages: false } ) ;

		var shootImages = this.state.shootImages ;
		var album = this.state.album ;
		var images = this.state.images ;

		shootImages.map( ( image, index ) => {
			if ( image.selected )
			{
			var newAlbumImage = { image: image.imageId, folder: image.folderId } ;
				var newImage = { 
					src:"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-300"
				,	srcSet: [
					"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-300 300w"
//					+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-600 600w"
//					+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-900 900w"
//					+	", https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200 1200w"
					]
				,	sizes: ["(min-width: 480px) 50vw,(min-width: 1024px) 33.3vw,100vw"]
				, width: image.width
				, height: image.height
				, caption: image.title
				, key: image.imageId
				}

				album.images.push( newAlbumImage ) ;
				images.push( newImage ) ;

				image.selected = false ;
			}

			return image ;
		}) ;

//		this.updateAlbum( album ) ;
		//Could optimise this by getting the individual images

		this.setState( { album: album, shootImages: shootImages } ) ; 
	}

	handleAddImageToggle = ( event ) => {
		var shootImages = this.state.shootImages ;

		shootImages[event.currentTarget.id].selected = !shootImages[event.currentTarget.id].selected ;

		this.setState( { shootImages: shootImages } ) ;
	}
	
	renderAddImages() {
		var shootImages = this.state.shootImages ;
		var shoots = this.state.shoots ;

		return (
			<Modal size="lg" className="add-album-images" show={this.state.showAddImages} onHide={this.handleAddImagesClose}>
				<Modal.Header closeButton>
					<Modal.Title>
					<Dropdown>
    				<Dropdown.Toggle size="sm" id="dropdown-custom-components">
    				  Shoot
   				 	</Dropdown.Toggle>
    				<Dropdown.Menu as={CustomMenu} style={{maxHeight: "300px", overflowY: 'scroll' }}>
						{ shoots.map ( shoot => {
							return ( <Dropdown.Item key={shoot.folderId} id={shoot.folderId} eventKey={shoot.folderId} onSelect={this.onShootSelect}>{shoot.folderName}</Dropdown.Item> ) ;
						})}
    				</Dropdown.Menu>
  				</Dropdown>
				</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{'maxHeight': 'calc(100vh - 200px)', 'overflowY': 'auto'}}>
					{ shootImages.map( ( image, index ) => {
						return (
							<Card key={index} id={index} className="mb-2" onClick={this.handleAddImageToggle}>
								{ image.selected 
								? <Card.Body className="add-image-selected"><Card.Img className="add-image-selected" style={{width:100+'%', height:'auto'}}	src={"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-300"} alt="image.title" /></Card.Body>
								: <Card.Body className="add-image"><Card.Img className="add-image" style={{width:100+'%', height:'auto'}} src={"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-300"} alt="image.title" /></Card.Body>
								}	
							</Card>
						);
					})}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" size="sm" onClick={this.handleAddImagesClose}>
						Close
					</Button>
					<Button variant="primary" size="sm" onClick={this.handleAddImagesAdd}>
						Add
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
	
  render() {

		var album = this.state.album ;

		return( 
			( this.state.albums.length === 0 )
			? <Container></Container>
			: ( !album )
			? this.renderAlbums()
 			: this.renderAlbum() 
		) ;
	}

}

export default Albums ;


/*
						<Dropdown>
							<Dropdown.Toggle variant="success" id="dropdown-basic" size="sm" >
    						{album.title}
					 	 	</Dropdown.Toggle>
							<Dropdown.Menu>
								{ folders.map ( folder => {
									return ( <Dropdown.Item>{folder.folderName}</Dropdown.Item> ) ;
								})}
  						</Dropdown.Menu>
						</Dropdown>						




// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            child =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

render(
  <Dropdown>
    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
      Custom toggle
    </Dropdown.Toggle>

    <Dropdown.Menu as={CustomMenu}>
      <Dropdown.Item eventKey="1">Red</Dropdown.Item>
      <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
      <Dropdown.Item eventKey="3" active>
        Orange
      </Dropdown.Item>
      <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>,
);
*/