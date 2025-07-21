import express from 'express';
import { Client } from '@notionhq/client';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const IP = process.env.IP || 'localhost';

// Check Notion DB connectivity at startup for all 3 databases
async function checkNotionConnections() {
  const dbs = [
    { id: process.env.NOTION_INVENTORY_DB_ID, name: 'Inventory' },
    { id: process.env.NOTION_PEOPLE_DB_ID, name: 'People' },
    { id: process.env.NOTION_LOAN_REGISTER_DB_ID, name: 'Loan Register' }
  ];
  for (const db of dbs) {
    try {
      await notion.databases.retrieve({ database_id: db.id });
      console.log(`Connected to Notion ${db.name} database successfully.`);
    } catch (err) {
      console.error(`Failed to connect to Notion ${db.name} database:`, err.message || err);
    }
  }
}
checkNotionConnections();

// Fetch loanable items from the IT Inventory database
app.get('/api/inventory', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_INVENTORY_DB_ID,
      filter: {
        property: 'Loanable', // Assumes a checkbox property named "Loanable"
        checkbox: {
          equals: true,
        },
      },
    });
    // Simplified mapping of Notion pages to a cleaner format
    const items = response.results.map(page => ({
      id: page.id,
      // Assumes "Item Description" is the title property
      name: page.properties['Item Description']?.title[0]?.plain_text || 'Unnamed Item',
      // Assumes "Tech no" is a number property
      techNo: page.properties['Tech No.']?.number ?? 'N/A',
    }));
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    res.status(500).json({ error: 'Failed to fetch inventory from Notion' });
  }
});

// Fetch people from the People database for the dropdown
app.get('/api/people', async (req, res) => {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_PEOPLE_DB_ID,
        });
        const people = response.results.map(page => ({
            id: page.id,
            // Assumes "Name" is the title property in your People DB
            name: page.properties.Name?.title[0]?.plain_text || 'Unnamed Person',
        }));
        
        res.json(people);
    } catch (error) {
        console.error('Error fetching people from Notion:', error);
        res.status(500).json({ error: 'Failed to fetch people from Notion' });
    }
});


// Create a new entry in the Loan Register
app.post('/api/loan', async (req, res) => {
    const { personId, itemId, signOut, signIn, date } = req.body;
    if (!personId || !itemId || typeof signOut !== 'boolean' || typeof signIn !== 'boolean' || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Assumes property names: 'Name' (relation to People), 'Sign out' (checkbox), 'Sign in' (checkbox), 'Date' (date), 'IT inventory' (relation)
        await notion.pages.create({
            parent: { database_id: process.env.NOTION_LOAN_REGISTER_DB_ID },
            properties: {
                // Register ID left blank (Notion will auto-generate page ID)
                'Name': { relation: [{ id: personId }] },
                'Sign Out': { checkbox: signOut },
                'Sign In': { checkbox: signIn },
                'Date': { date: { start: date } },
                '💻 IT Inventory': { relation: [{ id: itemId }] },
            },
        });
        res.status(201).json({ message: 'Loan recorded successfully' });
        console.log('Loan record created successfully in Notion');
    } catch (error) {
        console.error('Error creating loan record in Notion:', error.body || error);
        res.status(500).json({ error: 'Failed to create loan record' });
    }
});

// Health check endpoint for Docker
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen( PORT, () => {
  console.log(`Server running on http://${PORT}`);
});
