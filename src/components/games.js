import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "../apolloClient";
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
import { Delete } from "@mui/icons-material";

const GET_GAMES = gql`
  query GetGames {
    games {
      id
      title
      platform
    }
  }
`;

const ADD_GAME = gql`
  mutation AddGame($game: AddGameInput!) {
    addGame(game: $game) {
      id
      title
      platform
    }
  }
`;

const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      id
      title
      platform
    }
  }
`;

export default function Games() {
  const { loading, error, data, refetch } = useQuery(GET_GAMES);
  const [addGame] = useMutation(ADD_GAME);
  const [deleteGame] = useMutation(DELETE_GAME);

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");

  const handleAddGame = async () => {
    await addGame({
      variables: { game: { title, platform: platform.split(",") } },
    });
    refetch();
  };

  const handleDeleteGame = async (id) => {
    await deleteGame({ variables: { id } });
    refetch();
  };

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        Error :(
      </Typography>
    );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Games
      </Typography>
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
