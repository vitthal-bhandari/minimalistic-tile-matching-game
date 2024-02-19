// Import necessary React and Material-UI components
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Icon, Modal, Button, Box, Typography, IconProps, DialogProps, useTheme, useMediaQuery, IconButton  } from '@mui/material';
import { AssignmentIndTwoTone as icon1, AssignmentTwoTone as icon2, BugReportTwoTone as icon3, 
  CastConnectedTwoTone as icon4, CastTwoTone as icon5, ChatTwoTone as icon6, ReportProblemTwoTone as icon7, 
  VolunteerActivismTwoTone as icon8, X, GitHub } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { addScore, setScore } from "@/redux/features/addScore/addScoreSlice"

// Define the TileGridProps type
interface TileGridProps {}

// Define the TileGrid component
const TileGrid: React.FC<TileGridProps> = () => {

  const score = useAppSelector(state => state.todoReducer.score);
  const highscore = useAppSelector(state => state.todoReducer.highscore);

  const dispatch = useAppDispatch()

  // State to track the clicked tiles
  const [clickedTiles, setClickedTiles] = useState<boolean[]>(Array(16).fill(false));

  // State to track the index and icon of the previously clicked tile
  const [prevClickedTile, setPrevClickedTile] = useState<{ index: number, icon: React.FC | null }>({ index: -1, icon: null });

  // State for the countdown timer
  const [timer, setTimer] = useState<number>(30);

  // State to track whether the game is over
  const [gameOver, setGameOver] = useState<boolean>(false);

  // State to control the modal visibility
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  const handleTileClick = (index: number): void => {
    // If the tile is already permanently clicked, do nothing
    if (gameOver || clickedTiles[index]) {
      return;
    }

    // If no previous tile has been clicked
    if (prevClickedTile.index === -1) {
      // Set the current tile as clicked
      setClickedTiles((prev) => [...prev.slice(0, index), true, ...prev.slice(index + 1)]);
      // Update the state with the current clicked tile's index and icon
      setPrevClickedTile({ index, icon: tileIcons[index] });
    } else {
      setClickedTiles((prev) => [...prev.slice(0, index), true, ...prev.slice(index + 1)]);

      // Compare the icons of the previously clicked tile and the current clicked tile
      if (prevClickedTile.icon === tileIcons[index]) {
        // If they match, set both tiles as permanently clicked
        // do some animation/modal
        dispatch(addScore(100));
      } else {
        // If they don't match, reset the previous clicked tile state and update the current tile
        setTimeout(() => {
          setClickedTiles((prev) => [...prev.slice(0, index), false, ...prev.slice(index + 1)]);
          setClickedTiles((prev) => [...prev.slice(0, prevClickedTile.index), false, ...prev.slice(prevClickedTile.index + 1)]);
        }, 750); // 2000 milliseconds delay (2 seconds)
      }
      setPrevClickedTile({ index: -1, icon: null }); // Reset the previous clicked tile state
    }
  };

  // Function to handle modal close
  const handleCloseModal: DialogProps["onClose"] = (event, reason) => {
    if (reason && reason === "backdropClick")
        return;
    setModalOpen(false);
    if (gameOver) {
      // If the modal is closed and the game is over, reset the game
      resetGame();
    }
  };

  // Function to handle game reset
  const resetGame = () => {
    setTimer(30);
    setGameOver(false);
    setClickedTiles(Array(16).fill(false));
    setPrevClickedTile({ index: -1, icon: null });
    setModalOpen(false);
    dispatch(setScore(0));
  };

  // Sample icons for the tiles
  const icons: React.FC[] = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8];

  // Generate pairs of icons for the tiles
  const initialTileIcons: React.FC[] = [...icons, ...icons];

  // State to store the shuffled array
  const [tileIcons, setTileIcons] = useState<React.FC[]>(initialTileIcons);

  useEffect(() => {
    // Shuffle the array of icons
    const shuffledIcons = [...initialTileIcons];
    for (let i = shuffledIcons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIcons[i], shuffledIcons[j]] = [shuffledIcons[j], shuffledIcons[i]];
    }

    // Set the shuffled array in the state
    setTileIcons(shuffledIcons);
  }, []); // empty dependency array ensures it runs once after the initial render


  // Countdown timer effect
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000); // Update the timer every 1000 milliseconds (1 second)

    // Cleanup function to clear the interval when the component unmounts or the game is over
    return () => clearInterval(timerId);
  }, [gameOver]);

  // Check for unmatched tiles when the timer reaches 0
  useEffect(() => {
    if (timer === 0) {
      const unmatchedTilesExist = clickedTiles.some((clicked) => !clicked);
      
      if (unmatchedTilesExist) {
        // Show modal with placeholder text
        setModalOpen(true);
        setGameOver(true);
      }
    }
    else{
      const allTilesMatched = clickedTiles.every((clicked) => clicked)

      if (allTilesMatched) {
        // Show modal with placeholder text
        dispatch(addScore(timer*100));
        setTimer(0);
        setModalOpen(true);
        setGameOver(false);
      }
    }
  }, [timer, clickedTiles]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const styles = {
    root: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      width: 400, // Default width for larger screens
      [theme.breakpoints.down('sm')]: { // For screens smaller than or equal to sm (phone screens)
        width: 250,
      },
    },
    time: {
      fontSize: isMobile? "0.8rem" : "1rem",
      justifyContent: "right",
      display: "flex"
    },
    header: {
      width:  isMobile ? "280px": '400px',
    },
    icons: {
      display: "flex",
      alignItens: "center",
      justifyContent: "center"
    }
  };


  return (
    <Grid 
      container
      direction="column"
      justifyContent="center"
      alignContent="center"
    >
      <Grid item sx={styles.header}>
        <Grid container>
          <Grid item xs={8}>
            <Typography  variant={isMobile ? "h4": "h3"} component="h1">
              Match the Tiles
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Grid container direction="column">
              <Grid item>
                <Typography sx={styles.time}>
                  score: {score}
                </Typography>
              </Grid>
              <Grid item>
                <Typography sx={styles.time}>
                  high score: {highscore}
                </Typography>
              </Grid>
              <Grid item>
                <Typography sx={styles.time}>
                  time: {timer}
                </Typography>
              </Grid>
            </Grid>
            
          </Grid>
        </Grid>
      </Grid>
      <Grid container columns={{ xs: 8 }} sx={{
          width:  isMobile ? "280px": '400px',
          height: isMobile ? "280px": '400px',
          marginTop: '20px'
      }}
      >
        {tileIcons.map((_, index) => (
          <Grid item key={index} xs={2}>
            <Paper
              sx = {{ 
                  width: isMobile ? "70px": '100px', 
                  height: isMobile ? "70px": '100px', 
                  transform: `rotateY(${clickedTiles[index] ? 180 : 0}deg)`, 
                  transition: 'transform 0.5s', 
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
              }}
              onClick={() => handleTileClick(index)}
            >
              {clickedTiles[index] && 
              <Icon key={index} sx={{ fontSize: "40px", display: "flex", justifyContent: "center", alignContent: "center" }}>
                {React.createElement(tileIcons[index], {
                  // Add any props you want to pass to the icon
                  style: { fontSize: "40px" },
                } as IconProps )}
              </Icon>
              }
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Modal for placeholder text */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box 
      sx={styles.root}
      >
        <Typography id="modal-modal-title" variant="h5" component="h2">
        {gameOver ? 'Game Over' : 'Restart Game'}
        </Typography>
        <Typography id="modal-modal-sub-title" variant="h6" component="h4">
          Score: {score}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        {gameOver ? (
            'Unmatched tiles left! Sorry but you ran out of time.'
          ) : (
            `Congratulations! You've matched all tiles!`
          )}
        </Typography>
        <Button onClick={resetGame} sx={{padding: '0', marginTop: '16px'}}>Restart</Button>
        <Grid container>
          <Grid item sx={styles.icons}>
            <p style={{display: "flex", alignItems: "center"}}>Find me on:</p>

            <IconButton 
              aria-label="X" 
              href="https://twitter.com/Vit_Bhandari" // Your GitHub URL
              target="_blank" // Open in new tab
              rel="noopener noreferrer" // Security measures
              sx={{
                '&:hover': { color: 'black' }, // Hover effect
              }}
              title="X" // Tooltip
            >
              <X />
            </IconButton>

            <IconButton 
              aria-label="GitHub"               
              href="https://github.com" // Your GitHub URL
              target="_blank" // Open in new tab
              rel="noopener noreferrer" // Security measures
              sx={{
                '&:hover': { color: 'black' }, // Hover effect
              }}
              title="GitHub" // Tooltip
            >
              <GitHub />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      </Modal>
    </Grid>

  );
};

export default TileGrid;
