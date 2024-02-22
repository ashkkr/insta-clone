export interface PostDataBackendInterface {
    caption: string,
    userId: string,
    createdAt: string,
    imagepath: string,
    likes: string[],
    comments: commentInterface[]
}

interface commentInterface {
    user: string,
    createdAt: string,
    text: string
}


export interface MetaPostDataInterface {
    imagePath: String,
    countOfLikes: Number,
    countOfComments: Number
}

