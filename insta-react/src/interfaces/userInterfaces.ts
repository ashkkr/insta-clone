export interface ProfileInterface {
    countOfPosts: number,
    countOfFollowers: number,
    countOfFollowing: number,
    username: string,
    fullName: string,
    bio: String,
    isUserFollowed: boolean
}

export interface SuggestUserInterface {
    userId: string,
    username: string
}