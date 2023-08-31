# React + Vite

To run the dev version locally:

`npm run dev`

This will run on 

`http://localhost:5173/`

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Information about Dmart3 web app for davidmarshall.us

Repos:  
https://github.com/marshall62/dmart3 : React UI + calls to backend (MongoAtlas)
https://github.com/marshall62/dmart: images folder of all the artworks (+ old Angular code for UI)

https://github.com/marshall62/dmart-admin3:  React UI for administrating the website. Talks to mongo atlas directly using mongoatlas realm sdk for web

https://github.com/marshall62/dmart-api: Python FastAPI Back end for admin to modify the mongo db.   No longer in use except there are Python
utilities I use for resizing and renaming image files to prepare them for push to github


Back end:
MongoAtlas: https://cloud.mongodb.com/v2/615490640c90e4261e121d89#/clusters

React is using the Mongodb Realm Web SDK to query the database:  Doc: 
https://www.mongodb.com/docs/realm/web/

I have locally install Mongo Db Compass which connects to the db with URI (in secrets.txt file)


Domain Name:  GoDaddy:  https://dcc.godaddy.com/manage/davidmarshall.us/dns
Website Hosting: Vercel: https://vercel.com/marshall62/dmart3

# Adding images to the Website
This is currently managed using dmart-admin (a React app) that needs to be reworked.
It currently requires that I run a local Python backend (dmart-api) which makes changes to the mongo db. 

See the instructions in dmart-api for starting the app:
`source serve.sh` 
dmart-admin: 
`npm start&` : localhost:3000

The dmart repo in github is where images must be placed.  This is done using git push
on this repo after image directories are modified locally

There are also tools within the dmart-api for doing things like resizing images and renaming the image files in the directories.  There are instructions within the repo for doing these things.

# TODO

Eliminating the Python dmart-api.  This would require that the dmart-admin UI work as a MongoDb Realm Web app.  It would require a more complex login that what the dmart3 UI (which uses anonymous login) uses so that it can modify and create records in the db.

The tools for resizing images and directory manipulation could be built into the dmart-admin UI but that would call into question the tools I've written in python for doing this

# Deploying a change to Website UI.

Simply make a change to the code and push it Github dmart3 repo.  Github has a configuration which automatically deploys this to vercel when there is a push.
N.B.  Vercel didn't run the site correctly until I rebuilt the site from scratch under the vite framework rather than using create-react-app