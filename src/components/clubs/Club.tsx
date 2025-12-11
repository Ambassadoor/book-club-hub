import { Book, Edit } from "@mui/icons-material"
import { Avatar, Box, Button, Chip, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, useMediaQuery } from "@mui/material"
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
    const isMedium = useMediaQuery('(min-width:768px)');

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-us", {year: "numeric", month: "short"})
    }
    
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
        <Box className="flex-col">
            <Box className="flex">
                <Typography color="white" variant="h5">My Clubs</Typography>
                <Button className="ml-5" variant="contained">New Club</Button>
            </Box>
            <Box className="flex min-w-full justify-center">
                <List>
                    {clubs && clubs.length > 0 && clubs.map((club) => (
                        <ListItem 
                            divider
                            className="bg-neutral-50 rounded flex h-full" 
                            key={club.clubId}
                        >
                            <Box className="flex flex-col justify-between self-start h-full">
                                <ListItemText className="flex-col self-start" primary={(
                                    <Typography variant="h5">{club.club.name}</Typography>
                                )} secondary={
                                    (
                                    <Box className="flex gap-2" >
                                        {club.isAdmin && <Chip className="self-center" size="small" color="secondary"label="Admin"/>}
                                        <Chip className="self-center hidden xs:flex" size="small" color="primary" label={`${club.numMembers} members`}/>
                                        <Chip className="self-center hidden xs:flex" size="small" color="primary" label={`Joined ${formatDate(new Date(club["created_at"]))}`}/>
                                        {/* <Typography></Typography> Stretch Goal, set and get user online statuses */}
                                    </Box>
                                    )
                                }
                                slotProps={{
                                    secondary: {
                                        component: "div"
                                    }
                                }}
                                />
                                <ListItemText
                                    primary={(
                                    <Typography className="ml-2 hidden xs:flex" variant="body2">{`Currently Reading: ${club.currentRead.title}`}</Typography>
                                    )}
                                    secondary={(
                                        <Typography className=" ml-2 hidden xs:flex" variant="body2">{`Next Meeting: Coming Soon`}</Typography>
                                    )}
                                />
                            </Box>
                            <ListItemAvatar className="flex justify-center px-2" >
                                        {club.currentRead.imageSmall !== "" ?
                                        <Avatar 
                                            sx={{
                                                width: "100%",
                                                height: "100%"
                                            }}
                                            variant="rounded"
                                            alt={`Cover art for ${club.currentRead.title}`}
                                            src={club.currentRead.imageSmall}
                                        /> :
                                        <Avatar
                                            variant="rounded"
                                        >
                                            <Book/>
                                        </Avatar>
                                    }
                            </ListItemAvatar>
                        </ListItem>
                        ))
                    }
                </List>
            </Box>
        </Box>
    )
}