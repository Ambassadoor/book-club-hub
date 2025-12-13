const url = "http://localhost:8088/userBooks"
// Scenario 1: No params -> Search all Fields
// Scenario 2: Single Param -> Search given field
// Scenario 3: Multiple Params -> Search each field

export type BchSearchResults = {
    results: UserBook[],
    total: number,
    cont: boolean
}

//Handles a search of userBooks
const search = async (params: {
        title?: string
        author?: string
        description?: string
        isbn?: number
    } | string | number,
    page: number = 0): Promise<BchSearchResults> => {
    const startIndex = (page * 10)
    const endIndex = startIndex + 10
    const fieldsToSearch = 
        (typeof params !== "object")
        ? Object.entries({title: params, author:params, description:params, isbn:params})
        : Object.entries(params) 

    const response: UserBook[] = await fetch(url).then(res => res.json())

    const searchResults =
        response.filter(book =>
            fieldsToSearch.some(field =>
                book[field[0] as (keyof UserBook)] && String(book[field[0] as (keyof UserBook)]).toLowerCase().includes(String(field[1]).toLowerCase())
            )
        )

    const numResults = searchResults.length

    const paginatedResults = searchResults.slice(startIndex, endIndex)

    const cont = numResults > endIndex

    return {
        results: paginatedResults,
        total: numResults,
        cont: cont
    }
}
export const bchBooksClient = () => {
    return {search}
}


const request = async(path: string, options?: Options) => {
    const res = await fetch(`${url}${path}`, {
        method: options?.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {})
        },
        body:
            options?.body  
            ? JSON.stringify(options.body)
            : undefined
    })

    if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        throw new Error(`Request failed: ${res.status} ${errorText}`)
    }

    return res.status !== 204 ? res.json() : null
}

export const bchApi = {
  request,
};