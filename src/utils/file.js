import { storage } from "../config/firebase";
import {getDownloadURL, uploadBytes, ref} from "firebase/storage";

const uploadFile = async (file) =>{
    const storageRef =ref(storage, file.name);
    //luu file tren file base
    const response = await uploadBytes(storageRef, file);
    // lay url
    const downloadURl = await getDownloadURL(response.ref);
    return downloadURl;
}
export default uploadFile; 