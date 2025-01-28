import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  LinearProgress, 
  Typography, 
  Box 
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useBudgets } from '../../context/BudgetContext';

const BudgetList = () => {
  const { budgets, spending } = useBudgets();

  const getProgress = (category) => {
    const spent = spending[category]?.toString() || '0';
    const budget = budgets[category]?.toString() || '1';
    return (Number(spent) / Number(budget)) * 100;
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'error';
    if (progress >= 70) return 'warning';
    return 'primary';
  };

  return (
    <List>
      {Object.entries(budgets).map(([category, budget]) => {
        const progress = getProgress(category);
        return (
          <ListItem
            key={category}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton edge="end" onClick={() => {}}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => {}}>
                  <Delete />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={category.charAt(0).toUpperCase() + category.slice(1)}
              secondary={
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    color={getProgressColor(progress)}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {spending[category]?.toString() || '0'} / {budget.toString()} ETH
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default BudgetList;