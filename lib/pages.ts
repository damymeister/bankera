export const pageStartIndex = (itemsPerPage: number, currentPage: number) => {
    return (currentPage - 1) * itemsPerPage
}

export const pageEndIndex = (itemsPerPage: number, currentPage: number, totalPages: number, arrayLength: number) => {
    if (currentPage === totalPages) return arrayLength
    return pageStartIndex(itemsPerPage, currentPage) + itemsPerPage
}