export interface GoogleUser {
    iss: string,
    azp: string,
    aud: string,
    sub: string,
    email: string,
    email_verified: boolean,
    nbf: number,
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    iat: number,
    exp: number,
    jti: string,
    method: string
}

export interface User {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    tagline: string | null,
    created_at: string,
    sso_id: string | null,
    picture: string,
    method: string,
    id: number

}

// Adds user to database
export const postUser = async (user: GoogleUser) => {
    const transformedUser = transformUser(user)
    return fetch("http://localhost:8088/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transformedUser)
    })
}

// Ensures user is set correctly in database
const transformUser = (user: GoogleUser) => {
    if (user.method === "google") {
        return {
            firstName: user.given_name,
            lastName: user.family_name,
            userName: user.email,
            email: user.email,
            tagline: null,
            created_at: new Date(),
            sso_id: user.sub,
            picture: user.picture,
            method: user.method
        }
    } else {
        throw new Error("Invalid User Data")
        
    }
}

