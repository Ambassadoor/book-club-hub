import { Book } from "@mui/icons-material"
import { Avatar, Box, Button, Chip, List, ListItemButton, ListItemText, Pagination, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PaginatedList } from "../shared/PaginatedList"
import { ClubSearchResult } from "./ClubSearchResult"
import { getAllClubData, getUserClubData } from "../../services/clubServices/clubServices"


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
export const Club = ({user=null, getAll=false}) => {
    let {userId} = useParams()
    const [clubs, setClubs] = useState<ClubData[]>([])
    const navigate = useNavigate()
    

    useEffect(() => {
        if (!userId && user) {
            userId = user
        }
    }, [user])
    
    useEffect(() => {
        if (getAll) {
            getAllClubData().then(res => setClubs(res))
            return
        }
        getUserClubData(userId).then(res => setClubs(res))
    }, [userId, getAll])

    const handleNewClubClick = () => {
        navigate("/clubs/create")
    }

    const mappedClubs = useMemo(() => 
        clubs.map((c) => ({
            club: c,
            user: user
        }))
    , [clubs])

    return (
        clubs &&
        <div className="flex flex-col gap-2 max-h-auto">
            <div className="flex items-center mb-2">
                <Typography variant="h5" color="text.primary">{userId ? "My Clubs" : "Clubs"}</Typography>
                {userId && <Button sx={{ ml: 2 }} variant="contained" color="primary" onClick={handleNewClubClick}>New Club</Button>}
            </div>
            <div className="flex flex-col w-full">
                <PaginatedList results={mappedClubs} Child={ClubSearchResult} displayCount={5}/>
            </div>
        </div>
    )
}