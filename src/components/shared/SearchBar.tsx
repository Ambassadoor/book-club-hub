import * as React from "react"
import { Search } from "@mui/icons-material"
import { Autocomplete, type AutocompleteProps, IconButton, InputAdornment, TextField, type TextFieldProps } from "@mui/material"
import debounce from "lodash.debounce"
import { useCallback, useEffect, useRef, useState } from "react"
import { bchBooksClient, type BchSearchResults } from "../../api/bchBooksClient"
import { googleBooksClient, type GoogleSearchResults } from "../../api/googleBooksClient"
import { colors } from "../../styles/colors"
import { useNavigate } from "react-router-dom"

type Target = "googleBooks" | "bchbooks"

type SearchBarProps<
    T,
    Multiple extends boolean = false,
    DisableClearable extends boolean = false,
    FreeSolo extends boolean = false,
> = {
    close?: boolean,
    expanding?: boolean,
    targets?: Target[],
    source?: T[],
    page?: number,
    setPage?: React.Dispatch<React.SetStateAction<number>>,
    searchResults: T[],
    setResults: React.Dispatch<React.SetStateAction<T[]>> | ((res: T[]) => void),
    setTotal?: React.Dispatch<React.SetStateAction<number>>
    } & Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput" | "options">;


// Customizable Search Bar Component
// TODO: Clean up and create better documentation
// TODO: Update wrapper components to spread props
export const SearchBar = 
    <
    T,
    Multiple extends boolean = false,
    DisableClearable extends boolean = false,
    FreeSolo extends boolean = false
    >(
        {
            close=false,
            expanding = false,
            targets=[],
            source,
            page=0,
            setPage,
            searchResults,
            setResults,
            setTotal,
            ...autocompleteProps
        }:SearchBarProps<T, Multiple, DisableClearable, FreeSolo>,
    ) =>  {
    const [searchTerm, setSearchTerm] = useState("")
    const [focus, setFocus] = useState(false)
    const [open, setOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null);

    // API Search Functions
    const {search: bchSearch } = bchBooksClient()
    const {search: googleSearch} = googleBooksClient()

    const navigate = useNavigate()

    // Handlers
    const handleFocus = () => {
        setFocus(true)
    }

    const handleBlur = () => {
        setFocus(false)
    }

    const handleOpen = () => {
        setTimeout(() => setOpen(true), 300)
    }

    const handleClose = () => {
        setOpen(false)
    }

    // Debounce search to reduce number of api requests
    const debouncedSearch = useCallback(debounce((searchFunc, params) => {
        searchFunc(...params).then((res: BchSearchResults | GoogleSearchResults) => {setResults(
            ("results" in res
            ? res.results
            : res.items) as T[]
        ) 
        // Google totalItems is unreliable, set to 100 items max
        setTotal && setTotal(
            "totalItems" in res
            ? res.totalItems > 1000
                ? 100
                : res.totalItems
            : res.total
        )}
    )
    }, 500), [searchTerm, page, bchSearch, googleSearch])

    useEffect(() => {
        return () => {
            debouncedSearch.cancel()
        }
    }, [debouncedSearch])

    //Handles state management on user search
    useEffect(() => {
            if (targets.includes("bchbooks"))
            {
                searchTerm !== "" && debouncedSearch(bchSearch, [searchTerm, page] )}
                setPage && setPage(0)
            if (targets.includes("googleBooks")) 
            {
                searchTerm !== "" && debouncedSearch(googleSearch, [{"intitle": searchTerm}, page])
                setPage && setPage(0)
            }
            if (source) {
                if (searchTerm === "") {
                    setResults(source)
                }
                else {
                    const filteredResults = source.filter(book => {
                        if (typeof book === "object" && book !== null) { 
                            return Object.values(book).some(v =>                         
                            String(v).toLocaleLowerCase().includes(searchTerm.toLowerCase())                        
                    )
                }
                })
                setResults(filteredResults)}
                setPage && setPage(1)
            }


    }, [searchTerm])

    //Handles state management on pagination change
    useEffect(() => {
        if (searchTerm !== "")
        {
            if (targets.includes("bchbooks"))
            {
                bchSearch(searchTerm, page).then(res => {
                    setResults(res.results as T[])
                    setTotal && setTotal(res.total)
                })
            }
            if (targets.includes("googleBooks"))
            {
                googleSearch({"intitle": searchTerm}, page).then(res => {
                    setResults(res.items as T[])
                    setTotal && setTotal(
                        res.totalItems > 1000
                        ? 100
                        : res.totalItems
                    )
                })
            }
        }
    },[page])

    return (
        <Autocomplete
            clearOnBlur={false}
            {...autocompleteProps}
            open={close? false : open}
            onOpen={handleOpen}
            onClose={handleClose}
            selectOnFocus
            filterOptions={(x) => x}
            className="self-center"
            getOptionLabel={(option) => {
                if (typeof option === 'string') return option
                if (typeof option === "object" && option !== null) 
                    {
                        if ("title" in option && typeof option.title === "string") return option.title
                        if ("volumeInfo" in option && option.volumeInfo && typeof option.volumeInfo === "object" && "title" in option.volumeInfo && option.volumeInfo.title && typeof option.volumeInfo.title === "string") return option.volumeInfo.title
                    }
                return ""
            }}
            options={searchResults}
            onInputChange={(_, value) => {
                setSearchTerm(value)
            }}
            onChange={(_, value) => {
                if (value) {
                    if (typeof value === "string") {
                        return
                    } 
                    else if (typeof value === "object" && value !== null && "id" in value && (typeof value.id === "number" || typeof value.id === "string")) {
                        let id: number | string | undefined
                        let source: string | undefined
                        
                        if ("title" in value) {
                            id = value.id
                            source = "bch"
                        }
                        else if ("volumeInfo" in value) {
                            id = value.id
                            source = "google"
                        }
                        navigate(`/books/${source}/${id}`)
                    }

                }

            }}
            getOptionKey={(option) => {
                if (typeof option === 'string' && option !== null) return option
                if (typeof option === "object" && option !== null && "id" in option && option.id && (typeof option.id === "string" || typeof option.id === "number")) {return option.id}
                return "as"
            }}
            renderInput={(params) => (
        <TextField 
                {...params}
            inputRef={inputRef}
            className={`
                text-white
                transition-all
                duration-300
                ${!expanding
                ? ""
                : expanding 
                    ? focus                     
                        ? "w-[200px]"
                        : "w-[60px]"
                    : "w-[200px]"
            }`
            }
            slotProps={{
                root : {
                    className: "self-center"
                },
                input: {
                    ...params.InputProps,
                    endAdornment: (
                        <>
                        <InputAdornment position="end">
                            <IconButton 
                                disableRipple
                                disableFocusRipple
                                tabIndex={-1}
                                onClick={() => {
                                    inputRef.current?.focus()
                                    !open && handleOpen()                                
                                }}
                                >
                                <Search sx={{
                                    color: colors.input.main,
                                }} />
                            </IconButton>
                        </InputAdornment>
                        </>
                    ),
                    className: `rounded-full p-0`,
                },
                
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                "& fieldset": {
                    borderColor: "white",
                },
                "&:hover fieldset": {
                    borderColor: "gray", // hover color
                },
                "&.Mui-focused fieldset": {
                    borderColor: "white", // focused color
                },

            }
            }}
            size="small"
            onFocus={handleFocus}
            onBlur={handleBlur}
            />
            )}

            />
    )
}