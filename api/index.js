const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Configure AWS using environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const TABLE_NAME = 'drefotball_players';
const BUCKET_NAME = 'drefotball-player-images';

// Helper function to sanitize DynamoDB response
function sanitizePlayer(player) {
  const sanitized = {};
  for (const [key, value] of Object.entries(player)) {
    if (typeof value === 'object' && value !== null && 'N' in value) {
      sanitized[key] = parseFloat(value.N);
    } else if (typeof value === 'object' && value !== null && 'S' in value) {
      sanitized[key] = value.S;
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Authentication endpoint
app.post('/api/authenticate', async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'killer8speed';
    
    if (password === adminPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all players
app.get('/api/players', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME
    };
    
    const result = await dynamodb.scan(params).promise();
    const players = result.Items.map(sanitizePlayer);
    
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Add new player
app.post('/api/players', async (req, res) => {
  try {
    const { password, player } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'killer8speed';
    
    if (password !== adminPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const playerId = Date.now().toString();
    const playerData = {
      id: playerId,
      ...player,
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: TABLE_NAME,
      Item: playerData
    };

    await dynamodb.put(params).promise();
    res.json({ success: true, player: sanitizePlayer(playerData) });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ error: 'Failed to add player' });
  }
});

// Update player
app.put('/api/players/:id', async (req, res) => {
  try {
    const { password, player } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'killer8speed';
    
    if (password !== adminPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const playerId = req.params.id;
    const playerData = {
      id: playerId,
      ...player,
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: TABLE_NAME,
      Item: playerData
    };

    await dynamodb.put(params).promise();
    res.json({ success: true, player: sanitizePlayer(playerData) });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

// Delete player
app.delete('/api/players/:id', async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'killer8speed';
    
    if (password !== adminPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const playerId = req.params.id;
    const params = {
      TableName: TABLE_NAME,
      Key: { id: playerId }
    };

    await dynamodb.delete(params).promise();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

// Upload image to S3
app.post('/api/upload', async (req, res) => {
  try {
    const { password, image, fileName } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'killer8speed';
    
    if (password !== adminPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const key = `players/${Date.now()}-${fileName}`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg'
    };

    const result = await s3.upload(params).promise();
    res.json({ success: true, imageUrl: result.Location });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// For Vercel serverless functions
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

