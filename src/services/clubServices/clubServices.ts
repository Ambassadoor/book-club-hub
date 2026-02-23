export const getClub = async (clubId) => {
    const club = await fetch(`http://localhost:8088/clubs/${clubId}`)
    return club
}

export const getUserClubs = async (userId) => {
    const allUserClubs = await fetch(`http://localhost:8088/clubMembers?userId=${userId}&_expand=club`).then(res => res.json())
    return allUserClubs
}

export const getUserActiveClubs = async(userId) => {
    const allClubs = await getUserClubs(userId)
    const currentClubs = allClubs.filter(club => club.isActive)

    return currentClubs
}

export const getActiveClubMembers = async (clubId) => {
    const allMembers = await fetch(`http://localhost:8088/clubs/${clubId}?_embed=clubMembers`).then(res => res.json())
    const activeMembers = allMembers.clubMembers.filter(member => member.isActive)

    return activeMembers
}

export const getCurrentRead = async (clubId) => {
    const currentRead = await fetch(`http://localhost:8088/clubBooks?/clubId=${clubId}&isCurrent=true`).then(res => res.json())
    return currentRead
}

export const getAllClubs = async () => {
    const clubs = await fetch(`http://localhost:8088/clubs`)
    return clubs
}

export const getClubData = async (clubId) => {
    const clubData = await fetch(`http://localhost:8088/clubs/${clubId}?_embed=clubMembers&_embed=clubBooks`).then(res => res.json())
    return clubData
}

export const getUserClubData = async (userId) => {
    const userClubs = await getUserActiveClubs(userId)
    const clubData = await Promise.all(userClubs.map(async club => {
        const data = await getClubData(club.clubId)       

        return {...club, club: data}
    }))
    
    return clubData
}

export const getAllClubData = async () => {
    const clubsData = await fetch(`http://localhost:8088/clubs?_embed=clubMembers&_embed=clubBooks`).then(res => res.json())
    return clubsData

}



