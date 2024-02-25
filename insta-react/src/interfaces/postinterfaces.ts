export interface PostDataInterface {
    caption: string,
    userId: string,
    createdAt: Number
}

export interface MetaPostDataInterface {
    imagePath: String,
    countOfLikes: Number,
    countOfComments: Number,
    imageDataUrl: String,
    displayLikes: boolean,
    postId: String
}

export interface FullPostDetails {
    postId: string,
    caption: string,
    userId: string,
    createdAt: string,
    imagepath: string,
    likes: string[],
    isPostLiked: boolean,
    comments: commentPicInterface[]
}

export interface commentInterface {
    commentId: string,
    user: string,
    createdAt: string,
    text: string,
    commentlikes: string[]
}

export interface commentPicInterface extends commentInterface {
    profilepic: string
    isLiked: boolean
}