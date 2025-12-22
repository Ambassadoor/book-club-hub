export const googleAdapter = (search, navigate) => {
    const type = "Google Books"
    return {
        search: async (term: string, index=0) =>

            {
                const results = await search(term, index)
                const formatted = results?.map(r => ({...r, type}))

                return formatted ? formatted : ""

            },
        getKey: (option) => option.id,
        getLabel: (option) => option.volumeInfo.title,
        select: (option) => 
            navigate(`/books/google/${option.id}`, {state: {option}}),
        getType: () => type
    }
}

