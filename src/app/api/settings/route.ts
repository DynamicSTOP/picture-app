import 'server-only';
import { NextRequest, NextResponse } from "next/server.js";

// Handle GET requests
export async function GET(request: NextRequest) {
  // Access query parameters
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  // Simulate fetching data
  if (id) {
    return NextResponse.json({ message: `Data for ID: ${id}` });
  } else {
    return NextResponse.json({ message: 'Hello from GET API handler!' });
  }
}

// Handle POST requests
export async function POST(request: NextRequest) {
  // Access request body
  const body = await request.json();
  const { name, value } = body;
  // Simulate processing data
  if (name && value) {
    return NextResponse.json({ message: `Received: Name - ${name}, Value - ${value}` }, { status: 201 });
  } else {
    return NextResponse.json({ message: 'Invalid data provided' }, { status: 400 });
  }
}