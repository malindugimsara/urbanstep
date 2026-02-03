import { createClient } from "@supabase/supabase-js";

const  supabase = createClient(
    "https://bwzzvppryhabbwtghqfh.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3enp2cHByeWhhYmJ3dGdocWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTQzNzUsImV4cCI6MjA2NzQ3MDM3NX0.-ZNE_wzJFtSJogzSzZsGIQfz_u98N-_eO7iWUF-Rp2c"
)

export default function mediaUpload(file){
    const promise = new Promise((resolve, reject) => {
        if (file === null || file === undefined){
            reject("File is null or undefined");
        }
        const timespan = new Date().getTime();
        const newFileName = timespan + "-" + file.name;

        supabase.storage.from("images").upload(newFileName, file, {
            cacheControl: "3600",
            upsert: false
        }).then(() => {
            const imageUrl = supabase.storage.from("images").getPublicUrl(newFileName).data.publicUrl;
            resolve(imageUrl);
            
        }).catch((error) => {
            reject(error.message);
        })
    })
    return promise;
}