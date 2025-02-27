import "./App.css";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  onSnapshot,
  addDoc,
  collection,
  orderBy,
  serverTimestamp,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, app } from "../firebase";
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Avatar,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  ThemeProvider,
  Grow,
  Fade,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import theme from "../theme";

const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    const queryd = query(collection(db, "message"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(queryd, (snapShot) => {
      setMessages(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    await addDoc(collection(db, "message"), {
      uid: user.uid,
      photourl: user.photoURL,
      displayName: user.displayName,
      text: newMessage,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  const deleteMessage = async (id) => {
    await deleteDoc(doc(db, "message", id));
    handleCloseContextMenu();
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleContextMenu = (event, id, uid) => {
    if (uid !== user.uid) return;
    event.preventDefault();
    setSelectedMessageId(id);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setSelectedMessageId(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        {user ? (
          <Grow in={true}>
            <Paper elevation={3} sx={{ p: 2, mt: 4, background: "#F1FFF4" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Avatar src={user.photoURL} alt={user.displayName} />
                <Button onClick={handleLogout} color="error">
                  Log out
                </Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box mt={4}>
                <Grid container spacing={2}>
                  {messages.map((msg) => (
                    <Grid
                      item
                      xs={12}
                      key={msg.id}
                      container
                      direction="column"
                      alignItems={
                        msg.data.uid === user.uid ? "flex-end" : "flex-start"
                      }
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems={
                          msg.data.uid === user.uid ? "flex-end" : "flex-start"
                        }
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          {msg.data.uid !== user.uid && (
                            <Avatar
                              src={msg.data.photourl}
                              alt={msg.data.displayName}
                              sx={{ width: 40, height: 40 }}
                            />
                          )}
                          <Box>
                            <Box
                              variant="subtitle2"
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <Typography>{msg.data.displayName}</Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  msg.data.timestamp?.toDate()
                                ).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          onContextMenu={(e) =>
                            handleContextMenu(e, msg.id, msg.data.uid)
                          }
                          sx={{
                            ml: msg.data.uid === user.uid ? 0 : 5,
                            bgcolor:
                              msg.data.uid === user.uid ? "primary.main" : "",
                            color:
                              msg.data.uid === user.uid ? "white" : "black",
                            p: msg.data.id === user.uid ? 0 : 1,
                            borderRadius: 2,
                            position: "relative",
                            width: "47%",
                          }}
                        >
                          <Typography variant="body1">
                            {msg.data.text}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={4} display="flex" gap={2}>
                  <TextField
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    variant="outlined"
                  />
                  <Button
                    onClick={sendMessage}
                    variant="contained"
                    color="primary"
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grow>
        ) : (
          <Box sx={{ display: "grid", placeItems: "center", height: "100vh" }}>
            {" "}
            <Fade in={true}>
              <Button
                onClick={handleGoogleLogin}
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
              >
                Login with Google
              </Button>
            </Fade>
          </Box>
        )}
        <Menu
          open={contextMenu !== null}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={() => deleteMessage(selectedMessageId)}>
            Delete
          </MenuItem>
        </Menu>
      </Container>
    </ThemeProvider>
  );
}
export default App;
