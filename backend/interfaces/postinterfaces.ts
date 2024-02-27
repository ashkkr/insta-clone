export interface PostDataBackendInterface {
    caption: string,
    userId: string,
    createdAt: string,
    imagePath: string,
    likes: string[],
    comments: commentInterface[]
}

export interface commentInterface {
    commentId: string,
    user: string,
    username: string,
    createdAt: string,
    text: string,
    commentlikes: string[]
}


export interface MetaPostDataInterface {
    postId: String,
    imagePath: String,
    countOfLikes: Number,
    countOfComments: Number
}

export interface FullPostDetails extends PostDataBackendInterface {
    postId: string
}

export interface commentPicInterface extends commentInterface {
    profilepic: String
}

export interface FeedPostDetails extends FullPostDetails {
    username: string,
    commentCount: number,
    likeCount: number,
    isUserFollowed: boolean,
    imageDataUrl: string,
    isPostLiked: boolean
}
