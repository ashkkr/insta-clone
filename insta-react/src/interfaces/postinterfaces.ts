export interface PostDataInterface {
    caption: string,
    userId: string,
    createdAt: Number
}

export interface PostImageInterface {
    imagePath: String,
    imageDataUrl: String
}

export interface MetaPostDataInterface extends PostImageInterface {
    countOfLikes: Number,
    countOfComments: Number,
    postId: String
}

export interface FullPostDetails {
    postId: string,
    caption: string,
    userId: string,
    createdAt: string,
    imagePath: string,
    likes: string[],
    isPostLiked: boolean,
    comments: commentPicInterface[],
    imageDataUrl: string,
    username: string
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

export interface FeedPostDetails extends FullPostDetails {
    commentCount: number,
    isUserFollowed: boolean,
    imageDataUrl: string
}

export type ProfileTuple = [string, string] // userId to profilePicture