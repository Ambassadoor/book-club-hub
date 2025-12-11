import { Box, Button, Chip, List, ListItem, Typography } from "@mui/material"
import { useEffect, useState } from "react"


type Club = {
    "created_at": number,
    description: string,
    id: number,
    name: string,
    ownerId: number
    clubMembers?: ClubMember[]
}

interface ClubBook extends Omit<UserBook, "userId"> {
    clubId: number
}

interface ClubMember {
    userId: number,
    clubId: number,
    isAdmin: boolean,
    "created_at": number,
    isActive: boolean,
    id: number,
    club: Club

}

interface ClubData extends ClubMember {
    club: Club,
    currentRead: ClubBook, 
    numMembers: number,
}

type ClubProps = {
    user: number
}

export const Club = ({user}: ClubProps) => {
    const [clubs, setClubs] = useState<ClubData[]>([])
    
    useEffect(() => {
        user &&
        fetch(`http://localhost:8088/clubMembers?userId=${user}&_expand=club`).
            then((res) => res.json()).
                then(async (res: ClubMember[]) =>  {                      
                        return Promise.all(res.map(async (club) => {
                            const response: Club = await fetch(`http://localhost:8088/clubs/${club.clubId}?_embed=clubMembers`).
                                then(res => res.json())
                            return {...club, numMembers: response.clubMembers ? response.clubMembers.length : 0}}
                ))}).
                then(async (res) => {
                    return Promise.all(res.map(async (club) => {
                        const response: ClubBook[] = await fetch(`http://localhost:8088/clubBooks?clubId=${club.clubId}&isCurrent=true`).
                            then(res => res.json())
                        return {...club, currentRead: response[0]}}))
                    
                    }).then(res => setClubs(res)).catch((error) => console.log("Error", error))

    },[user])

    return (
        user &&
        <Box>
            <Box className="flex">
                <Typography variant="h5">My Clubs</Typography>
                <Button>New Club</Button>
            </Box>
            <Box>
                <List>
                    {clubs && clubs.length > 0 && clubs.map((club) => (
                        <ListItem key={club.clubId}>
                            <Box>
                                <Box>
                                    <Typography>{club.club.name}</Typography>
                                    {club.isAdmin && <Button>Edit Club</Button>}
                                    <Box>
                                        <Typography>{`${club.numMembers} Members`}</Typography>
                                        <Typography>{`Member since ${new Date(club["created_at"]).toDateString()}`}</Typography>
                                        {/* <Typography></Typography> Stretch Goal, set and get user online statuses */}
                                        {club.isAdmin && <Chip label="Admin"/>}
                                    </Box>
                                </Box>
                                <Box>
                                    <Box>
                                        <Typography>{`Currently Reading: ${club.currentRead.title}`}</Typography>
                                        {club.isAdmin && <Button>Change Book</Button>}   
                                    </Box>
                                    <Box>
                                        <Typography></Typography>
                                        {club.isAdmin && <Button>Move Next Meeting</Button>}
                                    </Box>
                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    )
}