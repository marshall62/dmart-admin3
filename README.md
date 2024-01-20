# React + Vite

To run the dev version locally:

`npm run dev`

This will run on 

`http://localhost:5173/`


# Information about Dmart3 web app for davidmarshall.us

Repos:  
https://github.com/marshall62/dmart3 : React UI + calls to backend (MongoAtlas)
https://github.com/marshall62/dmart: images folder of all the artworks (+ old Angular code for UI)

https://github.com/marshall62/dmart-admin3:  React UI for administrating the website. Talks to mongo atlas directly using mongoatlas realm sdk for web

https://github.com/marshall62/dmart-api: Python FastAPI Back end for admin to modify the mongo db.   No longer in use.  It also has
utilities I used to use for resizing and renaming image files to prepare them for push to github


Back end:
MongoAtlas: https://cloud.mongodb.com/v2/615490640c90e4261e121d89#/clusters

React is using the Mongodb Realm Web SDK to query the database:  Doc: 
https://www.mongodb.com/docs/realm/web/

I have locally install Mongo Db Compass which connects to the db with URI (in secrets.txt file)


Domain Name:  GoDaddy:  https://dcc.godaddy.com/manage/davidmarshall.us/dns
Website Hosting: Vercel: https://vercel.com/marshall62/dmart3

Required:  Github account with personal access token (PAT).  These are then stored in .env.development.local

# Adding images to the Website (updated 1/2024)
Adding artwork to the website is currently managed using this app.  It uses an API to a mongoAtlas cloud database.
The images for the website are uploaded to github.

Process:

Run the app with `npm run dev`
Click on the + button to add an artwork.  Give it some information about the artwork but do not give an image file name.  Save
You will see a new row in the artwork table with upload-image button in a rightmost column.  Click this to upload an image.
This will automatically upload the image to github in three different sizes.  It will also name the image file with an index one greater than the highest numbered index.  
 
 The images are in this repo: https://github.com/marshall62/dmart  

# TODO 


Currently this app is not deployed to the cloud.  I run it locally only.  The login is in preparation for deployment to cloud

Bug:  When an image is uploaded it returns to the artwork grid but the thumbnail doesn't show up in the grid.
There is a GET request to download the image thumbnail from github but it is giving back a 404 for some reason.  Perhaps it takes a while before the image is really there and the UI is fetching too soon.

Its weird that I can't upload an image more than once to an artwork.  I think its just because I 
made the button visible only when the artwork has no image file.  This isn't good.  The previous image will also be left in the repo as junk.  So uploading a second image really should delete the previous one from the repo and then upload one with that same name.

Deleting artworks, doesn't delete the image from github.  This is because we are trying to maintain a sequence of image files with a numbering scheme.   It should be possible to delete a file from the repo without breaking things though.

If I deploy to vercel, .env needs to be adjusted so it can connect to github

# Deploying a change to Website UI.

Simply make a change to the code and push it Github dmart3 repo.  Github has a configuration which automatically deploys this to vercel when there is a push.
N.B.  Vercel didn't run the site correctly until I rebuilt the site from scratch under the vite framework rather than using create-react-app