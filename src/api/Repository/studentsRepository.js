import { axiosInstance } from "@/api/Axios";

export async function fetchStudents() {
    return await axiosInstance.get("/students")
        .then(({ data }) => data.students);
}

export async function fetchStudentsByClassId(id) {
    return await axiosInstance.get(`/students-by-class/${id}`)
        .then(({ data }) => data.students)
}