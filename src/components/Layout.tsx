import { Outlet } from "react-router-dom";
import AppNav from "../AppNav";
import MongoContext from "../contexts/MongoContext";
import { useContext } from "react";

export default function Layout ({loggedIn}) {

  return(
    <div>
      <AppNav loggedIn={loggedIn}/>
      <Outlet/>
    </div>
  )
}