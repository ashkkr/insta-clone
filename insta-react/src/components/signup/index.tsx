import { Card, CardBody, CardFooter, CardHeader, Heading, Input, Text, Button, Box, Divider, InputGroup, InputRightElement, Toast, useToast, Link, Flex } from "@chakra-ui/react";
import './index.css';
import { ChangeEvent, useEffect, useState } from "react";
import { inputOutlineColor, signUpForm } from "../../atoms/atoms";
import { useRecoilValue, useSetRecoilState, useRecoilState, SetterOrUpdater } from "recoil";
import { signupInterface } from "../../interfaces/authInterfaces";
import { Link as RedirectLink, useNavigate } from "react-router-dom";
import { handleChange } from "../../App";

const validateInput = (signupdata: signupInterface, inputvalidateState: Object, setValidate: SetterOrUpdater<{
    email: boolean;
    username: boolean;
    fullname: boolean;
    password: boolean;
}>) => {
    console.log("Inside validate inpuut");
    var validationFlags = {
        email: false,
        username: false,
        fullname: false,
        password: false
    }

    const emailreg = /^(\d{10}|[\w.-]+@[a-zA-Z_-]+(?:\.[a-zA-Z]+)+)$/;
    const passreg = /^.{ 6, 20}$/;
    const usernamereg = /^.{ 1, 20}$/;

    emailreg.test(signupdata.email) ? validationFlags.email = true : validationFlags.email = false;
    passreg.test(signupdata.password) ? validationFlags.password = true : validationFlags.password = false;
    usernamereg.test(signupdata.username) ? validationFlags.username = true : validationFlags.username = false;
    usernamereg.test(signupdata.fullname) ? validationFlags.fullname = true : validationFlags.fullname = false;

    // setValidate
    return undefined
}

function SignUp() {
    return <>
        <Box position="relative" display="flex" flexDirection="column" gap="4" maxWidth="300px" margin="auto" top="15vh">
            <SignupBody></SignupBody>
            <LoginBox></LoginBox>
        </Box></>
}

function SignupBody() {
    const [signupdata, setdata] = useRecoilState(signUpForm)
    const [inputState, setValidate] = useRecoilState(inputOutlineColor);
    const navigate = useNavigate()

    const handleSubmit = () => {
        console.log("outside")
        if (Object.values(inputState).every(val => val === true)) {
            console.log("inside this")
            fetch('https://api2.coderswims.xyz/auth/signup', {
                method: "POST",
                body: JSON.stringify(signupdata),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json()
                    }
                    else throw new Error("Signup was unsuccessfull")
                })
                .then((data) => {
                    navigate('/home');
                    localStorage.setItem('token', 'Bearer ' + data.token)
                    localStorage.setItem('userId', data.userId)
                })
                .catch((e) => {
                    console.error(e);
                })
        }
    }

    return <Card padding="10px" border="0.5px solid grey">
        < CardHeader margin="auto" paddingBottom="0" >
            <Heading size='md' textAlign="center">Instagram</Heading>
            <Text marginTop="12px" fontSize="12px" textAlign="center">Sign up to see photos and videos from your friends.</Text>
        </CardHeader>
        <CardBody display="flex" flexDirection="column" paddingTop="0">
            <Box position="relative" padding="18">
                <Divider></Divider>
            </Box>
            <Box display="flex" flexDirection="column" gap="5px">
                <Input name="email" onChange={e => handleChange(e, signupdata, setdata)} isInvalid={!inputState.email} size="sm" variant='outline' placeholder="Mobile number or email address" _placeholder={{ fontSize: 11 }}></Input>
                <Input name="fullname" onChange={e => handleChange(e, signupdata, setdata)} isInvalid={!inputState.fullname} size="sm" variant='outline' placeholder="Full Name" _placeholder={{ fontSize: 11 }}></Input>
                <Input name="username" onChange={e => handleChange(e, signupdata, setdata)} isInvalid={!inputState.username} size="sm" variant='outline' placeholder="Username" _placeholder={{ fontSize: 11 }}></Input>
                <PasswordInput></PasswordInput>
            </Box>
        </CardBody >
        <CardFooter display="flex" flexDirection="column" gap="10px" paddingTop="0">
            <Text fontSize="9px" textAlign="center">By signing up, you agree to have cookies with your coffee.</Text>
            <Button colorScheme="blue" size="sm" onClick={() => handleSubmit()}>Sign Up</Button>
        </CardFooter>
    </Card >
}

function PasswordInput() {
    const [show, setShow] = useState(false)
    const [signupdata, setdata] = useRecoilState(signUpForm)
    const [inputvalidateState, setValidate] = useRecoilState(inputOutlineColor);


    const changeShow = () => setShow(!show);

    return <InputGroup size="sm" outlineColor="green">
        <Input
            pr="4.5rem"
            placeholder="Password"
            _placeholder={{ fontSize: 11 }}
            type={show ? "text" : "password"}
            focusBorderColor='grey'
            errorBorderColor='red.500'
            name="password"
            value={signupdata.password}
            onChange={e => handleChange(e, signupdata, setdata)}
            isInvalid={!inputvalidateState.password}>
        </Input>
        <InputRightElement width="3rem">
            <Button h='1.75rem' size="xs" onClick={changeShow} backgroundColor="transparent" _hover={{ bg: 'transparent' }}>
                {show ? 'Hide' : 'Show'}
            </Button>
        </InputRightElement>
    </InputGroup >
}

function LoginBox() {
    return <Card>
        <CardBody fontSize="small" textAlign="center" border="0.5px solid grey">
            <Text>Have an account? </Text>
            <Link as={RedirectLink} fontWeight="650" to='/login' color="blue.500" textDecoration="none">Log in</Link>
        </CardBody>
    </Card>
}

export default SignUp;