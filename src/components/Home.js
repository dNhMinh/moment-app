import { Button, Input, Modal, createTheme, withTheme } from "@mui/material";
import React, { useEffect, useState, Component } from "react";
import { makeStyles } from "@mui/styles";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import logo from "C:/Users/dnm14/moment/src/moment-logo.jpg"
import AddPost from "./AddPost";
import Posts from "./Posts";
const theme = createTheme();
function getModalStyle(){
    return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: "white",
        border: '0px solid rgba(128, 0, 128, 0.5)',
        boxShadow: '15px 15px 18px rgba(128, 0, 128, 0.5)',
        padding: '20px 20px 10px',
    },
}));

const Home = () => {
    
    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle)

    const [openSignup, setOpenSignup] = useState(false)
    const [openSignin, setOpenSignin] = useState(false)

    const [username, setusername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [user, setuser] = useState(null)

    const [posts, setPosts] = useState([])

    const signin = (e) =>{
        e.preventDefault()
        signInWithEmailAndPassword(auth, email,password)
            .catch((e)=>alert(e.message))

        setOpenSignin(false)
    }

    // const signup = (e) =>{
    //     e.preventDefault()
    //     createUserWithEmailAndPassword(email,password)
    //         .then((authUser)=>{
    //             return authUser.user.updateProfile({
    //                 displayName: username,
    //             })
    //         })
    //             .catch((e)=>alert(e.message))

    //         setOpenSignup(false)
    // }
    const signup = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
          .then((authUser) => {
            return updateProfile(authUser.user, {
              displayName: username,
            });
          })
          .catch((error) => alert(error.message));
    
        setOpenSignup(false);
      };

      useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged((authuser) =>{
            if(authuser){
                setuser(authuser)
            }
            else{
                setuser(null)
            }
        })
        return () => {
            unsubscribe() 
        };
      }, [])

      useEffect(() => {
        db.collection("posts")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>{
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        post: doc.data(),
                    }))
                );
            });
      }, []);

    return (
        <div className="app">
            <Modal open={openSignup} onClose={()=>{setOpenSignup(false)}}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                        <img 
                            className="app_headerImage"
                            src={logo}
                            alt="logo"
                            width={250}
                            height={80}
                        />
                        </center>
                        <br />
                        <br />
                        <Input
                            placeholder="Name"
                            type="text"
                            value={username}
                            onChange={(e)=>{setusername(e.target.value)}}
                        />
                        <br />
                        <br />
                        <Input
                            placeholder="Email"
                            type="text"
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}
                        />
                        <br />
                        <br />
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}
                        />
                        <br />
                        <br />
                        <Button type="submit" onClick={signup}>Sign Up</Button>
                    </form>
                </div>
            </Modal>

            <Modal open={openSignin} onClose={()=>{setOpenSignin(false)}}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                        <img 
                            className="app_headerImage"
                            src={logo}
                            alt="logo"
                            width={250}
                            height={80}
                        />
                        </center>
                        <br />
                        <br />
                        
                        <Input
                            placeholder="Email"
                            type="text"
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}
                        />
                        <br />
                        <br />
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}
                        />
                        <br />
                        <br />
                        <Button type="submit" onClick={signin}>Sign In</Button>
                    </form>
                </div>
            </Modal>
            <div className="app__header">
                <img 
                    className="app_headerImage"
                    src={logo}
                    alt="logo"
                    width={250}
                    height={80}
                />

                <div>
                    {user ? <>
                        <div style={{display: 'flex'}}>
                            <h3 style={{ margin: '15px'}}>{user.displayName}</h3>
                            <Button variant='contained' color='primary' onClick={() => { auth.signOut() }}>Log out</Button>
                        </div>
                    </>
                        :<>
                            <Button variant='contained' color='primary' onClick={() => { setOpenSignin(true) }}>Sign in</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button variant='contained' color='primary' onClick={() => { setOpenSignup(true) }}>Sign up</Button>
                        </>

                    }
                    
                </div>

            </div>
            {user && user.displayName ? <>
                <AddPost username={user.displayName} />
            </> :
                <>
                    <div className="unauth">
                        <b style={{cursor:'pointer',color:'blue'}} onClick={()=>setOpenSignin(true)}>Sign in</b>/<b style={{cursor:'pointer',color:'blue'}} onClick={()=>setOpenSignup(true)}>Sign up</b> to share your moments
                    </div>

                </>}   

                {
                    <div className="app__posts">
                        <div className="app__postright">
                            <br />
                            {posts.map(({id,post})=>(
                                <Posts
                                    key={id}
                                    postId={id}
                                    user={user}
                                    userName={post.userName}
                                    caption={post.caption}
                                    imageURL={post.imageURL}
                                />
                            ))}
                        </div>
                    </div>
                }        
        </div>
    )
}

export default Home
