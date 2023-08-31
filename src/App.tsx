import { useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import * as Realm from 'realm-web';
import './App.css'
import Layout from './components/Layout';
import ErrorPage from './components/ErrorPage';
import Login from './components/Login';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';
import MongoContext from './contexts/MongoContext';
import ConfigContext from './contexts/ConfigContext';
import { IConfig } from './models/config';
import GlobalContext from './contexts/GlobalContext';
import { cloneArtworkCollection, getArtworks } from './services/artworks';
import Home from './components/Home';
import { isAnon } from './utils';


function App() {
  const [client, setClient] = useState(undefined)
  const [user, setUser] = useState<Realm.User | null>(null)
  const [app, setApp] = useState<Realm.App>(new Realm.App({id: import.meta.env.VITE_REALM_APP_ID}))
  const [config, setConfig]: [IConfig | null, (x: IConfig | null) => void] = useState<IConfig | null>(null)
  const [allTags, setAllTags] = useState<Set<string>>(new Set<string>())
  const [tempFlag, setTempFlag] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  
  async function loginEmailPassword(email, password) {

    const credentials = Realm.Credentials.emailPassword(email, password);
    // Authenticate the user
    const user = await app.logIn(credentials);
    console.log("obtained real user",user)
    setLoggedIn(true);
    // `App.currentUser` updates to match the logged in user
    console.assert(user.id === app.currentUser.id);
    return user;
  }

  async function handleLogin (user, password) {
    const u = await loginEmailPassword(user,password);
    setUser(u);
  }

  async function handleLogout () {
    const res = await app.currentUser.logOut();
    setLoggedIn(false);
    setUser(null);
    setClient(undefined);
  }


  useEffect(() => {
    console.log("logged in ", loggedIn)
  }, [loggedIn])

  useEffect(() => {
    async function init () {  

      if (user && !client) {
        const cl = app.currentUser?.mongoClient('mongodb-atlas');
        console.log("obtained client",cl);
        setClient(cl);
        console.log('client',client)
      }
    }
    console.log('in useEffext', app);
    init();
  }, [app,client,user])

  useEffect(() => {
    async function init () {
      if (client) {
        const c = await client.db('artworks').collection('config').findOne({});
        console.log("obtained config",c);
        setConfig(c);
      }
    }
    init();
  }, [client, user])

  useEffect(() => {
    async function init () {
      if (client) {
        const works = await getArtworks(client);
        // if (tempFlag) {
        // cloneArtworkCollection(client)
        // setTempFlag(false);
        // }
        testFind();
        // testInsert2();
        // testUpdate();
        // testDelete();
        const allTags = extractTags(works);
        setAllTags(allTags);
      }
    }
    init();
  }, [client])

  async function testFind() {
    if (client) {
    const works = client.db("artworks").collection("artwork");
    const r = await works.findOne(
      {_id: {$oid: "641c968338b73774e7ef6452"}})
    console.log("artwork found", r)
    }
  }
  async function testUpdate () {
    if (client) {
    const works = client.db("artworks").collection("artwork");
    const r = await works.updateOne({_id: {$oid: "64e4d69d776524394289fb49"}},
    {$set: {price: 120}});
    console.log("artwork updated", r.modifiedCount)
    }
  }

  async function testUpdate2 () {
    if (client) {
    const works = client.db("artworks").collection("works");
    const r = await works.updateOne({_id: {$oid: "64e3ca91a1b31abc3940edcc"}},
    {$set: {title: "This wont succeed for some reason"}});
    console.log("works updated", r.modifiedCount)
    }
  }



  // go through all the tags of the artworks and build a comprehensive set of them.
const extractTags = (artworks: IArtwork[]): Set<string> => {
  const tags = new Set<string>();
  if (artworks) {
    console.log("artworks are", artworks);
    artworks.forEach((artwork) => artwork.tags?.forEach((tag) => tags.add(tag)));
  }
  return tags;
};

  const router = createBrowserRouter([
    {
      element: <Layout loggedIn={loggedIn}/>,
      errorElement: <ErrorPage/>,
      children: [
        {
          path: "/",
          element: <Dashboard loggedIn={loggedIn}/>
        },
        {
          path: "/login",
          element: <Login onLogin={handleLogin}/>
        },
        {
          path: "/logout",
          element: <Logout app={app} handleLogout={handleLogout}/>
        },
      ] 
    }
  ])

  return (
    <div>
      <MongoContext.Provider value={{app, client, user, setClient, setUser, setApp}}>
        <ConfigContext.Provider value={{config}}>
          <GlobalContext.Provider value={{tags:allTags, setTags:setAllTags}}>
            <RouterProvider router={router}/>
          </GlobalContext.Provider>
        </ConfigContext.Provider>
      </MongoContext.Provider>
    </div>
  )
}

export default App
