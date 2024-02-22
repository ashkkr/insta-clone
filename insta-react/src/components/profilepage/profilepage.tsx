import { Box, Card, Text, Image, Stack, useDisclosure, Button } from "@chakra-ui/react";
import { useProfileDetails } from "../../hooks/useProfileDetails";
import { useRecoilState, useRecoilValue } from "recoil";
import { profileDetails, profilePosts, profileimageurl } from "../../atoms/atoms";
import { usePostDetails } from "../../hooks/usePostDetails";
import { ChatIcon, StarIcon } from "@chakra-ui/icons"

function ProfilePage() {
    return <Box>
        <ProfileSection></ProfileSection>
        <PostSection></PostSection>
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
    const profilePostsVal = useRecoilValue(profilePosts)
    const { onClose, onOpen, isOpen } = useDisclosure()
    usePostDetails()

    return <Box display={"flex"} flexDirection={"row"} gap={"10px"}>
        {profilePostsVal.map((val) => {
            return <Box position={"relative"}>
                <Image boxSize={"200px"} src={val.imageDataUrl as string}></Image>
                <Box
                    position="absolute"
                    bottom={0}
                    height={"100%"}
                    width={"100%"}
                    color={"white"}
                    backgroundColor={"blackAlpha.400"}
                    cursor={"pointer"}
                    opacity={isOpen ? 1 : 0}
                    onMouseEnter={onOpen}
                    onMouseLeave={onClose}
                    transition="opacity 0.2s ease-in-out">
                    <Stack direction="row" alignItems={"center"} height={"100%"} justifyContent={"space-evenly"}>
                        <Text fontWeight="bold"><StarIcon /> {val.countOfLikes.toString()}</Text>
                        <Text fontWeight="bold"><ChatIcon />  {val.countOfComments.toString()}</Text>
                    </Stack>
                </Box>
            </Box>
        })
        }
    </Box>
}

export default ProfilePage;