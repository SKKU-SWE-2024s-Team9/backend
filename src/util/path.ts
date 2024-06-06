import path from "node:path";

export const staticPath = process.env.NODE_ENV === "production" ? 
    path.join("/app/public/") : 
    path.join(__dirname, "../../public/");