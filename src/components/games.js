// Import React and useState hook
import React, { useState } from "react";
// Import useQuery and useMutation hooks from Apollo Client
import { useQuery, useMutation } from "@apollo/client";
// Import gql function from apolloClient
import { gql } from "../apolloClient";
// Import MUI components for styling
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Paper,
} from "@mui/material";
// Import Delete icon from MUI icons
import { Delete } from "@mui/icons-material";

// Define GraphQL query to get all games
const GET_GAMES = gql`
  query GetGames {
    games {
      id
      title
      platform
    }
  }
`;

// Define GraphQL mutation to add a new game
const ADD_GAME = gql`
  mutation AddGame($game: AddGameInput!) {
    addGame(game: $game) {
      id
      title
      platform
    }
  }
`;

// Define GraphQL mutation to delete a game by ID
const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      id
      title
      platform
    }
  }
`;

// Define and export the Games component
export default function Games() {
  // Use useQuery hook to fetch games data
  const { loading, error, data, refetch } = useQuery(GET_GAMES);
  // Use useMutation hooks for adding and deleting games
  const [addGame] = useMutation(ADD_GAME);
  const [deleteGame] = useMutation(DELETE_GAME);

  // State variables for game title and platform
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");

  // Function to handle adding a new game
  const handleAddGame = async () => {
    await addGame({
      variables: { game: { title, platform: platform.split(",") } },
    });
    refetch(); // Refetch the games list after adding
  };

  // Function to handle deleting a game by ID
  const handleDeleteGame = async (id) => {
    await deleteGame({ variables: { id } });
    refetch(); // Refetch the games list after deleting
  };

  // Show loading message while data is being fetched
  if (loading) return <Typography variant="h6">Loading...</Typography>;
  // Show error message if there is an error
  if (error)
    return (
      <Typography variant="h6" color="error">
        Error :(
      </Typography>
    );

  return (
    <Container>
      {/* Display the title */}
      <Typography variant="h4" gutterBottom>
        Games
      </Typography>
      {/* List all games */}
      <List component={Paper} style={{ marginBottom: "20px" }}>
        {data.games.map((game) => (
          <ListItem key={game.id} divider>
            <ListItemText
              primary={game.title}
              secondary={`Platform: ${game.platform.join(", ")}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleDeleteGame(game.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {/* Form to add a new game */}
      <Paper style={{ padding: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Add a new game
        </Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Platform (comma separated)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddGame}
        >
          Add Game
        </Button>
      </Paper>
    </Container>
  );
}
