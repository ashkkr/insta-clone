import { atom } from "recoil";
import { loginInterface, signupInterface } from "../interfaces/authInterfaces";
import { ProfileInterface, SuggestUserInterface } from "../interfaces/userInterfaces";
import { FullPostDetails, MetaPostDataInterface, PostDataInterface, ProfileTuple } from "../interfaces/postinterfaces";

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

export const imageSelecteed = atom<string>({
    key: 'imageSelected',
    default: ""
});

export const imagefileselected = atom<File>({
    key: 'uploadpostfile',
    default: new File([], 'empty.txt', { type: 'text/plain' })
})

export const profileDetails = atom<ProfileInterface>({
    key: 'profiledetails',
    default: {
        username: "",
        countOfFollowers: -1,
        countOfFollowing: -1,
        fullName: "",
        bio: "",
        countOfPosts: -1,
        isUserFollowed: false
    }
});

export const profileimageurl = atom<string>({
    key: 'profileimageurl',
    default: ""
});

export const profilePosts = atom<Array<MetaPostDataInterface>>({
    key: 'profileposts',
    default: new Array<MetaPostDataInterface>()
})

// export const focusedPost = atom<MetaPostDataInterface>({
//     key: 'focusedpost',
//     default: {
//         imagePath: "",
//         countOfLikes: 0,
//         countOfComments: 0,
//         imageDataUrl: "",
//         postId: ""
//     }
// })

export const postModalView = atom<boolean>({
    key: 'postmodalview',
    default: false
})

export const postFullDetails = atom<FullPostDetails>({
    key: 'postfulldetails',
    default: {
        postId: "",
        caption: "",
        userId: "",
        createdAt: "",
        imagePath: "",
        likes: [],
        comments: [],
        isPostLiked: false,
        imageDataUrl: "",
        username: ""
    }
})

export const profilePictures = atom<Map<string, string>>({
    key: 'profilepicturesdictionary',
    default: new Map<string, string>()
})

export const modalPostImageDataUrl = atom<string>({
    key: 'modalpostdataurl',
    default: ""
})

export const modalProfilePic = atom<boolean>({
    key: 'profilemodalpic',
    default: false
})

export const searchedUsers = atom<SuggestUserInterface[]>({
    key: 'searcheduserslist',
    default: []
})