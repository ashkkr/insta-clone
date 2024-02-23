import { Box, useToast, Button, Card, CardBody, CardFooter, CardHeader, Center, Divider, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Link } from "react-router-dom"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { imageSelecteed, imagefileselected, isCreateModal, nextClicked } from "../../atoms/atoms";
import useUploadImage from "../../hooks/useUploadImage";
import { useState } from "react";
import { PostDataInterface } from "../../interfaces/postinterfaces";

function Home() {

    return <>
        <Box display="flex" flexDirection="row" justifyContent="center" marginTop="2vh">
            <FeedComponent></FeedComponent>
            <SideDetails></SideDetails>
        </Box>
        <CreateModal></CreateModal>
        <CreateCaption></CreateCaption>
    </>
}

function SideDetails() {
    return <Box display="flex" flexDirection="column">
        <UserProfile></UserProfile>
        <Suggestedtofollow>
        </Suggestedtofollow>
    </Box>
}

function UserProfile() {
    return <Box minWidth="200px" display="flex" flexDirection="row" padding="5" alignItems="center">
        <ProfilePicture></ProfilePicture>
        <Username></Username>
    </Box>
}

export function ProfilePicture() {
    return <Link to={'/myprofile'}>
        <Image boxSize="50px" borderRadius="full" src="/src/assets/AshutoshSangwan.jpg"></Image></Link>
}

function Username() {
    return <Box flexGrow="1" marginLeft={5}>
        <Text fontSize="small" fontWeight="600">username</Text>
        <Text fontSize="small" fontWeight="300">Name User</Text>
    </Box>
}

function Suggestedtofollow() {
    return <Card padding="5">
        Please follow me
    </Card>
}

function FeedComponent() {
    return <Box>
        <SinglePost></SinglePost>
        <SinglePost></SinglePost>
    </Box>

}

function SinglePost() {
    return <Box width="30vw" height="70vh">
        <Card>
            <CardHeader>
                <Text>I posted this</Text>
            </CardHeader>
            <CardBody>
                This is my picture
            </CardBody>
            <CardFooter>
                Like here
            </CardFooter>
        </Card>
    </Box>
}

function CreateModal() {
    const [createModalValue, setCreateModalVal] = useRecoilState(isCreateModal);
    const { handleImage, imagedata, setimagedata } = useUploadImage()
    const [isnextClicked, setNextClicked] = useRecoilState(nextClicked)

    const handleCreateClose = () => {
        setCreateModalVal(false)
        setimagedata("")
        setNextClicked(false)
    }

    const openFileBrowser = () => {
        document.getElementById("uploadinput")?.click();
    }

    const nextClick = () => {
        setNextClicked(true)
        setCreateModalVal(false)
    }

    return <>
        <Modal isOpen={createModalValue && !isnextClicked} onClose={handleCreateClose}>
            <ModalOverlay></ModalOverlay>
            <ModalContent display="flex" boxSize="60vh">
                <ModalHeader display={"flex"} flexDirection={"row"} alignItems={"center"} padding={"10px"}>
                    <Text flexGrow={1} textAlign="center" fontSize='small'>Create New Post</Text>
                    {imagedata !== null && imagedata.length > 0 ?
                        <IconButton onClick={nextClick} height={"19.5px"} icon={<ArrowForwardIcon />} aria-label={""} bg={"transparent"} _hover={{ "backgroundColor": "transparent" }}></IconButton> :
                        <ModalCloseButton />
                    }
                </ModalHeader>
                <Divider></Divider>
                <ModalBody flexGrow="1" padding="0">
                    {imagedata !== null && imagedata.length > 0 ?
                        (<Image boxSize="" src={imagedata}></Image>) :
                        <Box position="relative" textAlign="center" top="40%" display="flex" flexDirection="column" gap="10px">
                            <Text>Drag photos and videos here</Text>
                            <Input onChange={handleImage} id="uploadinput" as="input" type="file" style={{ display: 'none' }}></Input>
                            <Button onClick={openFileBrowser} colorScheme="blue" size="sm" fontSize="small" width="40%" margin="auto">Select From Computer</Button>
                        </Box>
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}

function CreateCaption() {
    const [isNextClicked, setNextClicked] = useRecoilState(nextClicked)
    const [imagedata, setimagedata] = useRecoilState(imageSelecteed);
    const [captionText, setCaptionText] = useState("")
    const imagefile = useRecoilValue(imagefileselected)
    const toast = useToast()

    const handleCreateClose = () => {
        setNextClicked(false)
        setimagedata("")
    }

    const postImage = () => {
        if (localStorage.getItem('userId')) {

            const imageFormData = new FormData()

            const postdata: PostDataInterface = {
                userId: localStorage.getItem('userId') as string,
                caption: captionText,
                createdAt: Date.now()
            }

            imageFormData.append('postimage', imagefile)
            imageFormData.append('postdata', JSON.stringify(postdata));

            fetch("http://localhost:3000/create/createpost", {
                method: "POST",
                body: imageFormData,
                headers: {
                    "Authorization": localStorage.getItem('token') ?? ""
                }
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json()
                    }
                    else return new Error("Post could not be shared")
                })
                .then((data) => {
                    toast({
                        title: data.message,
                        status: 'success',
                        isClosable: true
                    })
                    handleCreateClose()
                })
                .catch((e) => {
                    console.error(e);
                })
        }
        else {
            console.error(`User not logged in`)
            //logout
        }
    }

    return <>
        <Modal isOpen={isNextClicked} onClose={handleCreateClose}>
            <ModalOverlay></ModalOverlay>
            <ModalContent display="flex" width={"auto"}>
                <ModalHeader display={"flex"} flexDirection={"row"} alignItems={"center"} padding={"10px"}>
                    <Text flexGrow={1} textAlign="center" fontSize='small'>Create New Post</Text>
                    <Button onClick={postImage} color={"blue.500"} bg={"transparent"} _hover={{ backgroundColor: "transparent" }}>Share</Button>
                </ModalHeader>
                <Divider></Divider>
                <ModalBody flexGrow="1" padding="0" display={"flex"} flexDirection={"row"}>
                    {imagedata !== null && imagedata.toString().length > 0 ?
                        (
                            <Box>
                                <Image boxSize="" src={imagedata.toString()}></Image>
                            </Box>)
                        : <></>
                    }
                    <Box bgSize={"40"} >
                        <Box>
                            <UserProfile></UserProfile>
                        </Box>
                        <Input name="captiontextfile" value={captionText} onChange={(e) => setCaptionText(e.target.value)} type="text" placeholder="Write a caption..." border={"none"}
                            _focus={{ "border": "none" }}>
                        </Input>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}

export default Home;