import { Box, Card, CardBody, CardHeader, Divider, Heading, Text, Input, CardFooter, Button, InputGroup, InputRightElement, Link } from "@chakra-ui/react";
import { handleChange } from "../../App";
import { useRecoilState } from "recoil";
import { loginForm } from "../../atoms/atoms";
import { useState } from "react";
import { Link as RedirectLink, useNavigate } from "react-router-dom"

function Login() {
    return <Box position="relative" display="flex" flexDirection="column" gap="4" maxWidth="300px" margin="auto" top="15vh">
        <LoginCard></LoginCard>
        <SignupCard></SignupCard>
    </Box>
}

function LoginCard() {
    const navigate = useNavigate()
    const [logindata, setlogin] = useRecoilState(loginForm)

    const handleSubmit = () => {
        fetch('http://localhost:3000/auth/login', {
            method: "POST",
            body: JSON.stringify(logindata),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
                else {
                    throw new Error("Could not login")
                }
            })
            .then((data) => {
                navigate('/home')
                localStorage.setItem('token', 'Bearer ' + data.token)
                localStorage.setItem('userId', data.userId)
            })
            .catch((er) => {
                console.error(er)
            })
    }

    return <Card padding="10px" border="0.5px solid grey">
        < CardHeader margin="auto" paddingBottom="0" >
            <Heading size='md' textAlign="center">Instagram</Heading>
        </CardHeader>
        <CardBody display="flex" flexDirection="column" paddingTop="0">
            <Box position="relative" padding="18">
                <Divider></Divider>
            </Box>
            <Box display="flex" flexDirection="column" gap="5px">
                <Input name="email" onChange={e => handleChange(e, logindata, setlogin)} size="sm" variant='outline' placeholder="Mobile number or email address" _placeholder={{ fontSize: 11 }}></Input>
                <PasswordInput></PasswordInput>
                <Button colorScheme="blue" size="sm" onClick={() => handleSubmit()}>Log in</Button>
            </Box>
            <Box position="relative" padding="18">
                <Divider></Divider>
            </Box>
        </CardBody >
        <CardFooter paddingTop="0">
            <Link as={RedirectLink} margin="auto" fontWeight="650" fontSize="small" color="blue.500" textDecoration="none">Forgotten your password?</Link>
        </CardFooter>
    </Card >
}

function PasswordInput() {
    const [show, setShow] = useState(false)
    const [logindata, setlogin] = useRecoilState(loginForm)


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
            value={logindata.password}
            onChange={e => handleChange(e, logindata, setlogin)}>
        </Input>
        <InputRightElement width="3rem">
            <Button h='1.75rem' size="xs" onClick={changeShow} backgroundColor="transparent" _hover={{ bg: 'transparent' }}>
                {show ? 'Hide' : 'Show'}
            </Button>
        </InputRightElement>
    </InputGroup >
}

function SignupCard() {
    return <Card>
        <CardBody fontSize="small" textAlign="center" border="0.5px solid grey">
            <Text>Don't have an account? </Text>
            <Link as={RedirectLink} fontWeight="650" to='/signup' color="blue.500" textDecoration="none">Sign up</Link>
        </CardBody>
    </Card>
}

export default Login;