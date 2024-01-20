import React, { useContext, useState } from "react";
import { ConfigContext, IConfigContext } from "../../contexts/ConfigContext";
import Resizer from "react-image-file-resizer";
import { Octokit } from "https://esm.sh/@octokit/rest";
// import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { IConfig } from "../../models/config";

function ImageUploader ({artworks, show, handleClose, handleImageUploadComplete}) {

  const configContext: IConfigContext = useContext(ConfigContext);
  const repo = import.meta.env.VITE_GITHUB_REPO;
  const user = import.meta.env.VITE_GITHUB_OWNER;
  // Github Settings | Developer Settings | Personal Access Token (classic)
  const githubToken = import.meta.env.VITE_GITHUB_ACCESS_TOKEN;

  const [file, setFile] = useState(null);


  const getFilename = () => {
    const fileNum = getMaxFilename() + 1;
    return `${configContext.config.filename}_${fileNum}.jpg`;
  }

  function getMaxFilename () {
    let max = 0;
    artworks.forEach(w => {
      let path = w.imagePath;
      if (path) {
        const [d,m,n] = path.split(".")[0].split("_");
        if (n)
          max = Math.max(Number(n), max);
      }
    });
    return max
    
  }

  const uploadFile = (file, newFilename) => {
    
    console.log("The new file will be ", newFilename)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const octokit = new Octokit({
      auth: githubToken,
    });
    const message = "delete me, uploaded by dmart-admin";
    reader.onloadend = () => {
      const content = reader.result.split(",")[1];
      doUpload("images/" + newFilename, content)
        .then(json => {
      Resizer.imageFileResizer(
            file,
            100,
            100,
            'JPEG',
            100,
            0,
            (uri) => {
              const path = `images/thumb/${newFilename}` ;    
              doUpload("images/thumb/" + newFilename,uri.split(',')[1])
                .then(json => {
                  Resizer.imageFileResizer(
                    file,
                    800,
                    800,
                    'JPEG',
                    100,
                    0,
                    (uri) => {
                      const path = "images/midsize/" + newFilename;
                      const message = "delete me, uploaded by dmart-admin";
                      doUpload("images/midsize/" + newFilename, uri.split(',')[1])
      
                    },
                    "base64");

                })

            },
            "base64");
      
      });
  }
}

  const doUpload = (path, content) => {
    const branch = "main";
    const message = "Uploaded image file from dmart-admin3";
      const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
      const options = {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message,
          content,
          path,
          branch,
        }),
      };
      return fetch(url, options)
        .then((res) => res.json())
        .catch((err) => console.error(err));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const newFilename = getFilename();
    uploadFile(file, newFilename);
    handleImageUploadComplete(newFilename);
  };

  const handleFileChange = (event) => {

    const file = event?.target?.files[0];
    setFile(file);
  };


 
    return (
      <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header data-testid="closeButton" closeButton></Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Image File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button type="submit" >Submit</Button>
        </Form>
      </Modal.Body>
      </Modal>);
  }


export default ImageUploader;
