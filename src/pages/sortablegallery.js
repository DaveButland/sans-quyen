import React from "react" ;
import Gallery from "react-photo-gallery" ;
import {SortableContainer, SortableElement} from "react-sortable-hoc" ;
import Photo from "./photo"

const SortablePhoto = SortableElement((item) => <Photo {...item} />);

const SortableGallery = SortableContainer(({ items, onClick, onDelete, margin, targetRowHeight }) => {
	return ( 
		<Gallery 
			photos={items} 
			margin={margin}
			targetRowHeight={targetRowHeight}
			renderImage={props => <SortablePhoto {...props} onClick={onClick} onDelete={onDelete}/>} 
		/> 
	) ;
});

export default SortableGallery ;