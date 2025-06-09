import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [name, setName] = useState('');
  const [namesList, setNamesList] = useState([]);

  const addName = () => {
    if (name.trim()) {
      setNamesList([...namesList, name.trim()]);
      setName('');
    }
  };

  const removeName = (indexToRemove) => {
    setNamesList(namesList.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #e0f7fa, #f1f8e9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 4, borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              ✨ Name Collector
            </Typography>

            <Box
              sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}
            >
              <TextField
                label="Enter a name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addName}
                disabled={!name.trim()}
              >
                Add
              </Button>
            </Box>

            <Typography variant="h6">Names List:</Typography>
            <List>
              {namesList.length === 0 ? (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  mt={2}
                >
                  No names added yet.
                </Typography>
              ) : (
                namesList.map((n, index) => (
                  <ListItem
                    key={index}
                    divider
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeName(index)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={n} />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default App;

