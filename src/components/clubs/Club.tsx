import { Book } from "@mui/icons-material"
import { Avatar, Box, Button, Chip, List, ListItemButton, ListItemText, Pagination, Typography } from "@mui/material"
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

export interface ClubBook extends Omit<UserBook, "userId"> {
    clubId: number,
    isCurrent: boolean
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

interface rawClubData extends Club {
    clubBooks: ClubBook[],
    clubMembers: ClubMember[]
}

//Displays a list of the user's clubs. 
export const Club = ({user=null}) => {
    let {userId} = useParams()
    const [clubs, setClubs] = useState<ClubData[]>([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(1)
    const navigate = useNavigate()

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-us", {year: "numeric", month: "short"})
    }
    
    useEffect(() => {
        if (!userId && user) {
            userId = user
        }
    }, [user])
    
    useEffect(() => {
        setClubs([])
        if (userId) {
            fetch(`http://localhost:8088/clubMembers?userId=${userId}&_expand=club`)
                .then((res) => res.json())
                .then(async (res: ClubMember[]) => {
                    // Filter out inactive club memberships
                    const activeClubs = res.filter((club) => club.isActive)
                    return Promise.all(activeClubs.map(async (club) => {
                        const response: Club = await fetch(`http://localhost:8088/clubs/${club.clubId}?_embed=clubMembers`).then(res => res.json())
                        return { ...club, numMembers: response.clubMembers ? response.clubMembers.length : 0 }
                    }))
                })
                .then(async (res) => {
                    return Promise.all(res.map(async (club) => {
                        const response: ClubBook[] = await fetch(`http://localhost:8088/clubBooks?clubId=${club.clubId}&isCurrent=true`).then(res => res.json())
                        return { ...club, currentRead: response[0] }
                    }))
                })
                .then(res => setClubs(res))
                .catch((error) => console.log("Error", error))
        } else {
            fetch(`http://localhost:8088/clubs?_embed=clubBooks&_embed=clubMembers`).then((res) => res.json()).then((res) => {
                const formattedData = res.map((c: rawClubData) => {
                    const { clubBooks, clubMembers, ...club } = c
                    return {
                        club: club,
                        currentRead: clubBooks.find(b => b.isCurrent),
                        numMembers: clubMembers.length
                    }
                })
                setClubs(formattedData)
            })
        }
    }, [userId])

    useEffect(() => {
        setCount(Math.ceil(clubs.length/10))
    },[clubs])

    const handleNewClubClick = () => {
        navigate("/clubs/create")
    }

    return (
        clubs &&
        <div className="flex flex-col gap-2">
            <div className="flex items-center mb-2">
                <Typography variant="h5" color="text.primary">{userId ? "My Clubs" : "Clubs"}</Typography>
                {userId && <Button sx={{ ml: 2 }} variant="contained" color="primary" onClick={handleNewClubClick}>New Club</Button>}
            </div>
            <div className="flex flex-col w-full">
                <List sx={{ width: '100%', gap: 1, display: 'flex', flexDirection: 'column' }}>
                    {clubs && clubs.length > 0 ? clubs.slice((page-1)*10, page*10).map((club) => (
                        <ListItemButton 
                            key={club.club.id}
                            onClick={() => navigate(`/clubs/${club.club.id}`)}
                            sx={{
                                bgcolor: 'background.paper',
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 2,
                                p: 2,
                                minHeight: '140px',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    borderColor: 'primary.main',
                                },
                            }}
                        >
                            <div className="flex flex-col justify-between flex-1 min-w-0">
                                <ListItemText 
                                    primary={
                                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>{club?.club?.name}</Typography>
                                    } 
                                    secondary={(
                                        <div className="flex gap-1 flex-wrap mt-1">
                                            {club.isAdmin && <Chip size="small" color="secondary" label="Admin"/>}
                                            <Chip sx={{ display: { xs: 'none', sm: 'inline-flex' } }} size="small" color="primary" label={`${club.numMembers} members`}/>
                                            <Chip sx={{ display: { xs: 'none', sm: 'inline-flex' } }} size="small" color="primary" label={`Joined ${formatDate(new Date(club["created_at"]))}`}/>
                                        </div>
                                    )}
                                    slotProps={{
                                        secondary: {
                                            component: "div"
                                        }
                                    }}
                                />
                                <div className="mt-2">
                                    {club.currentRead && (
                                        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                            Currently Reading: <strong>{club.currentRead?.title}</strong>
                                        </Typography>
                                    )}
                                    <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        Next Meeting: Coming Soon
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex justify-center items-center ml-2">
                                {club.currentRead ?
                                    <Avatar 
                                        sx={{
                                            width: 80,
                                            height: 120,
                                        }}
                                        variant="rounded"
                                        alt={`Cover art for ${club.currentRead?.title}`}
                                        src={club.currentRead?.imageSmall}
                                    /> :
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 120,
                                            bgcolor: 'action.selected',
                                        }}
                                        variant="rounded"
                                    >
                                        <Book sx={{ fontSize: 40 }} />
                                    </Avatar>
                                }
                            </div>
                        </ListItemButton>
                    )) : (
                        <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                            {userId ? "You haven't joined any clubs yet." : "No clubs available."}
                        </Typography>
                    )}
                </List>
                {count > 1 && (
                    <div className="flex justify-center mt-2">
                        <Pagination count={count} page={page} onChange={(_, value) => setPage(value)} color="primary" />
                    </div>
                )}
            </div>
        </div>
    )
}