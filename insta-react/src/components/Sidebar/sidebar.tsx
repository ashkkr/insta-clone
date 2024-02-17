import { Box, Text } from "@chakra-ui/react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isCreateModal } from "../../atoms/atoms";

function Sidebar() {
    return <Box>
        <Navbar></Navbar>
        <Box>
            <Outlet />
        </Box>
    </Box>
}

function Navbar() {
    const setCreateModal = useSetRecoilState(isCreateModal);

    const openCreateModal = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()

        setCreateModal(true);
    }

    return <nav id="sidebars">
        <NavLink to="/home">
            Home
        </NavLink>
        <NavLink onClick={(e) => openCreateModal(e)} to={"/home"}>Create</NavLink>
    </nav>
}

export default Sidebar;