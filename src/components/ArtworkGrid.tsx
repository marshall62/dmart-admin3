import { IArtwork } from "models/artwork";
import { IConfig } from "models/config";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

import styles from "./ArtworkGrid.module.css";
import ConfigContext from "../contexts/ConfigContext";
import { useContext } from "react";

export default function ArtworkGrid({ artworks, handleEditArtwork, handleShowImage, handleDeleteArtwork}) {
  const configContext = useContext(ConfigContext);  

  const deleteArtwork = async (id) => {
    if (window.confirm("Delete this artwork " + id)) {
      handleDeleteArtwork(id);      
    }
  };


  return (
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
          <th></th>
        </tr>
      </thead>

      <tbody>
        {artworks.map((a, index) => (
          <tr key={index}>
            <td>
              {configContext?.config?.imageRootURI ? <img
                height={70}
                alt=""
                onClick={() => handleShowImage(a.imagePath)}
                src={configContext.config.imageRootURI + "/" + a.imagePath}
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
      </tbody>
    </Table>
  );
}
