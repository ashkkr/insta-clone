import { Box, Card, Text, Image, Stack, useDisclosure, Button, Modal, ModalOverlay, ModalContent, Divider, Input } from "@chakra-ui/react";
import { useProfileDetails } from "../../hooks/useProfileDetails";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { modalPostImageDataUrl, modalProfilePic, postFullDetails, postModalView, profileDetails, profilePosts, profileimageurl } from "../../atoms/atoms";
import { usePostDetails, usePostFullDetails } from "../../hooks/usePostDetails";
import { ChatIcon, StarIcon } from "@chakra-ui/icons"
import { MetaPostDataInterface } from "../../interfaces/postinterfaces";
import { useEffect, useRef, useState } from "react";
import { useLikeUnlikePost } from "../../hooks/useLikeUnlike";
import { PostModalView } from "../modalview/postmodalview";
import { useParams } from "react-router-dom";
import { useGetSuggestedUsers } from "../../hooks/useGetSuggestedUsers";
import { ProfilePicEditModal } from "../modalview/profilepicview";

function ProfilePage() {
    const profilePicModalVal = useRecoilValue(modalProfilePic)
    const { userId } = useParams()
    const postModalViewVal = useRecoilValue(postModalView)
    useProfileDetails(userId ?? "")
    return <Box>
        <ProfileSection></ProfileSection>
        <PostSection></PostSection>
        {postModalViewVal ? <PostModalView></PostModalView> : <></>}
        {profilePicModalVal ? <ProfilePicEditModal></ProfilePicEditModal> : <></>}
    </Box>
}

function ProfileSection() {
    const [profileDetailsVal, setProfileDetails] = useRecoilState(profileDetails)
    const [profileDataurl, setprofiledataurl] = useRecoilState(profileimageurl)
    const { userId } = useParams()
    const [followed, setFollowed] = useState<boolean>(profileDetailsVal.isUserFollowed)
    const { followUser, unfollowUser } = useGetSuggestedUsers()
    const setProfilePicModal = useSetRecoilState(modalProfilePic)

    const editProfilePic = () => {
        setProfilePicModal(true)
    }

    useEffect(() => {
        setFollowed(profileDetailsVal.isUserFollowed)
    }, [profileDetailsVal])

    return <Box padding={"40px"} display={"flex"} flexDirection={"row"} gap={"20px"}>
        <Image onClick={() => editProfilePic()} cursor={userId == "me" ? "pointer" : "default"} boxSize={"50px"} borderRadius={"full"} src={profileDataurl}></Image>
        <Box display={"flex"} flexDirection={"column"} gap={"5px"}>
            <Box display={"flex"} flexDirection={"row"} gap={"2rem"} alignItems={"center"}>
                <Text>{profileDetailsVal.username}</Text>
                {userId == "me" ? <></> :
                    (!followed ?
                        <Button size={"sm"} height={"1.3rem"} colorScheme={"blue"} onClick={() => followUser(userId ?? "", setFollowed)}>Follow</Button> :
                        <Button size={"sm"} height={"1.3rem"} colorScheme={"gray"} onClick={() => unfollowUser(userId ?? "", setFollowed)}>Unfollow</Button>)
                }
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
    const profilePostsVal = useRecoilValue(profilePosts)
    const { userId } = useParams()
    usePostDetails(userId ?? "")

    return <Box display={"flex"} flexDirection={"row"} gap={"10px"}>
        {profilePostsVal.map((val) => {
            return <IndividualPost post={val}></IndividualPost>
        })
        }
    </Box>
}

function IndividualPost(props: any) {
    const profileDetailsVal = useRecoilValue(profileDetails)
    const [showLikeVal, setShowLike] = useState<boolean>(false)
    const setPostModalOpen = useSetRecoilState(postModalView)
    const { refreshPost } = usePostFullDetails(props.post.postId as string, profileDetailsVal.username)
    const setPostImageDataUrl = useSetRecoilState(modalPostImageDataUrl)

    const showLike = () => {
        setShowLike(true)
    }

    const hideLike = () => {
        setShowLike(false)
    }

    const openModal = () => {
        setPostImageDataUrl(props.post.imageDataUrl)
        refreshPost()
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
            onClick={() => openModal()}
            transition="opacity 0.2s ease-in-out">
            <Stack direction="row" alignItems={"center"} height={"100%"} justifyContent={"space-evenly"}>
                <Text fontWeight="bold"><StarIcon /> {props.post.countOfLikes.toString()}</Text>
                <Text fontWeight="bold"><ChatIcon />  {props.post.countOfComments.toString()}</Text>
            </Stack>
        </Box>
    </Box>
}
export default ProfilePage;