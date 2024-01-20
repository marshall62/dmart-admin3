import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { FaPencilAlt, FaTrash, FaImage } from "react-icons/fa";

import styles from "./ArtworkGrid.module.css";
import ConfigContext from "../contexts/ConfigContext";
import { useContext, useEffect, useState } from "react";
import { rawImageURL } from "../utils";

export default function ArtworkGrid({ artworks, imageAdded=false, handleEditArtwork, handleShowImage, handleDeleteArtwork, handleImageUpload}) {
  const configContext = useContext(ConfigContext);  
  const [count, setCount] = useState(0);

  const deleteArtwork = async (id) => {
    if (window.confirm("Delete this artwork " + id)) {
      handleDeleteArtwork(id);      
    }
  };

  const handleClick = () => {
    setCount(count+1);
  }

  useEffect(() => {
    console.log("render for image added", artworks);
    setCount(count+1);
    // causes the render of the component if the imageAdded changes
  }, [imageAdded, artworks]);


  return (
    <>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          <th>title</th>
          <th>year</th>
          <th>dimensions</th>
          <th>price</th>
          <th>media</th>
          <th>filename</th>
          <th>Active</th>
          <th>Image</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {artworks.map((a, index) => (
          <tr key={index}>
            <td>
              {configContext?.config?.imageRootURI && a.imagePath ? <img
                height={70}
                alt={a.title + " image"}
                onClick={() => handleShowImage(a.imagePath)}
                src={rawImageURL(configContext.config,a.imagePath, 'thumb') }
              ></img> 
              : <span/>}
            </td>
            <td>{a.title}</td>
            <td>{a.year}</td>
            <td>
              {a.width} {a.width ? "x" : ""} {a.height}
            </td>
            <td>{a.isSold ? "sold" : a.price}</td>
            <td>{a.media}</td>
            <td>{a.imagePath}</td>
            <td>{!a.isActive ? "No" : ""}</td>
            {/* <td>{a.imagePath ? <> </> : <Button 
              onClick={() => handleImageUpload(a)}><FaImage/></Button>}</td>
            <td> */}
            <td><Button 
              onClick={() => handleImageUpload(a)}><FaImage/></Button>
            </td>
            <td>
              <div className={styles.buttondiv}>
                <Button
                  variant="outline-primary"
                  data-testid="editButton"
                  onClick={() => handleEditArtwork(a)}
                >
                  <FaPencilAlt />
                </Button>
                <Button
                  variant="outline-danger"
                  data-testid="deleteButton"
                  onClick={() => deleteArtwork(a._id)}
                >
                  <FaTrash />
                </Button>
              </div>
            </td>
          </tr>
        ))}
        <td><tr>{count}</tr></td>
      </tbody>
      
    </Table>
    {/* <img
                height={70}
                onClick={() => handleShowImage(artworks[artworks.length-1].imagePath)}
                src={rawImageURL(configContext.config,artworks[artworks.length-1].imagePath, 'thumb') }
              ></img>  */}
    </>
   
  );
}
