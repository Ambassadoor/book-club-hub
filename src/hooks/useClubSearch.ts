type Club = {
    name: string,
    description: string,
    ownerId: number,
    created_at: number,
    id: number
}

type ClubResponse = Club[]

export const useClubSearch = () => {

    const search = async (query: string): Promise<ClubResponse | null> => {
        if (query.length < 3) return null
        const normalized = query.trim().toLocaleLowerCase().replace(/\s+/g," ");
        const res = await fetch("http://localhost:8088/clubs").then(res => res.json())

        const filteredResults = res.filter((club: Club) => {
            return club.name.toLowerCase().includes(normalized)
        })   

        return filteredResults
    }

    return {search}
}