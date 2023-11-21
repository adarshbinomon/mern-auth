import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'


const baseQuery = fetchBaseQuery({baseURL: ''});

export const  apiSlice = createApi({
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({})
})