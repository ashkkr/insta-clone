import { Box, Card, Text, Image, Stack, useDisclosure, Button, Modal, ModalOverlay, ModalContent, Divider, Input } from "@chakra-ui/react";
import { useProfileDetails } from "../../hooks/useProfileDetails";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { focusedPost, postFullDetails, postModalView, profileDetails, profilePosts, profileimageurl } from "../../atoms/atoms";
import { usePostDetails, usePostFullDetails } from "../../hooks/usePostDetails";
import { ChatIcon, StarIcon } from "@chakra-ui/icons"
import { MetaPostDataInterface } from "../../interfaces/postinterfaces";
import { useState } from "react";
import { ProfilePicture } from "../homepage/home";

function ProfilePage() {
    return <Box>
        <ProfileSection></ProfileSection>
        <PostSection></PostSection>
        <PostModalView></PostModalView>
    </Box>
}

function ProfileSection() {
    useProfileDetails()
    const [profileDetailsVal, setProfileDetails] = useRecoilState(profileDetails)
    const [profileDataurl, setprofiledataurl] = useRecoilState(profileimageurl)

    return <Box padding={"40px"} display={"flex"} flexDirection={"row"} gap={"20px"}>
        <Image boxSize={"50px"} borderRadius={"full"} src={profileDataurl}></Image>
        <Box display={"flex"} flexDirection={"column"} gap={"5px"}>
            <Box>
                <Text>{profileDetailsVal.username}</Text>
            </Box>
            <Box display={"flex"} flexDirection={"row"} gap={"20px"}>
                <Text fontSize="14" fontWeight="600">{`${profileDetailsVal.countOfPosts ?? 0} posts`}</Text>
                <Text fontSize="14" fontWeight="600">{`${profileDetailsVal.countOfFollowers ?? 0} followers`}</Text>
                <Text fontSize="14" fontWeight="600">{`${profileDetailsVal.countOfFollowing ?? 0} following`}</Text>
            </Box>
            <Text fontSize="14" fontWeight="600">{profileDetailsVal.fullName}</Text>
        </Box>
    </Box>
}

function PostSection() {
    const [profilePostsVal, set] = useRecoilState(profilePosts)
    usePostDetails()

    return <Box display={"flex"} flexDirection={"row"} gap={"10px"}>
        {profilePostsVal.map((val) => {
            return <IndividualPost post={val}></IndividualPost>
        })
        }
    </Box>
}

function IndividualPost(props: any) {
    const [showLikeVal, setShowLike] = useState<boolean>(false)
    const setFocusedPost = useSetRecoilState(focusedPost)
    const setPostModalOpen = useSetRecoilState(postModalView)

    const showLike = () => {
        setShowLike(true)
    }
    const hideLike = () => {
        setShowLike(false)
    }

    const openModal = (val: MetaPostDataInterface) => {
        setFocusedPost(val)
        setPostModalOpen(true)
    }

    return <Box position={"relative"}>
        <Image boxSize={"200px"} src={props.post.imageDataUrl as string}></Image>
        <Box
            position="absolute"
            bottom={0}
            height={"100%"}
            width={"100%"}
            color={"white"}
            backgroundColor={"blackAlpha.400"}
            cursor={"pointer"}
            opacity={showLikeVal ? 1 : 0}
            onMouseEnter={showLike}
            onMouseLeave={hideLike}
            onClick={() => openModal(props.post)}
            transition="opacity 0.2s ease-in-out">
            <Stack direction="row" alignItems={"center"} height={"100%"} justifyContent={"space-evenly"}>
                <Text fontWeight="bold"><StarIcon /> {props.post.countOfLikes.toString()}</Text>
                <Text fontWeight="bold"><ChatIcon />  {props.post.countOfComments.toString()}</Text>
            </Stack>
        </Box>
    </Box>
}

function PostModalView() {
    const [postModalOpen, setPostModalOpen] = useRecoilState(postModalView)
    const [postDetails, setPostDetails] = useRecoilState(focusedPost)
    const [postFullDetailsVal, setpostFullDetails] = useRecoilState(postFullDetails)
    const [profileDetailsVal, setProfileDetails] = useRecoilState(profileDetails)
    const [profileDataurl, setprofiledataurl] = useRecoilState(profileimageurl)
    const resetPostDetails = useResetRecoilState(postFullDetails)
    usePostFullDetails(postDetails.postId as string)

    const closePostModal = () => {
        setPostModalOpen(false)
        resetPostDetails()
    }

    return <Modal isOpen={postModalOpen} onClose={closePostModal}>
        <ModalOverlay></ModalOverlay>
        <ModalContent maxWidth={"70rem"} minWidth={"50rem"}>
            <Box display={"flex"} flexDirection={"row"}>
                <Box maxWidth={"67%"}>
                    <Image src={postDetails.imageDataUrl as string}></Image>
                </Box>
                <Box flexGrow={"1"}
                    flexBasis={"33%"}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    maxWidth={"33%"}>
                    <Box>
                        <Box
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}
                            gap={"1rem"}
                            borderBottom={"1px solid black"}
                            borderColor={"blackAlpha.400"}
                            padding={"0.5rem"}>
                            <Image boxSize="2rem" borderRadius="full" src={profileDataurl}></Image>
                            <Text fontSize="small" fontWeight="600">{profileDetailsVal.username}</Text>
                        </Box>
                        <Box>
                            <UserCaption></UserCaption>
                            {postFullDetailsVal.comments.map((val) => {
                                return <EachComment commentDet={val}></EachComment>
                            })}
                        </Box>
                    </Box>
                    <Box>
                        <CommentFooter></CommentFooter>
                    </Box>
                </Box>
            </Box>
        </ModalContent >
    </Modal >
}

function CommentFooter() {
    const handleCommentSubmit = () => {
        fetch('http://localhost')
    }
    return <>
        <Input placeholder={"Add a comment..."} ></Input >
        <Button onClick={handleCommentSubmit}>Post</Button>
    </>
}

function UserCaption() {
    const profileDataurl = useRecoilValue(profileimageurl)
    const postDetailsVal = useRecoilValue(postFullDetails)
    const profileDetailsVal = useRecoilValue(profileDetails)

    return <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        gap={"1rem"}
        padding={"0.5rem"}>
        <Image boxSize="2.5rem" borderRadius="full" src={profileDataurl}></Image>
        <Text fontSize="small" fontWeight="600">{profileDetailsVal.username}</Text>
        <Text maxWidth={"60%"} fontSize="small" fontWeight="400">{postDetailsVal.caption}</Text>
    </Box >
}

function EachComment(props: any) {
    const [commentLiked, setCommentLike] = useState<boolean>(props.commentDet.isLiked)
    const [numLikes, setNumLikes] = useState<number>(props.commentDet.likes.length)
    const postDetailVal = useRecoilValue(postFullDetails)

    const likeComment = () => {
        if (commentLiked) {
            // unliking comment
            setCommentLike(!commentLiked)
            setNumLikes(numLikes - 1)

            fetch('http://localhost:3000/likecomment', {
                method: "POST",
                body: JSON.stringify({
                    postId: postDetailVal.postId,
                    commentId: props.commentDet.commentId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'userId': localStorage.getItem('userId') ?? ""
                }
            })
        }
        else {
            //liking comments
            setCommentLike(!commentLiked)
            setNumLikes(numLikes + 1)

            fetch('http://localhost:3000/unlikecomment', {
                method: "POST",
                body: JSON.stringify({
                    postId: postDetailVal.postId,
                    commentId: props.commentDet.commentId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'userId': localStorage.getItem('userId') ?? ""
                }
            })
        }
    }

    return <Box display={"flex"} flexDirection={"column"}>
        <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            gap={"1rem"}
            padding={"0 0.5rem"}>
            <Image boxSize="2.5rem" borderRadius="full" src={props.commentDet.profilepic}></Image>
            <Text fontSize="small" fontWeight="600">{props.commentDet.username}</Text>
            <Text maxWidth={"60%"} fontSize="small" fontWeight="400">{props.commentDet.text}</Text>
            <StarIcon boxSize={3} color={commentLiked ? "red.500" : "grey"} cursor={"pointer"} onClick={likeComment} />
        </Box>
        <Box display={"flex"} flexDirection={"row"} paddingLeft={"5rem"} gap={"1rem"}>
            <Text fontSize={"xx-small"}>19 h</Text>
            <Text fontSize={"xx-small"}>{numLikes} Likes</Text>
        </Box>
    </Box>
}

export default ProfilePage;