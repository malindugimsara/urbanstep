import { createClient } from "@supabase/supabase-js";

const  supabase = createClient(
    "https://ziobsgqspskvrgsgntpd.supabase.co",
    "sb_publishable_kH5Rlu440yHrZi3jTe0atw_32nhaAUK"
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