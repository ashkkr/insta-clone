import { ChakraProvider, Text } from "@chakra-ui/react";
import { Route, Router, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import SignUp from "./components/signup";
import { RecoilRoot, SetterOrUpdater } from "recoil";
import Home from "./components/homepage/home";
import Login from "./components/login/login";
import { ChangeEvent } from "react";
import ProfilePage from "./components/profilepage/profilepage";
import Sidebar from "./components/Sidebar/sidebar";

export function handleChange<T extends Object>(e: ChangeEvent<HTMLInputElement>, currVal: T, setFunc: SetterOrUpdater<T>) {
  return setFunc({ ...currVal, [e.target.name]: e.target.value })
}

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp></SignUp>
  },
  {
    path: "/",
    element: <Sidebar></Sidebar>,
    children: [
      {
        path: "home",
        element: <Home></Home>
      },
      {
        path: "/myprofile/:userId",
        element: <ProfilePage></ProfilePage>
      }
    ]
  },
  {
    path: "/login",
    element: <Login></Login>
  }
]);

function App() {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <RouterProvider router={router}></RouterProvider>
      </RecoilRoot>
    </ChakraProvider>
  )
}

export default App;