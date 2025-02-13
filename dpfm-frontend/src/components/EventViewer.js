import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Link,
  CircularProgress
} from '@mui/material';
import { useContractEvents } from '../hooks/useContractEvents';

export default function EventViewer({ contract }) {
  const { events, isLoading, error } = useContractEvents(contract);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ bgcolor: 'error.light', color: 'error.dark', my: 2 }}>
        <CardContent>
          <Typography>Error loading events: {error.message}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ my: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Events
        </Typography>
        <List>
          {events.map((event, index) => (
            <ListItem 
              key={`${event.transactionHash}-${index}`}
              divider={index !== events.length - 1}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={event.type}
                      color={event.type === 'TransactionAdded' ? 'primary' : 'secondary'}
                      size="small"
                    />
                    {event.type === 'TransactionAdded' && (
                      <Typography>
                        {event.amount} ETH - {event.category}
                      </Typography>
                    )}
                    {event.type === 'BudgetUpdated' && (
                      <Typography>
                        New Budget: {event.newLimit} ETH
                      </Typography>
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      {event.timestamp.toLocaleString()}
                    </Typography>
                    <Link 
                      href={`https://sepolia.etherscan.io/tx/${event.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Etherscan
                    </Link>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}