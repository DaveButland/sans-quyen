import React from "react";
import {Button} from "react-bootstrap";

import "./photo.css" ;

const imgWithClick = { cursor: "pointer" };

const Photo = ({ index, onClick, onDelete, photo, margin, direction, top, left }) => {
	const imgStyle = { margin: margin };
	
  if (direction === "column") {
    imgStyle.position = "absolute";
    imgStyle.left = left;
		imgStyle.top = top;
  }

  const handleClick = event => {
		console.log( event ) ;
    onClick(event, { photo, index });
  };

  const handleDelete = event => {
    onDelete(event, photo, event.currentTarget.id );
  };

  return (
		<div className="photo-container">
			<img className="photo-image" style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle} {...photo} onClick={onClick ? handleClick : null} alt="img" />
			<Button id={index} className="close" type="close" aria-label="Close"><span aria-hidden="true" onClick={onDelete ? handleDelete : null }>&times;</span></Button>
		</div>	
 	);
};

export default Photo;
