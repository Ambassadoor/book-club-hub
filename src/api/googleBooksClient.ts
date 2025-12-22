import type { SearchParams } from "../components/library/Library"
const url = "https://www.googleapis.com/books/v1/volumes"
//Stopped using to prevent too many request errors
//const key = import.meta.env.VITE_GOOGLE_BOOK_KEY

export type GoogleSearchResults = {
    kind: string,
    totalItems: number,
    items: GoogleBook[]
}

//Handles a search to the google books api
const search = async (searchParams: SearchParams, page: number=0): Promise<GoogleSearchResults> => {
    let query = ""
    Object.entries(searchParams).forEach(param => query += `${param[0]}:${param[1]}+`)
    query = query.slice(0,-1)
    query += `&startIndex=${String(page*10)}`
    const response = await fetch(`${url}?q=${query}`).then(res => res.json())

    return {
        ...response, items: response.items || []
    }
}

export const googleBooksClient = () => {
    return {search}
}