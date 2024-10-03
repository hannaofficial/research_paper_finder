// app/api/bookmark/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';

export async function POST(request) {
  let client;

  try {
    // Get database client
    client = await connectDB();

    const body = await request.json();
    const { paper } = body;

    if (!paper || !paper.name || !paper.author) {
      return NextResponse.json(
        { error: 'Invalid paper data' },
        { status: 400 }
      );
    }

    // **1. Create table if it doesn't exist**
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        author TEXT NOT NULL,
        published_date TEXT,
        link TEXT,
        importance TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // **2. Check for existing paper after ensuring the table exists**
    const existingPaper = await client.query(
      'SELECT * FROM bookmarks WHERE name = $1 AND author = $2',
      [paper.name, paper.author]
    );

    if (existingPaper.rows.length > 0) {
      return NextResponse.json(
        { error: 'Paper already bookmarked' },
        { status: 409 }
      );
    }

    // Insert the paper
    const result = await client.query(
      `INSERT INTO bookmarks (name, author, published_date, link, importance)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        paper.name,
        paper.author,
        paper.published_date || null,
        paper.link || null,
        paper.importance || null
      ]
    );

    console.log(result)

    return NextResponse.json({
      message: 'Paper saved successfully!',
      paper: result.rows[0]
    },{status:200})

  } catch (error) {
    console.error('Error saving paper:', error);
    return NextResponse.json(
      { error: 'Failed to save paper' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

// for extracting data

export async function GET(request) {
  let client;

  try {
    
    client = await connectDB();

    
    const result = await client.query('SELECT * FROM bookmarks ORDER BY created_at DESC');

    
    return NextResponse.json({
      message: 'Bookmarks fetched successfully!',
      bookmarks: result.rows
    });

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}


//delete

export async function DELETE(request) {
  let client;

  try {
    client = await connectDB();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid paper id' },
        { status: 400 }
      );
    }

    // Delete the paper
    const result = await client.query(
      'DELETE FROM bookmarks WHERE id = $1::integer RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Paper deleted successfully!',
      paper: result.rows[0]
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting paper:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Failed to delete paper' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
