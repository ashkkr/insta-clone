import { Box, Button, Image, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useRecoilValue } from "recoil"
import { profilePictures } from "../../atoms/atoms"
import { useGetSuggestedUsers } from "../../hooks/useGetSuggestedUsers"

export function EachFollowCard(props: any) {
    const profilePicMap = useRecoilValue(profilePictures)
    const [followed, setFollowed] = useState<boolean>(false)
    const { followUser, unfollowUser } = useGetSuggestedUsers()

    return <Box display={"flex"} flexDirection={"row"} gap={'0.5rem'} alignItems={"center"} justifyContent={"space-between"}>
        <Image borderRadius={"full"} boxSize={"2rem"} src={profilePicMap.get(props.details.userId) ?? '"'}></Image>
        <Text fontSize={"small"}>{props.details.username}</Text>
        {!followed ?
            <Button size={"sm"} height={"1.3rem"} colorScheme={"blue"} onClick={() => followUser(props.details.userId, setFollowed)}>Follow</Button> :
            <Button size={"sm"} height={"1.3rem"} colorScheme={"gray"} onClick={() => unfollowUser(props.details.userId, setFollowed)}>Unfollow</Button>}
    </Box>
}