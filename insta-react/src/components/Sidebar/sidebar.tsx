import { Box, Heading, Text, color } from "@chakra-ui/react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isCreateModal } from "../../atoms/atoms";
import './sidebar.css'

function Sidebar() {
    return <Box display={"flex"} flexDirection={'row'} gap={40}>
        <Box borderRight={"1px solid black"} borderColor={"blackAlpha.400"} width={"40"} height={"100vh"}>
            <Heading size='md' padding={"10px"}>Instagram</Heading>
            <Navbar></Navbar>
        </Box>
        <Box>
            <Outlet />
        </Box>
    </Box >
}

function Navbar() {
    const setCreateModal = useSetRecoilState(isCreateModal);

    const openCreateModal = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()

        setCreateModal(true);
    }

    const logoutUser = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
    }

    return <nav id="sidebars" style={{ display: "flex", flexDirection: "column", height: "90%", justifyContent: "space-between" }}>
        <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
            <NavLink to="/home">
                Home
            </NavLink>
            <NavLink onClick={(e) => openCreateModal(e)} to={"/home"}>Create</NavLink>
        </Box>
        <NavLink to={"/login"} onClick={logoutUser}>Log out</NavLink>
    </nav>
}

export default Sidebar;