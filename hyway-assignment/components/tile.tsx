// Import necessary React and Material-UI components
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Icon, Modal, Button } from '@mui/material';
import { AssignmentIndTwoTone as icon1, AssignmentTwoTone as icon2, BugReportTwoTone as icon3, 
  CastConnectedTwoTone as icon4, CastTwoTone as icon5, ChatTwoTone as icon6, ReportProblemTwoTone as icon7, 
  VolunteerActivismTwoTone as icon8 } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { addScore } from "@/redux/features/addScore/addScoreSlice"

// Define the TileGridProps type
interface TileGridProps {}

// Define the TileGrid component
const TileGrid: React.FC<TileGridProps> = () => {

  const score = useAppSelector(state => state.todoReducer.score);
  const dispatch = useAppDispatch()

  // State to track the clicked tiles
  const [clickedTiles, setClickedTiles] = useState<boolean[]>(Array(16).fill(false));

  // State to track the index and icon of the previously clicked tile
  const [prevClickedTile, setPrevClickedTile] = useState<{ index: number, icon: React.FC | null }>({ index: -1, icon: null });

  // State for the countdown timer
  const [timer, setTimer] = useState<number>(60);

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
  const handleCloseModal = () => {
    setModalOpen(false);
    if (gameOver) {
      // If the modal is closed and the game is over, reset the game
      resetGame();
    }
  };

  // Function to handle game reset
  const resetGame = () => {
    setTimer(60);
    setGameOver(false);
    setClickedTiles(Array(16).fill(false));
    setPrevClickedTile({ index: -1, icon: null });
  };

  // Sample icons for the tiles
  const icons: React.FC[] = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8];

  // Generate pairs of icons for the tiles
  const tileIcons: React.FC[] = [...icons, ...icons];

  useEffect(() => {
    // Shuffle the array of icons
    tileIcons.sort(() => Math.random() - 0.5);
    
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
  }, [timer, clickedTiles]);

  return (
    <Grid 
      container
      direction="column"
      justifyContent="center"
    >
      <Grid item >
        {score}
      </Grid>
      <Grid item>
      <div>
        Timer: {timer}
      </div>
      </Grid>
      <Grid container columns={{ xs: 8 }} sx={{
          width: '400px',
          height: '400px'
      }}
      >
        {tileIcons.map((_, index) => (
          <Grid item key={index} xs={2}>
            <Paper
              sx = {{ 
                  width: '100px', 
                  height: '100px', 
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
              <Icon key={index}>
                {React.createElement(tileIcons[index], {
                  // Add any props you want to pass to the icon
                })}
              </Icon>
              }
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Modal for placeholder text */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div>
          <h2>{gameOver ? 'Game Over' : 'Restart Game'}</h2>
          {gameOver ? (
            <p>Unmatched tiles left! Display your placeholder text here.</p>
          ) : (
            <p>Click the restart button to play again.</p>
          )}
          <Button onClick={resetGame}>Restart</Button>
        </div>
      </Modal>
    </Grid>

  );
};

export default TileGrid;
