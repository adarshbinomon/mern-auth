import { apiSlice } from "./apislice";

const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data
            })
        }),
        logout: builder.mutation({
            query: ()=> ({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            })
        }),
        updateUser: builder.mutation({
            query: (data)=> ({
                url: `${USERS_URL}/profile`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserMutation } = usersApiSlice;