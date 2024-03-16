import { Box, Card, Divider, Heading, Input, Text, color, Image, Hide } from "@chakra-ui/react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isCreateModal, profilePictures, searchedUsers } from "../../atoms/atoms";
import './sidebar.css'
import { useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import { SuggestUserInterface } from "../../interfaces/userInterfaces";

function Sidebar() {
    const [searchBoxShow, setSearchBoxShow] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");
    const setUsersList = useSetRecoilState(searchedUsers)
    const { searchUser } = useSearch()

    const showSearch = () => {
        setSearchBoxShow(true)
    }

    const hideSearch = () => {
        setSearchText("")
        setSearchBoxShow(false)
        setUsersList([])
    }

    const changeSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
        searchUser(e.target.value)
    }

    return <><Box display={"flex"} flexDirection={'row'} gap={40}>
        <Card
            display={"block"}
            left={searchBoxShow ? "157px" : "-250px"}
            zIndex={"base"}
            transition={"left 1s ease"}
            position={"absolute"}
            bg={"white"}>
            <Heading size={"md"} padding={"10px"}>Search</Heading>
            <Input value={searchText} onChange={(e) => changeSearchText(e)} height={"2rem"} border={"none"} type="text" placeholder="Search" backgroundColor={"blackAlpha.200"} focusBorderColor="gray"></Input>
            <Box position="relative" padding="20px 0">
                <Divider></Divider>
            </Box>
            <ResultList hideSearch={hideSearch}></ResultList>
        </Card>
        <Box bg={"white"} zIndex={"docked"} borderRight={"1px solid black"} borderColor={"blackAlpha.400"} width={"40"} height={"100vh"}>
            <Heading size='md' padding={"10px"}>Instagram</Heading>
            <Navbar searchBoxShow={searchBoxShow} showSearch={showSearch} hideSearch={hideSearch}></Navbar>
        </Box>
        <Box>
            <Outlet />
        </Box>
    </Box>
    </>
}

function Navbar(props: any) {
    const setCreateModal = useSetRecoilState(isCreateModal);

    const openCreateModal = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()

        setCreateModal(true);
    }

    const toggleSearchBox = () => {
        console.log(props.searchBoxShow)
        if (props.searchBoxShow == true) {
            props.hideSearch()
        }
        else {
            props.showSearch()
        }
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
            <Text cursor={"pointer"} onClick={() => toggleSearchBox()}>Search</Text>
            <NavLink onClick={(e) => openCreateModal(e)} to={"/home"}>Create</NavLink>
        </Box>
        <NavLink to={"/login"} onClick={logoutUser}>Log out</NavLink>
    </nav>
}

function ResultList(props: any) {
    const profilePicMap = useRecoilValue(profilePictures)
    const searchedUserList = useRecoilValue(searchedUsers)

    return <Box display={"flex"} flexDirection={"column"} gap={"0.5rem"}>
        {
            searchedUserList.map(val => {
                return <>
                    <Link to={`myprofile/${val.userId}`} onClick={() => props.hideSearch()}>
                        <Box display={"flex"} flexDirection={"row"} gap={'0.5rem'} alignItems={"center"} justifyContent={"flex-start"}>
                            <Image borderRadius={"full"} boxSize={"2rem"} src={profilePicMap.get(val.userId ?? "")}></Image>
                            <Text>{val.username}</Text>
                        </Box >
                    </Link>
                </>
            })
        }
    </Box>
}

export default Sidebar;