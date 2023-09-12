import styles from "./Dashboard.module.css";
import { useContext, useEffect, useState } from "react"
import { GrAdd } from "react-icons/gr";
import Button from "react-bootstrap/Button";
import ImageModal from "./modals/ImageModal"
import EditModal from "./modals/EditModal"
import { IArtwork } from "../models/artwork";
import ConfigContext from "../contexts/ConfigContext";
import ArtworkGrid from "./ArtworkGrid";
import { deleteArtwork, getArtworks, saveArtwork, updateArtwork } from "../services/artworks";
import MongoContext from "../contexts/MongoContext";
import GlobalContext from "../contexts/GlobalContext";
import ImageUploader from "./modals/imageUpload";

export default function Dashboard ({loggedIn= false}) {

  const configContext = useContext(ConfigContext);
  const mongoContext = useContext(MongoContext);
  const globalContext = useContext(GlobalContext);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [artworkToEdit, setArtworkToEdit] = useState<IArtwork>({} as IArtwork);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [artworks, setArtworks] = useState<IArtwork[]>([]);

  useEffect(() => {
    async function init() {
      const works = await getArtworks(mongoContext.client);
      setArtworks(works);
    }
    if (loggedIn)
      init();
  }, [loggedIn]);
  

  const handleEditArtwork = async (artwork: IArtwork) => {
    setArtworkToEdit(artwork);
    setShowEditorModal(true);
  };

  const handleShowImageModal = (imagePath: string) => {
    setShowImageModal(true);
    setImageUrl(configContext.config?.imageRootURI + "/midsize/" + imagePath + "?raw=true");
  };

  const handleImageUpload = (artwork: IArtwork) => {
    setShowImageUpload(true);
    setArtworkToEdit(artwork);
  };

  const handleImageUploadComplete = async (uploadedFilename) => {
    artworkToEdit.imagePath = uploadedFilename;
    console.log("Updating filename to ", uploadedFilename)
    await updateArtwork(mongoContext.client, artworkToEdit); 
    setShowImageUpload(false);
  }

  const handleCloseImageUpload = () => {
    setShowImageUpload(false);
  }


  const handleAdd = () => {
    setArtworkToEdit({ tags: [] } as IArtwork);
    setShowEditorModal(true);
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  }

  const handleDeleteArtwork = async (id) => {
    const {status} = await deleteArtwork(mongoContext.client, id);
      if (status === 204) {
        setArtworks(artworks.filter((aw) => aw._id !== id));
      }
  }

  const handleSaveEditModal = async (work: IArtwork) => {
    updateTagSet(work.tags);
    handleCloseEditModal();
    let  res;
    const exists = !!work._id;
    console.log("Saving work ", work);
    // Serious Issue:  During testing in Dashboard (line 94) the test results in EditModal calling this function
    // with an artwork that has undefined tags and _id - probably all fields are undefined.  This makes all
    // the logic within this do the wrong thing (e.g. the exists gets set to false and then it runs the logic for new artworks
    // rather than patching existing)  Why is this empty artwork sent to this?
    if (exists) {
      res = await updateArtwork(mongoContext.client, work); 
        }
    else {
      res = await saveArtwork(mongoContext.client, work);
    }
    let {status, artwork} = res;

    if (status === 201 && !exists) {
      setArtworks([...artworks, artwork]);
    } 
    else if (status === 200 && exists) {
      const ix = artworks.findIndex((x) => artwork._id === x._id);
      const newList = artworks.slice(); // clone
      newList.splice(ix, 1, artwork); // replace
      setArtworks(newList);
    }
  };

  const updateTagSet = (artworkTags: string[] = []) => {
    const newTags = artworkTags.some(tag => !globalContext.tags.has(tag))

    if (newTags) {
      const newset = new Set<string>(globalContext.tags);
      artworkTags.forEach((t) => newset.add(t));
      globalContext.setTags(newset);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditorModal(false);   
  };

  console.log("iamgeRootURI",configContext.config)
  if (!loggedIn)
    return(<span>Please Login</span>);
  else return (
    
     <main className={styles.main}>

      {/* <Head>
        <title>{config.artist} Admin</title>
        <meta name="description" content="data administratior for dm art" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <div className={styles.controlContainer}>
        <div>
          <h1 className={styles.title}>
            <a>{configContext.config?.artist} Admin</a>
          </h1>
        </div>
        <div>
          <Button data-testid="addArtwork" onClick={handleAdd}>
            <GrAdd />
          </Button>
        </div>
      </div>
      <ImageModal
        url={imageUrl}
        show={showImageModal}
        handleClose={handleCloseImageModal}
        
      ></ImageModal>
      <EditModal
        artwork={artworkToEdit}
        show={showEditorModal}
        handleClose={handleCloseEditModal}
        handleSave={handleSaveEditModal}
      >
      </EditModal>
      <ImageUploader 
        artworks={artworks} 
        show={showImageUpload} 
        handleClose={handleCloseImageUpload}
        handleImageUploadComplete={handleImageUploadComplete}
        />     

      <ArtworkGrid
        artworks= {artworks}
        handleEditArtwork={handleEditArtwork}
        handleShowImage={handleShowImageModal}
        handleDeleteArtwork={handleDeleteArtwork}
        handleImageUpload={handleImageUpload}
      ></ArtworkGrid>
    </main>
    
  );

}