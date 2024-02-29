import { Modal, ModalContent, ModalHeader, ModalOverlay, Text, Button, Box, Input } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalProfilePic } from "../../atoms/atoms";
import { useHandleProfilePic } from "../../hooks/useHandleProfilePic";

export function ProfilePicEditModal() {
    const [profilePicModalVal, setProfilePicModal] = useRecoilState(modalProfilePic)
    const { deleteProfilePic, uploadProfilePic } = useHandleProfilePic()

    const closeModal = () => {
        setProfilePicModal(false)
    }
    const openFileBrowser = () => {
        document.getElementById('uploadpic')?.click()
    }

    return <Modal isOpen={profilePicModalVal} onClose={closeModal}>
        <ModalOverlay></ModalOverlay>
        <ModalContent margin={"auto"}>
            <Box display={"flex"} flexDirection={"column"}>
                <Text justifyContent={"space-evenly"} display={"flex"} alignItems={"center"} height={"3rem"} fontWeight={"600"}>Change Profile Photo</Text>
                <Button backgroundColor={"transparent"} color={"blue.500"} onClick={() => openFileBrowser()}>Upload Photo</Button>
                <Input onChange={(e) => uploadProfilePic(e)} id="uploadpic" as="input" type="file" style={{ display: 'none' }}></Input>
                <Button onClick={() => deleteProfilePic()} backgroundColor={"transparent"} color={"red.600"}>Remove Current Photo</Button>
                <Button backgroundColor={"transparent"} onClick={() => closeModal()}>Cancel</Button>
            </Box>
        </ModalContent>
    </Modal >
}