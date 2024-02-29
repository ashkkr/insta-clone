import { StarIcon, ChatIcon } from "@chakra-ui/icons"
import { Modal, ModalOverlay, ModalContent, Input, Button, Box, Image, Text } from "@chakra-ui/react"
import { useState, useRef, useEffect } from "react"
import { useRecoilState, useResetRecoilState, useRecoilValue } from "recoil"
import { postModalView, postFullDetails, profileDetails, profileimageurl, modalPostImageDataUrl, profilePictures } from "../../atoms/atoms"
import { useLikeUnlikePost } from "../../hooks/useLikeUnlike"
import { usePostFullDetails } from "../../hooks/usePostDetails"

export function PostModalView() {
    const profilePicMap = useRecoilValue(profilePictures)
    const [postModalOpen, setPostModalOpen] = useRecoilState(postModalView) // to open the modal
    const postFullDetailsVal = useRecoilValue(postFullDetails) // gets the full details including comments about the post

    // gets the imageurl of the post, separate from postfulldetails so that
    // post image does not wait for the fetch call to complete
    const postimageurl = useRecoilValue(modalPostImageDataUrl)
    // to reset atoms
    const resetPostDetails = useResetRecoilState(postFullDetails)

    const closePostModal = () => {
        setPostModalOpen(false)
        resetPostDetails()
    }

    return <Modal isOpen={postModalOpen} onClose={closePostModal}>
        <ModalOverlay></ModalOverlay>
        <ModalContent maxWidth={"70rem"} minWidth={"50rem"}>
            <Box display={"flex"} flexDirection={"row"}>
                <Box maxWidth={"67%"}>
                    <Image src={postimageurl}></Image>
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
                            <Image boxSize="2rem" borderRadius="full" src={profilePicMap.get(postFullDetailsVal.userId) ?? ""}></Image>
                            <Text fontSize="small" fontWeight="600">{postFullDetailsVal.username}</Text>
                        </Box>
                        <Box height={"20rem"} overflowY={"auto"}>
                            <UserCaption></UserCaption>
                            {postFullDetailsVal.comments.map((val) => {
                                return <EachComment commentDet={val}></EachComment>
                            })}
                        </Box>
                    </Box>
                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        borderTop={"1px solid black"}
                        borderColor={"blackAlpha.400"}>
                        <CommentFooter></CommentFooter>
                    </Box>
                </Box>
            </Box>
        </ModalContent >
    </Modal >
}

function CommentFooter() {
    const postFullDetailsVal = useRecoilValue(postFullDetails)
    const [postLikes, setpostlikes] = useState<number>(0)
    const [postLiked, setPostLiked] = useState<boolean>(false)
    const [commentText, setCommentText] = useState<string>("")
    const { refreshPost } = usePostFullDetails(postFullDetailsVal.postId, postFullDetailsVal.username)
    const inputRef = useRef<HTMLInputElement>(null)
    const { likeunlikepost } = useLikeUnlikePost(postFullDetailsVal.postId, setPostLiked, postLikes, setpostlikes)

    useEffect(() => {
        setpostlikes(postFullDetailsVal.likes.length)
        setPostLiked(postFullDetailsVal.isPostLiked)
    }, [postFullDetailsVal])

    const focusOnCommentInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleCommentSubmit = () => {
        fetch('http://localhost:3000/post/addcomment', {
            method: "POST",
            body: JSON.stringify({
                postId: postFullDetailsVal.postId,
                commentText: commentText,
                createdTime: Date.now().toString()
            }),
            headers: {
                'userId': localStorage.getItem('userId') ?? "",
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.ok) {
                    refreshPost()
                    setCommentText("")
                }
                else throw new Error("Something went wrong")
            })
            .catch((e) => {
                console.error(e)
            })
    }

    return <>
        <Box display={"flex"} flexDirection={"row"} gap={"1rem"} padding={"0.5rem 0.5rem 0 0.5rem"} alignContent={"center"}>
            <StarIcon onClick={() => likeunlikepost(postLiked)} color={postLiked ? "red.500" : "grey"} cursor={"pointer"} />
            <ChatIcon cursor={"pointer"} onClick={focusOnCommentInput} />
        </Box>
        <Box padding={"0.5rem"}>
            <Text fontSize={"small"}>{postLikes} Likes</Text>
            <Text fontSize={"small"}>1d</Text>
        </Box>
        <Box display={"flex"} flexDirection={"row"} borderTop={"0.5px solid grey"} borderColor={"blackAlpha.300"}>
            <Input ref={inputRef} value={commentText} onChange={e => setCommentText(e.target.value)} border={"none"} placeholder={"Add a comment..."} focusBorderColor="transparent" overflowX={"auto"}></Input >
            <Button backgroundColor="transparent" _hover={{ bg: 'transparent' }} color={"blue.500"} onClick={handleCommentSubmit}>Post</Button>
        </Box>
    </>
}

function UserCaption() {
    const profilePicMap = useRecoilValue(profilePictures)
    const postDetailsVal = useRecoilValue(postFullDetails)

    return <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        gap={"1rem"}
        padding={"0.5rem"}>
        <Image boxSize="2.5rem" borderRadius="full" src={profilePicMap.get(postDetailsVal.userId) ?? ""}></Image>
        <Text fontSize="small" fontWeight="600">{postDetailsVal.username}</Text>
        <Text maxWidth={"60%"} fontSize="small" fontWeight="400">{postDetailsVal.caption}</Text>
    </Box >
}

function EachComment(props: any) {
    const [commentLiked, setCommentLike] = useState<boolean>(props.commentDet.isLiked)
    const [numLikes, setNumLikes] = useState<number>(props.commentDet.commentlikes.length)
    const postDetailVal = useRecoilValue(postFullDetails)

    const likeComment = () => {
        if (commentLiked) {
            // unliking comment
            setCommentLike(!commentLiked)
            setNumLikes(numLikes - 1)

            fetch('http://localhost:3000/post/unlikecomment', {
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

            fetch('http://localhost:3000/post/likecomment', {
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