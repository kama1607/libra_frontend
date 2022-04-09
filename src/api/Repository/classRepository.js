import { axiosInstance } from "@/api/Axios";

export async function fetchClasses() {
    return await axiosInstance.get("/classes")
        .then(({ data }) => data.clsses);
}