import { Search } from "@mui/icons-material"
import { Autocomplete, IconButton, InputAdornment, TextField } from "@mui/material"
import debounce from "lodash.debounce"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

interface SearchAdapter<T> {
    getKey(option: T): string,
    search(term: string): Promise<T[]>
    getLabel(option: T): string,
    getType(): string,
    select(option: T): void
}

type SearchBar1Props<T> = {
    adapters: SearchAdapter<T>[],
    iconPosition?: "start" | "end",
    hideOptions?: boolean,
    collapse?: boolean,
    limit? : number,
    viewMore? : boolean,
    initialQuery?: string,
    initialResults?: T[],
    onSearchResults?: (query: string, results: T[]) => void
}

type ViewMoreOption = {
    isViewMore: true,
    type: string
}

export const SearchBar1 =<T extends {type: string}>({
    adapters,
    iconPosition="start",
    hideOptions=false,
    collapse,
    limit,
    viewMore=false,
    initialQuery,
    initialResults,
    onSearchResults
} : SearchBar1Props<T>) => {
    const [options, setOptions] = useState<T[]>(initialResults || [])
    const [searchTerm, setSearchTerm] = useState(initialQuery || "")
    const [focus, setFocus] = useState(false)
    const [open, setOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()
    
    
    const adapterMap = useMemo(() => {
        const map = new Map<string, SearchAdapter<T>>()

        adapters.forEach(adapter => {
            map.set(adapter.getType(), adapter)
        })

        return map
    }, [adapters])

    const handleSearch = useCallback(debounce(async (term) => {
        setOptions([])

        await Promise.all(
            Array.from(adapterMap.values()).map(async adapter => {
                const results = await adapter?.search(term)
                results && setOptions(prev => [...prev, ...results])
            })
        )
    }, 500), [adapterMap])

    const limitedOptions = useMemo(() => {
        if (!limit) return options

        const grouped = new Map<string, T[]>()
        const result: (T | ViewMoreOption)[] = []

        options.forEach(option => {
            if (!grouped.has(option.type)) {
                grouped.set(option.type, [])
            }
            grouped.get(option.type)!.push(option)
        })

        grouped.forEach((items, type) => {
            result.push(...items.slice(0, limit))

            if (viewMore && items.length > limit) {
                result.push({
                    isViewMore: true,
                    type,
                })
            }
        })

        return result
    }, [options, limit, viewMore])

    const getLabel = (option: T | ViewMoreOption | string): string => {
        if (typeof option === "string") {
            return option;
        }
        
        if (`isViewMore` in option) {
            return `View more results...`
        }
        return adapterMap.get(option.type)?.getLabel(option) ?? ""
    }

    const getKey = (option: string | T | ViewMoreOption) => {
        if (typeof option === "string") return option        
        
        if (`isViewMore` in option) {
            return `view-more-${option.type}`
        }

        return adapterMap.get(option.type)?.getKey(option) || ""
    }

    const handleSelect = (option: string | T | ViewMoreOption | null) => {
        if (!option || typeof option === "string") return


        if (`isViewMore` in option) {
            const allForType = options.filter(o => o.type === option.type)
            navigate(`/results/${encodeURIComponent(option.type)}/${encodeURIComponent(searchTerm)}`, { state: allForType})
        } else {
            adapterMap.get(option.type)?.select(option)
        }
    }

    useEffect(() => {
        return () => {
            handleSearch.cancel()
        }
    }, [handleSearch])

    useEffect(() => {
        handleSearch(searchTerm)
    }, [searchTerm, handleSearch])

    useEffect(() => {
        if (searchTerm !== initialQuery) {
        onSearchResults?.(searchTerm, options)
        }
    }, [options, searchTerm])

    return (

<Autocomplete
            className="flex h-fit"
            fullWidth
            size="small"
            getOptionLabel={getLabel}
            groupBy={adapters.length > 1 ? (option) => option.type: undefined}
            open={hideOptions ? false : open}
            options={limitedOptions}
            freeSolo
            onInputChange={(_,value) => {
                setSearchTerm(value)
            }}
            filterOptions={(x) => x}
            inputValue={searchTerm}
            onChange={(_,option) => handleSelect(option)}
            onOpen={() => setTimeout(() => setOpen(true), 300)}
            onClose={() => setOpen(false)}
            getOptionKey={getKey}
            renderInput={(params) => (
                <TextField
                    {...params}
                    className={`
                        ml-auto
                        transition-all
                        duration-300
                        ${collapse && !focus && "w-15"}
                        `}
                    inputRef={inputRef}
                    slotProps={{
                        root : {
                            className: "self-center"
                        },
                        input: {
                            ...params.InputProps,
                            onClick: () => setFocus(true),
                            onBlur: () => setFocus(false),
                            className: `rounded-full p-[6px]`,
                            endAdornment: iconPosition === "end" && (
                                <InputAdornment position="start">
                                    <IconButton
                                        disableRipple
                                        disableFocusRipple
                                        tabIndex={-1}
                                    >
                                        <Search/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                            startAdornment: iconPosition === "start" && (
                                <InputAdornment position="start">
                                    <IconButton>
                                        <Search/>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                />
            )}
        />
    )}

