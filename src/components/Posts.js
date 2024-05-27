import { Avatar, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import firebase from "firebase/compat/app";
import { DeleteForever } from '@mui/icons-material';

const Posts = ({ postId, user, userName, caption, imageURL}) => {

    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState([])


    const [show, setShow] = useState(false)
    const [editComment, setEditComment] = useState('')
    const [commentID, setCommentID] = useState('')

    const postComment = (e) => {
        e.preventDefault()
        if (user && user.displayName){
            db.collection("posts").doc(postId).collection("comments").add({
                text: newComment,
                userName: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
    
            setNewComment('')
        }
        
    }

      useEffect(() => {
        let unsubscribe;
        if (postId){
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) =>{
                    setComments(snapshot.docs.map
                        ((doc) => ({
                            id: doc.id,
                            comment: doc.data(),
                    }))
                );
            });
        }
        return () => {
            unsubscribe();
        };

      }, []);

      const handleEdit = (id, txt) => {
        setShow(true)
        setEditComment(txt)
        setCommentID(id)
      }

      const updateComment = () => {
        db.collection("posts")
            .doc(postId)
            .collection("comments")
            .doc(commentID).update({
                text: editComment
            })
        setShow(false)
      }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    src=""
                    alt={userName}
                />

                <h3>{userName}</h3>
                
            </div>
            <img
                className="post__image"
                src={imageURL}
            />
            <p className="post__text">
                <b>{userName}&nbsp;</b>{caption}
            </p>
            <div className="post__comments">
                {comments.map(({id,comment}) => (
                    <>
                        <p key={id}>
                            <b>{comment.userName}</b>: &nbsp; {comment.text}

                            {user && (user.displayName === userName || comment.userName === user.displayName) &&

                                <b>
                                    <Button onClick={() => {handleEdit(id,comment.text)}}>Edit</Button>
                                    <Button style ={{color:"red"}} onClick={() => {
                                        db.collection("posts")
                                            .doc(postId)
                                            .collection("comments")
                                            .doc(id).delete()
                                    }}>Delete</Button>
                                </b>
                            }
                        </p>

                    </>
                ))}


            </div>
            {user && show && <>
                <form className="post__commentbox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Edit comment..."
                        value={editComment}
                        onChange={e => setEditComment(e.target.value)} 
                    />

                    <Button
                        className="post__button"
                        disabled={!editComment}
                        type="submit"
                        onClick={updateComment}
                    >update</Button>

    
                </form>
            </>}

            {user && <>
                <form className="post__commentbox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Post comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)} 
                    />

                    <Button
                        className="post__button"
                        disabled={!newComment}
                        type="submit"
                        onClick={postComment}
                    >POST</Button>
                    {
                        user.displayName === userName &&
                        <Button style={{color:"red"}} onClick={()=>{
                            db.collection("posts").doc(postId).delete()
                        }} >Delete picture</Button>
                    }

    
                </form>
            </>

            }

        </div>
    )
}

export default Posts;