import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  name: '',
  username: '',
  email:'',
  access_token: '',
  isAdmin: false,
  isTeacher: false,
  password: '',
  phone: '',
  courseBuyed: [] as string[],
  completedLessons: [] as string[],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
        // state.name = action.payload.name
        // state.username = action.payload.username
        // state.access_token = action.payload.access_token

        const {id, name, username, email, access_token, isAdmin, isTeacher, password, phone, courseBuyed, completedLessons} = action.payload

        state.id = id || ''
        state.name = name 
        state.username = username
        state.email = email
        state.access_token = access_token
        state.isAdmin = isAdmin
        state.isTeacher = isTeacher
        state.password = password
        state.phone = phone
        state.courseBuyed = courseBuyed || []
        state.completedLessons = completedLessons || []
    },
    markLessonComplete: (state, action) => {
        if (!state.completedLessons.includes(action.payload)) {
            state.completedLessons.push(action.payload);
        }
    }
    
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, markLessonComplete } = userSlice.actions

export default userSlice.reducer