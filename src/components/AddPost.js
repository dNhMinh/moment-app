import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { storage, db } from "../firebase";
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const AddPost = ({ username }) => {

    const [caption, setcaption] = useState('')
    const [progress, setprogress] = useState(0)

    const [image, setImage] = useState(null)

    const handleChange = (e)=>{
            if (e.target.files[0]){
                setImage(e.target.files[0])
            }
    }

    const handleUpload = ()=>{
        if (!image) {
            alert("Please select an image.");
            return;
        }
        else{
            alert("Upload successful");
        }
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTranferred / snapshot.totalBytes) * 100
                );
                setprogress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            userName: username
                        })
                    })

            }
        )

        setcaption(' ')
        setImage(null)
    }

    return (
        <div className="imagesupload">
            <h2 style={{textAlign:'center', margin: '15px'}}>Share your moments</h2>
            <br/>
            <input className="file-input" type="file" onChange={handleChange}/>
            <br/>

            <TextField id="filled-basic" label='Wanna say something?' variant="filled"
                onChange={(e)=>{setcaption(e.target.value)}}
                value={caption}
            />
            <br/>

            <process className='progress' value={progress} max='100' />
            <br/>

            <Button variant="contained" color="primary" onClick={handleUpload}>
                Share

            </Button>
        </div>
    )
}

export default AddPost;