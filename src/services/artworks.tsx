import { IArtwork } from "../models/artwork";

export async function getArtworks (client): Promise<IArtwork[]> {
  if (!client)
    return [];
  const artworks = await client.db("artworks").collection("artwork").find({});
  const works: IArtwork[] = [];
  if (artworks) {
    artworks.forEach((work) => {
      works.push({
        _id: work._id,
        title: work.title || '',
        price: work.price || '',
        tags: work.tags || [],
        categoryName: work.categoryName || '',
        isSold: !!work.isSold,
        isActive: !!work.isActive,
        media: work.media || '',
        year: work.year || 0, 
        width: work.width || 0, 
        height: work.height || 0, 
        imagePath:work.imagePath || ''})
    } );
  }
  return works;
  
}

export async function updateArtwork (client, artwork:IArtwork) {
  if (client) {
    const artworks = await client.db("artworks").collection("artwork");
    const result = await artworks.updateOne({
      _id: artwork._id
    }, {
      $set: {
        title: artwork.title,
        price: artwork.price,
        width: artwork.width,
        height: artwork.height,
        media: artwork.media,
        year: artwork.year,
        isSold: artwork.isSold,
        isActive: artwork.isActive,
        tags: artwork.tags,
        categoryName: artwork.categoryName,
        imagePath: artwork.imagePath
      }
    });
    return {status: result.modifiedCount > 0 ? 200 : 404, artwork}
  }
}

export async function deleteArtwork (client, id) {
  const result = await client.db("artworks").collection("artwork").deleteOne({_id: id});
  return {status: result.deletedCount > 0 ? 204 : 404};
}

export async function saveArtwork (client, artwork:IArtwork) {
  if (client) {
    const artworks = await client.db("artworks").collection("artwork");
    const result = await artworks.insertOne({
      title: artwork.title,
      price: artwork.price,
      media: artwork.media,
      width: artwork.width,
      height: artwork.height,
      categoryName: artwork.categoryName,
      isActive: artwork.isActive,
      isSold: artwork.isSold,
      tags: artwork.tags,
      imagePath: artwork.imagePath,
    });
    return {status: result ? 201 : 404, artwork:{...artwork, _id: result.insertedId}}
  }
}

export async function cloneArtworkCollection (client) {
  let works = await getArtworks(client);
  works = works.map((a) => {
    delete a._id;
    return a;
  });
  const res = client.db("artworks").collection("artwork").insertMany(works)
  console.log(res);
}