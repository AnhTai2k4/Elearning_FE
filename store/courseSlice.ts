import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { create } from "domain";

interface Course {
    id: string;
    _id?: string;
    title: string;
    describe: string;
    price: number;
    image: string;
    slug: string;
    grade?: number;
    tags?: string[];
    releaseDate?: string;
}

interface CourseState {
    items: Course[];
}

const initialState: CourseState = {
    items: [],
}

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        setCourses: (state, action: PayloadAction<Course[]>) => {
            state.items = action.payload;
        },
    },
},)

export const {setCourses} = courseSlice.actions;
export default courseSlice.reducer;   