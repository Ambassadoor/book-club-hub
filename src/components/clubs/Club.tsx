import { Book, Edit } from "@mui/icons-material"
import { Avatar, Box, Button, Chip, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Pagination, Typography, useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


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


export const Club = () => {
    const {userId} = useParams()
    const [clubs, setClubs] = useState<ClubData[]>([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(1)
    const navigate = useNavigate()
    const isMedium = useMediaQuery('(min-width:768px)');

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-us", {year: "numeric", month: "short"})
    }
    
    useEffect(() => {
        userId ?
        fetch(`http://localhost:8088/clubMembers?userId=${userId}&_expand=club`).
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
        : fetch(`http://localhost:8088/clubs?_embed=clubBooks&_embed=clubMembers`).then((res) => res.json()).then((res) => {
            const formattedData = res.map((c) => {
                const {clubBooks, clubMembers, ...club } = c
                return {
                    club: club,
                    currentRead: clubBooks.find(b => b.isCurrent),
                    numMembers: clubMembers.length
                }
            })
            setClubs(formattedData)
        })
    },[userId])

    useEffect(() => {
        setCount(Math.ceil(clubs.length/10))
    },[clubs])

    const handleNewClubClick = () => {
        navigate("create")
    }

    return (
        clubs &&
        <Box className="flex-col">
            <Box className="flex">
                <Typography color="white" variant="h5">My Clubs</Typography>
                {userId && <Button className="ml-5" variant="contained" onClick={handleNewClubClick}>New Club</Button>}
            </Box>
            <Box className="flex flex-col min-w-full justify-center">
                <List>
                    {clubs && clubs.length > 0 && clubs.slice((page-1)*10, page*10).map((club) => (
                        
                        <ListItemButton 
                            divider
                            className="bg-neutral-50 rounded flex h-full" 
                            key={club.club.id}
                            onClick={() => navigate(`/clubs/${club.club.id}`)}
                        >
                            <Box className="flex flex-col justify-between self-start h-full">
                                <ListItemText className="flex-col self-start" primary={(
                                    <Typography variant="h5">{club?.club?.name}</Typography>
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
                                    club.currentRead && <Typography className="ml-2 hidden xs:flex" variant="body2">{`Currently Reading: ${club.currentRead?.title}`}</Typography>
                                    )}
                                    secondary={(
                                        <Typography className=" ml-2 hidden xs:flex" variant="body2">{`Next Meeting: Coming Soon`}</Typography>
                                    )}
                                />
                            </Box>
                            <ListItemAvatar className="flex justify-center px-2" >
                                        {club.currentRead ?
                                        <Avatar 
                                            sx={{
                                                width: "100%",
                                                height: "100%"
                                            }}
                                            variant="rounded"
                                            alt={`Cover art for ${club.currentRead?.title}`}
                                            src={club.currentRead?.imageSmall}
                                        /> :
                                        <Avatar
                                            variant="rounded"
                                        >
                                            <Book/>
                                        </Avatar>
                                    }
                            </ListItemAvatar>
                        </ListItemButton>
                        ))
                    }
                </List>
                <Pagination count={count} page={page} onChange={(_, value) => setPage(value)}/>
            </Box>
        </Box>
    )
}