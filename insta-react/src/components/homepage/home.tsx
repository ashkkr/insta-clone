import { Box, useToast, Button, Card, CardBody, CardFooter, CardHeader, Center, Divider, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { ArrowForwardIcon, StarIcon, ChatIcon } from "@chakra-ui/icons"
import { Link } from "react-router-dom"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { focusedPost, imageSelecteed, imagefileselected, isCreateModal, nextClicked, postModalView, profileDetails, profilePictures, profileimageurl } from "../../atoms/atoms";
import useUploadImage from "../../hooks/useUploadImage";
import { useEffect, useRef, useState } from "react";
import { MetaPostDataInterface, PostDataInterface } from "../../interfaces/postinterfaces";
import { useProfileDetails } from "../../hooks/useProfileDetails";
import { useGetFeed, useTestRender } from "../../hooks/useGetFeed";
import { useProfilePicture } from "../../hooks/useProfilePicture";
import { useLikeUnlikePost } from "../../hooks/useLikeUnlike";
import { usePostFullDetails } from "../../hooks/usePostDetails";
import { PostModalView } from "../profilepage/profilepage";

function Home() {
    return <>
        <Box width={"60vw"}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            marginTop="2vh"
            gap={"2rem"}>
            <FeedComponent></FeedComponent>
            <SideDetails></SideDetails>
        </Box>
        <CreateModal></CreateModal>
        <CreateCaption></CreateCaption>
        <PostModalView></PostModalView>
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
    useProfileDetails()
    const profileDetailsVal = useRecoilValue(profileDetails)
    const profilePicVal = useRecoilValue(profileimageurl)

    return <Box minWidth="200px" display="flex" flexDirection="row" padding="5" alignItems="center">
        <ProfilePicture url={profilePicVal}></ProfilePicture>
        <Username details={profileDetailsVal}></Username>
    </Box>
}

export function ProfilePicture(props: any) {
    return <Link to={'/myprofile'}>
        <Image boxSize="50px" borderRadius="full" src={props.url}></Image>
    </Link>
}

function Username(props: any) {
    return <Box flexGrow="1" marginLeft={5}>
        <Text fontSize="small" fontWeight="600">{props.details.username}</Text>
        <Text fontSize="small" fontWeight="300">{props.details.fullName}</Text>
    </Box>
}

function Suggestedtofollow() {
    return <Card padding="5">
        Please follow me
    </Card>
}

// to check is state change inside a custom hook re-renders the component -> yes it does
function TestComponent() {
    const { testRender } = useTestRender()
    const renderCount = useRef(0)
    renderCount.current = renderCount.current + 1

    return <Text>{renderCount.current + "counts"}</Text>
}

function FeedComponent() {
    const { refreshFeed, userFeed } = useGetFeed()
    const renderCounter = useRef(0)
    renderCounter.current = renderCounter.current + 1
    useEffect(() => {
        refreshFeed()
    }, [])

    return <Box>
        {userFeed.map((val) => {
            return <SinglePost details={val}></SinglePost>
        })}
    </Box>
}

function SinglePost(props: any) {
    const profilePicMap = useRecoilValue(profilePictures)
    const [isPostLiked, setPostLiked] = useState<boolean>(props.details.isPostLiked)
    const [numLikes, setNumLikes] = useState<number>(props.details.likeCount)
    const numComments = props.details.commentCount;
    const { likeunlikepost } = useLikeUnlikePost(props.details.postId, setPostLiked, numLikes, setNumLikes)
    const { refreshPost } = usePostFullDetails(props.details.postId)
    const setPostModalOpen = useSetRecoilState(postModalView)
    const setFocusedPost = useSetRecoilState(focusedPost)


    const openModal = (val: string) => {
        const fillerVal: MetaPostDataInterface = {
            countOfLikes: 0,
            countOfComments: 0,
            postId: "",
            imagePath: "",
            imageDataUrl: val
        }
        setFocusedPost(fillerVal)
        refreshPost()
        setPostModalOpen(true)
    }

    return <Box width="30vw">
        <Card>
            <CardHeader padding={"1rem"} display={"flex"} flexDirection={"row"} gap={"0.8rem"} alignItems={"center"}>
                <Image
                    src={profilePicMap.get(props.details.userId) ?? ""}
                    boxSize={"2rem"}
                    borderRadius={"full"}
                ></Image>
                <Text fontSize="small" fontWeight="600">{props.details.username}</Text>
            </CardHeader>
            <CardBody padding={"0"}>
                <Image src={props.details.imageDataUrl}></Image>
            </CardBody>
            <CardFooter display={"flex"} flexDirection={"column"} padding={"1rem 0.3rem"}>
                <Box display={"flex"} flexDirection={"row"} gap={"1rem"} alignContent={"center"}>
                    <StarIcon onClick={() => likeunlikepost(isPostLiked)} color={isPostLiked ? "red.500" : " grey"} cursor={"pointer"} />
                    <ChatIcon onClick={() => openModal(props.details.imageDataUrl)} cursor={"pointer"} />
                </Box>
                <Box padding={"0.5rem 0 0.3rem 0"}>
                    <Text fontSize={"small"} fontWeight={"600"}>{numLikes ?? 0} likes</Text>
                </Box>
                <Box>
                    <Text fontSize={"small"}><span style={{ fontWeight: "600" }}>{props.details.username}</span>  {props.details.caption}</Text>
                    {numComments > 0 ?
                        <Text cursor={"pointer"} fontSize={"small"} fontWeight={"400"} color={"grey"}>View all {numComments} {numComments > 1 ? "comments" : "comment"}</Text> :
                        <Text cursor={"pointer"} fontSize={"small"} fontWeight={"400"} color={"grey"}>Add a comment</Text>
                    }
                </Box>
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