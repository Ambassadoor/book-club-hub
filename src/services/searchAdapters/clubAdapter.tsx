export const clubAdapter = (search, navigate) => {
    const type = "Clubs"
    return {
        search: async (term: string, index=0) =>
        {
            const results = await search(term, index)
            const formatted = results?.map(r => ({...r, type}))

            return formatted ? formatted: ""
        },
        getKey: (option) => option.id,
        getLabel: (option) => option.name,
        select: (option) => navigate(`/clubs/${option.id}`),
        getType: () => type
    }
}