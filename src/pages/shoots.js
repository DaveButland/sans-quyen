import React from "react";
import { Container, Card, Row, Col, Button, Modal, ProgressBar, FormControl, InputGroup, Navbar, Nav } from "react-bootstrap";
//import {LinkContainer} from "react-router-bootstrap" ;
import arrayMove from "array-move" ;
import SortableGallery from "./sortablegallery";
import EXIF from "exif-js" ;

//import { LinkContainer } from "react-router-bootstrap" ;

import "./shoots.css"

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

class Shoots extends React.Component {

	constructor(props, context) {
		super(props, context);
		
		this.fileInputRef = React.createRef();

		this.state = {
			isLoading: false,
			modalIsOpen: false, 
			showAddImages: false,
			updated: false,
			shootid: null, 
			folder: null,
			folders: [],
			images: [], 
			files: [],
			uploadProgress: {},
			uploading: false,
			addpressed: false
		}

		this.onBack = this.onBack.bind(this);

		this.onImageSelect = this.onImageSelect.bind(this) ;

		this.openFileDialog = this.openFileDialog.bind(this);
		this.onFilesAdded = this.onFilesAdded.bind(this);
		this.onFilesAddedButton = this.onFilesAddedButton.bind(this) ;

		this.handleShowAddShoot = this.handleShowAddShoot.bind(this) ;
		this.handleCancelAddShoot = this.handleCancelAddShoot.bind(this) ;
		this.handleActionAddShoot = this.handleActionAddShoot.bind(this) ;
	}

	componentDidMount = () => {
		this.setState({ isLoading: true });

		this.getFolders() ;
	}

	componentWillUnmount = () => {
	}
	
	static getDerivedStateFromProps(nextProps, prevState) {

//		console.log( 'Devived State' ) ;

		if ( nextProps.match.params.shootid !== prevState.shootid ) {
			return ( { shootid: nextProps.match.params.shootid } ) ;
		} else {
			return null ;
		}
	}
		 
	componentDidUpdate(prevProps, prevState) {
	
//		console.log( 'Did Update' ) ;

		if ( prevState.shootid !== this.props.match.params.shootid ) 
		{
			if ( this.props.match.params.shootid ) {
				var folder = this.state.folders.filter( folder => folder.folderId === this.props.match.params.shootid ) ;
				this.getShootImages( this.props.match.params.shootid ) ;
				this.setState( { shootid: this.props.shootid, folder: folder[0], images: [] } )
			}
			else {
				this.setState( { shootid: null, folder: null, images: [] } );
			}
		}
	}  
		 
	getFolders = () => {
		this.props.security.getAccessToken().then( function( accessToken ) {
			var xhr = new XMLHttpRequest();

			xhr.onerrror = function( error ) {
				console.log( "Error getting folder", error ) ;
			}

			xhr.onload = function () {
				var folders = JSON.parse(xhr.responseText);
				if (xhr.readyState === 4 && xhr.status === 200) {
					folders.sort( compareFolders ) ;
					var folder = folders.filter( folder => folder.folderId === this.props.match.params.shootid ) ; // in case someone hits the url directly
					if ( this.props.match.params.shootid ) {
						this.getShootImages( this.props.match.params.shootid ) ;
					}
					this.setState( { folders: folders, isLoading: false, folder: folder[0]  } ) ;
				} else {
					console.log( "Error getting folders") ;
				}
			}.bind(this) ;

			xhr.open("GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/folders', true);
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
			xhr.send() ;
		}.bind( this ) ) ;
	} 

	addShoot( name ) {
		this.props.security.getAccessToken().then( function( accessToken ) {
			var shoot = {};
			shoot.folderName = name ;
			var json = JSON.stringify(shoot);

			var xhr = new XMLHttpRequest();
			xhr.open("POST", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/folders', true);

			xhr.onerror = function () {
				alert( "Error" ) ;
			}

			xhr.onload = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					// get the folder id and set it as the current folder
					this.getFolders() ;
				} else {
					alert( "Error creating shoot") ;
				}
			}.bind(this);

			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
			xhr.send(json);
			
		}.bind(this));
	}

	updateFolder = ( folder ) => {

	}

	deleteFolder= ( folder ) => {
		this.props.security.getAccessToken().then( function( accessToken ) {

			var xhr = new XMLHttpRequest();

			xhr.onerror = function() {
				console.log( "Error deleting folder" ) ;
			} ;

			xhr.onload = function () {
//				var album = JSON.parse(xhr.responseText);
				if (xhr.readyState === 4 && xhr.status === 200) {
//					this.setState( { page: page } ) ;
				} else {
					console.log( "Error deleting folder") ;
				}
			} ; //.bind(this) ;

			xhr.open("DELETE", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/folders/'+folder.folderid, true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );

			var json = JSON.stringify( folder ) ;
			xhr.send(json) ;
		}).catch ( function (error ) {
			console.log( "Error deleting folder", error ) ;
		});
	}
	
	deleteImage = ( image ) => {
		this.props.security.getAccessToken().then( function( accessToken ) {

			var xhr = new XMLHttpRequest();

			xhr.onerror = function() {
				console.log( "Error deleting image" ) ;
			} ;

			xhr.onload = function () {
//				var album = JSON.parse(xhr.responseText);
				if (xhr.readyState === 4 && xhr.status === 200) {
//					this.setState( { page: page } ) ;
				} else {
					console.log( "Error deleting image") ;
				}
			} ; //.bind(this) ;

			xhr.open("DELETE", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/folders/'+image.folderid+'/images/'+image.imageid, true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
			xhr.send() ;
		}).catch ( function (error ) {
			console.log( "Error deleting image", error ) ;
		});
	}
	
	getShootImages = ( shootid ) => {
		this.props.security.getAccessToken().then( function( accessToken ) {
			var xhr = new XMLHttpRequest();

			xhr.onerror = function () {
				console.log( "Error getting folder images for folder "+shootid ) ;
			}

			xhr.onload = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					let response = JSON.parse( xhr.response ) ;
					var shootImages = response ;

//				albumImages.forEach( image => image.src = "https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+image.folderId+"/"+image.imageId+"-1200" ) ;

					var images = shootImages.map( image => { 
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
						, caption: image.title
						, key: image.imageId 
						}) 
					}) ;

					this.setState( { images: images } ) ;
				} else {
					console.log( "Error getting shoot images for shoot "+shootid ) ;
				}
			}.bind(this) ;
		
			xhr.open( "GET", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/folders/'+shootid+'/images', true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
			xhr.send() ;
		}.bind(this)).catch ( function (error ) {
			console.log( "Error deleting image", error ) ;
		});
	}

	addImage = file => {
		return new Promise((resolve, reject) => {
			this.props.security.getAccessToken().then( function( accessToken ) {
				var image = { folderId: this.state.shootid, name: file.name, type: file.type, size: file.size, height: file.height, width: file.width } ;

				var json = JSON.stringify(image);

				var xhr = new XMLHttpRequest();

				xhr.onload = function () {
					if (xhr.readyState === 4 && xhr.status === 200) {
						var result = JSON.parse( xhr.response ) ;
						var signedURL = result.signedURL ;
						image   = result.image ;
						this.sendRequest(signedURL, file).then( function( value ) { 
							//this is the point that the image should be added to the database.
							this.updateImage( image ) ;
							resolve(xhr.response); 
						}.bind(this)) ;
					} else {
						alert( "Error creating new image") ;
						reject(xhr.response);
					}
				}.bind(this);

				xhr.open( "POST", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/images', true ) ; 
				xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
				xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
				xhr.send(json);
			}.bind(this)).catch ( function (error ) {
				console.log( "Error deleting image", error ) ;
			});
		});
	}

	updateImage = image => {
		this.props.security.getAccessToken().then( function( accessToken ) {

			var json = JSON.stringify( image ) ;

			var xhr = new XMLHttpRequest();

			xhr.onerror = function() {
				console.log( "Error updating image" ) ;
			} ;

			xhr.onload = function () {
//				var album = JSON.parse(xhr.responseText);
				if (xhr.readyState === 4 && xhr.status === 200) {
//					this.setState( { page: page } ) ;
				} else {
					console.log( "Error updating image") ;
				}
			} ; //.bind(this) ;

			xhr.open("PUT", 'https://'+process.env.REACT_APP_APIS_DOMAIN+'/images/'+image.imageId, true ) ;
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer '+accessToken.getJwtToken() );
			xhr.send(json) ;

		}).catch ( function (error ) {
			console.log( "Error updating image", error ) ;
		});
	}

	sendRequest(signedURL, file) {
		return new Promise((resolve, reject) => {
		
			const req = new XMLHttpRequest();
//			const reqsigned = new XMLHttpRequest();

			req.upload.addEventListener("progress", event => {
				if (event.lengthComputable) {
					const copy = { ...this.state.uploadProgress };
					copy[file.name] = {
						state: "pending",
						percentage: (event.loaded / event.total) * 100
					};
					this.setState({ uploadProgress: copy });
				}
			});

			req.upload.addEventListener("load", event => {
				const copy = { ...this.state.uploadProgress };
				copy[file.name] = { state: "done", percentage: 100 };
				this.setState({ uploadProgress: copy });
				resolve(req.response);
			});

			req.upload.addEventListener("error", event => {
				const copy = { ...this.state.uploadProgress };
				copy[file.name] = { state: "error", percentage: 0 };
				this.setState({ uploadProgress: copy });
				reject(req.response);
			});
		
		// Tempted to use both signed URL and custom authenticator here
		// It is both belt and braces, and unnecessary as you won't be able to get the signed URL without the JWT token
		// but it will demonstrate the security of the platform and mean that we generate unique 
		// also want to use Federated Identity Pools to ensure that only the right people can write files

			req.open("PUT", signedURL );
//			req.setRequestHeader( "Authorization", "Bearer "+this.props.token );
			req.send(file) ;
		});
	}

	getExif( files ) {
		files.map( file => {
    	var fr = new FileReader() ; // to read file contents

			fr.onload = function(ev) {
				var exif = EXIF.readFromBinaryFile( ev.target.result ) ;
				file.exif = exif ;
				return file ;
			};

			fr.readAsArrayBuffer(file);

			return file ;
		});
	}

	getFileData( files ) 
	{
		files.map( file => {
			this.getFileDimensions( file ) ;
			return file ;
		});
	}

	getFileDimensions( file, callback ) 
	{
		var img = new Image() ;

		img.onload = function() {
			file.height = img.height ;
			file.width  = img.width ;
		}

		img.src = URL.createObjectURL( file ) ;
	}

	getImageData( images )
	{
		images.map( image => {
			this.getImageDimensions( image ) ;
			return image ;
		}) ;
	}

	getImageDimensions( image ) 
	{
		var img = new Image() ;

		img.onload = function() {
			image.height = img.height ;
			image.width  = img.width ;
		}

		img.src = 'https://'+process.env.REACT_APP_HTML_DOMAIN+'/thumbnail/'+image.folderId+'/'+image.imageId+'-300' ;
	}

  fileListToArray(list) {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
	}

  onFilesAddedButton(evt) {
    const files = evt.target.files;

		const array = this.fileListToArray(files);
		this.onFilesAdded(array);
		this.handleAddImagesShow() ;
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: files
		}));
		this.getFileData( files );
		this.getExif( files ) ;
	}

	openLightbox = ( event, { photo, index } ) => { 
		console.log( event ) ;
		console.log( index ) ;
    this.setState(state => ({ modalIsOpen: true, currentImage: index }));
	}
	
	closeLightbox = () => {
    this.setState(state => ({ modalIsOpen: false, currentImage: 0 }));
  };

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

	openFileDialog() {
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
  }

	onImageSelect = ( eventKey, event ) => {
		
		var folder = this.state.folder ;

		if ( eventKey === 'cover' ) {
			folder.cover.folder = folder.images[event.target.id].folder ;
			folder.cover.image  = folder.images[event.target.id].image ;
		} else if ( eventKey === 'remove' ) {
			folder.images.splice( event.target.id, 1 ) ;
		}

		this.setState( { folder: folder } ) ;
	}

	handleChange = event => {

		var folder = this.state.folder ;

		folder[event.target.id] = event.target.value ;

    this.setState( { folder: folder } ) ;		
	}

	handleChecked= event => {
		var folder = this.state.folder ;

		folder[event.target.id] = event.target.checked ;

    this.setState( { folder: folder } ) ;		
	}

	handleImageClick = event => {
		if ( event.target.id === "overlay" )
		{
			this.props.history.push('/folders/'+event.target.parentNode.id) ;
		}
	}

	handleFolderClick = event => {
		this.props.history.push('/shoots/'+event.target.parentNode.id) ;
	}

	handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
	}
	
	handleShowAddShoot() {
    this.setState({ newShootName: '', showAddShoot: true });
  }

  handleCancelAddShoot() {
    this.setState({ showAddShoot: false });
  }

  handleActionAddShoot() {
		this.addShoot( this.state.newShootName ) ;

		this.setState({ showAddShoot: false });
	}
	
	renderAddShoot() {
		return (
			<Modal show={this.state.showAddShoot} onHide={this.handleCancelAddShoot}>
				<Modal.Header closeButton>
					<Modal.Title>Create Shoot</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup className="mb-3">
			    	<InputGroup.Prepend>
      				<InputGroup.Text id="shootlabel">Shoot Name</InputGroup.Text>
    				</InputGroup.Prepend>
   		 			<FormControl
							id="newShootName"
      				placeholder="Shoot Name"
      				aria-label="ShootName"
							aria-describedby="shootlabel"
							value={this.state.newShootName}
							onChange={this.handleChange}
							autoFocus
    				/>
				  </InputGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.handleCancelAddShoot}>Cancel</Button>
					<Button variant="primary" onClick={this.handleActionAddShoot}>Create</Button>
				</Modal.Footer>
			</Modal>
		) ;
	}

	renderShoots() {
		return (
			<Container fluid style={{ marginTop: '70px', paddingLeft: '5%', paddingRight: '5%' }}>
				<Navbar style={{paddingLeft:'5%', paddingRight:'5%'}} bg="white" variant="light" fixed="top" expand="lg">
					<Navbar.Brand>Shoots</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="ml-auto justify-content-end">
						<Button variant="success" className='mt-2 mr-2' size='sm' onClick={this.handleShowAddShoot}>Add</Button> 
							<Button variant="primary" className='mt-2 mr-2' size='sm' onClick={this.onBack}>Back</Button>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Row>
					{ this.state.folders.map( ( folder, index ) => {
						var date ;
						var name ;
						if ( folder.folderName.startsWith("20") ) {
							date = folder.folderName.substring(0, 10);
							name = folder.folderName.substring(12) ;
						} else {
							date = '---'; 
							name = folder.folderName ;
						}
						return (
							<Col lg={2} key={folder.folderId} className={"px-1 py-1"} >
								<Card draggable className="text-center img-container" onClick={this.handleFolderClick} id={folder.folderId} key={folder.folderId} style={{height:250+'px'}} >
									<Card.Header>{name}</Card.Header>
									{ !folder.cover 
									? <div className="album-image" id={folder.folderId} >
											<Card.Img className="img-image" key={folder.folderId} style={{width:'auto', height:'100%'}} src='/camera.svg' alt={folder.folderName} />
										</div>
									: <div className="album-image" id={folder.folderId} >
											<Card.Img className="img-image" key={folder.folderId} style={{width:100+'%', height:'auto'}} src={"https://"+process.env.REACT_APP_HTML_DOMAIN+"/thumbnail/"+folder.cover.folderId+"/"+folder.cover.imageId+'-300' } alt={folder.folderName} />
										</div>
									}
									<Card.Footer>{date}</Card.Footer>
								</Card>
							</Col>
						) ;
					})}
				</Row>
				{this.renderAddShoot()}
			</Container>
		) ;
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({ images:arrayMove(this.state.images, oldIndex, newIndex)});
  };

	onSelectImage = (event, { photo } ) => {
//		console.log( 'Selected event ', event, photo ) ;
		this.props.history.push( '/images/' + photo.key + "?shoot="+this.state.shootid ) ;
	}

	onDeleteImage = (event, photo, index ) => {

//		console.log( 'delete ' + photo ) ;

		var images = this.state.images ;

		var filteredImages = images.filter(function(image){
			return image.key !== photo.key ;
		});

		// delete shoot image
//		var filteredAlbumImages = album.images.filter(function(image){
//			return image.image !== photo.key ;
//		});

//		album.images = filteredAlbumImages ;

		this.setState( { images: filteredImages } ) ;
	}

	renderShoot() {
		var folder = this.state.folder ;
		var images = this.state.images ;
//		const { modalIsOpen } = this.state;


		return (				
			<Container fluid style={{ marginTop: '70px', paddingLeft: '5%', paddingRight: '5%' }}>
				<Navbar style={{paddingLeft:'5%', paddingRight:'5%'}} bg="white" variant="light" fixed="top" expand="lg">
					<Navbar.Brand>{folder.folderName}</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="ml-auto justify-content-end">
							<Button variant="success" className='mt-2 mr-2' size='sm' onClick={this.openFileDialog}>Add</Button>
							<Button variant="secondary" className='mt-2 mr-2' size='sm' disabled onClick={this.openFileDialog}>Edit</Button>
							<Button variant="primary" className='mt-2 mr-2' size='sm' onClick={this.onBack}>Back</Button>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<input type="file" name="img" multiple ref={this.fileInputRef} onChange={this.onFilesAddedButton} style={{display:'none'}} accept=".jpg, .png, .jpeg, .gif|image/*"/>
				<SortableGallery 
					items={images} 
					onSortEnd={this.onSortEnd} 
					axis={"xy"} 
					onClick={this.onSelectImage} 
					onDelete={this.onDeleteImage}					
					margin={5}
					targetRowHeight={500}
				/>
				{this.renderAddImages()} 
			</Container>
		);
	}

	/*
	/			 	<Gallery 
//					photos={images} 
//					onClick={this.openLightbox} 
//					margin={5}
//					targetRowHeight={500}
//					direction="column"
//					columns={this.columns}
//				/>
*/

	handleAddImagesClose = () => {
		this.getShootImages( this.state.shootid ) ;
		this.setState( { showAddImages: false, files: [] } ) ;
	}

	handleAddImagesShow = () => {
		this.setState( { showAddImages: true, uploading: false, addpressed: false } ) ;
	}

	handleAddImageToggle = ( event ) => {
		var files = this.state.files ;

		files[event.currentTarget.id].deselected = !files[event.currentTarget.id].deselected ;

		this.setState( { files: files } ) ;
	}
	
	handleAddImagesAdd = async () => {

		this.setState({ uploadProgress: {}, uploading: true, addpressed: true });
		
		const promises = [];
		
		this.state.files.forEach(file => {
			if ( !file.deselected ) {
				promises.push(this.addImage(file));
			}
    });
		
		try {
			await Promise.all(promises);

			//remove files and refresh images
			
      this.setState({ successfullUploaded: true, uploading: false, refreshImages: true });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false, refreshImages: true });
    }
	}

  renderProgress(file) {
		const uploadProgress = this.state.uploadProgress[file.name];
		return (
			<ProgressBar className="mt-1" variant="secondary" now={uploadProgress ? uploadProgress.percentage : 0} label={`${uploadProgress ? Math.round(uploadProgress.percentage) : 0}%`} />
		)
	}

	renderAddImages() {
		var files = this.state.files ;

		return (
			<Modal size="lg" className="add-shoot-images" show={this.state.showAddImages}>
				<Modal.Header closeButton>
					<Modal.Title>Add Images</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{'maxHeight': 'calc(100vh - 200px)', 'overflowY': 'auto'}}>
					{ files.map( ( file, index ) => {
						return (
							<Card key={index} id={index} className="mb-2">
								<Card.Body className={ file.deselected ? "add-shoot-image" : "add-shoot-image-selected" }>
									<Card.Img id={index} src={URL.createObjectURL(file)} alt="Card Image" onClick={this.handleAddImageToggle}/>
										{this.renderProgress(file)}
										<InputGroup className="mt-1">
										<InputGroup.Prepend>
      									<InputGroup.Text id="basic-addon0">Credit</InputGroup.Text>
    									</InputGroup.Prepend>
    									<FormControl
      									placeholder="credit"
      									aria-label="credit"
      									aria-describedby="basic-addon0"
    									/>
   									</InputGroup>
										<InputGroup className="mt-1">
										<InputGroup.Prepend>
      									<InputGroup.Text id="basic-addon1">Title</InputGroup.Text>
    									</InputGroup.Prepend>
    									<FormControl
      									placeholder="title"
      									aria-label="title"
      									aria-describedby="basic-addon1"
    									/>
  									</InputGroup>
										<InputGroup className="mt-1">
										<InputGroup.Prepend>
      									<InputGroup.Text id="basic-addon2">Description</InputGroup.Text>
    									</InputGroup.Prepend>
    									<FormControl
      									placeholder="description"
      									aria-label="description"
      									aria-describedby="basic-addon2"
    									/>
  									</InputGroup>
									</Card.Body>
							</Card>
						);
					})}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" size="sm" disabled={this.state.uploading} onClick={this.handleAddImagesClose}>
						Close
					</Button>
					<Button variant="primary" size="sm" disabled={this.state.addpressed} onClick={this.handleAddImagesAdd}>
						Add
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
	
  render() {

		var { folder } = this.state ;

		return( 
			( !folder )
			?	this.renderShoots() 
			: this.renderShoot() 
		) ;
	}

}

export default Shoots ;