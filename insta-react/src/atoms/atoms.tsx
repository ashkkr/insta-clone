import { atom } from "recoil";
import { loginInterface, signupInterface } from "../interfaces/authInterfaces";

export const inputOutlineColor = atom({
    key: 'inputoutlinecolor',
    default: {
        email: true,
        username: true,
        fullname: true,
        password: true
    }
});

export const signUpForm = atom<signupInterface>({
    key: 'signupdata',
    default: {
        email: '',
        fullname: '',
        username: '',
        password: ''
    }
});

export const loginForm = atom<loginInterface>({
    key: 'logindata',
    default: {
        email: '',
        password: ''
    }
});

export const isCreateModal = atom<boolean>({
    key: 'createmodal',
    default: false
});

export const nextClicked = atom<boolean>({
    key: 'isnextclicked',
    default: false
});

export const imageSelecteed = atom<string | ArrayBuffer>({
    key: 'imageSelected',
    default: ""
});