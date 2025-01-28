import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Box
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { ethers } from 'ethers';

const BudgetCard = ({ category, budget, spending, onEdit }) => {
  const progress = budget ? (Number(spending || 0) / Number(budget)) * 100 : 0;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            {category.label}
          </Typography>
          <IconButton size="small" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Box>

        <Typography variant="h4" component="div">
          {ethers.utils.formatEther(budget || '0')} ETH
        </Typography>
        
        <Typography color="text.secondary" gutterBottom>
          Spent: {ethers.utils.formatEther(spending || '0')} ETH
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mt: 2,
            height: 8,
            borderRadius: 5,
            backgroundColor: `${category.color}40`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: category.color
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default BudgetCard;