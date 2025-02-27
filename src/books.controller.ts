// Import necessary decorators and utilities from NestJS
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  Headers,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express'; // Import Express Request type

// The @Controller decorator marks this class as a controller
// 'books' is the route prefix - all routes in this controller will start with /books
@Controller('books')
export class BooksController {
  // This is a TypeScript class property
  // It's an array of book objects that we'll use to store our data in memory
  // Each book has a type with id (number), title (string), and author (string)
  private books: {
    id: number;
    title: string;
    author: string;
    price?: number;
  }[] = [
    { id: 1, title: 'NestJS Basics', author: 'John Doe', price: 29.99 },
    { id: 2, title: 'TypeScript 101', author: 'Jane Smith', price: 24.99 },
  ];

  // @Get() decorator creates a route handler for GET requests to /books
  // This method will execute when someone visits http://localhost:3000/books
  @Get()
  findAll() {
    // In TypeScript, we're returning an array of book objects
    // NestJS will automatically convert this to JSON
    return this.books;
  }

  // IMPORTANT: Define all specific routes BEFORE parameterized routes
  // This ensures NestJS matches the correct route handler

  // NEW METHOD: Using the complete Request object
  // This demonstrates how to access the entire request object
  @Get('request/example')
  getWithRequestObject(@Req() request: Request) {
    // 'request' contains the entire HTTP request information
    console.log(request.url); // The request URL
    console.log(request.method); // The HTTP method (GET)
    console.log(request.headers); // All HTTP headers
    console.log(request.query); // Query parameters

    // We can build a response that includes information from the request
    return {
      message: 'Accessing the full request object',
      requestedUrl: request.url,
      method: request.method,
      userAgent: request.headers['user-agent'],
    };
  }

  // NEW METHOD: Filtering books with Query Parameters
  // This handles requests like GET /books/filter?author=John&minPrice=24
  @Get('filter')
  filterBooks(@Query() queryParams: any) {
    console.log('Filter endpoint hit!');
    console.log('Query params:', queryParams);
    let filteredBooks = [...this.books];

    // Filter by author if provided
    if (queryParams.author) {
      filteredBooks = filteredBooks.filter((book) =>
        book.author.toLowerCase().includes(queryParams.author.toLowerCase()),
      );
    }

    // Filter by minimum price if provided
    if (queryParams.minPrice) {
      const minPrice = parseFloat(queryParams.minPrice);
      filteredBooks = filteredBooks.filter(
        (book) => book.price !== undefined && book.price >= minPrice,
      );
    }

    return {
      message: 'Books filtered by query parameters',
      queryUsed: queryParams,
      results: filteredBooks,
    };
  }

  // NEW METHOD: Accessing specific query parameter
  // This handles requests like GET /books/search?title=NestJS
  @Get('search')
  searchBooks(@Query('title') title?: string) {
    console.log('Search endpoint hit!');
    console.log('Title query:', title);
    // If no title provided, return all books
    if (!title) {
      return this.books;
    }

    // Filter books by title
    const results = this.books.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase()),
    );

    return {
      message: `Search results for title: ${title}`,
      results,
    };
  }

  // NEW METHOD: Working with headers
  // This shows how to access HTTP headers
  @Get('headers')
  getWithHeaders(
    @Headers() headers: any,
    @Headers('user-agent') userAgent: string,
  ) {
    return {
      message: 'Accessing HTTP headers',
      allHeaders: headers,
      specificHeader: userAgent,
    };
  }

  

  // NEW METHOD: Multiple parameters example
  // This handles requests like GET /books/compare/1/with/2
  @Get('compare/:id1/with/:id2')
  compareBooks(@Param('id1') id1: string, @Param('id2') id2: string) {
    const book1 = this.books.find((book) => book.id === Number(id1));
    const book2 = this.books.find((book) => book.id === Number(id2));

    if (!book1 || !book2) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'One or both books not found',
      };
    }

    return {
      message: 'Book comparison',
      book1,
      book2,
      priceDifference: (book1.price || 0) - (book2.price || 0),
    };
  }

  @Get('docs/*')
  getApiDocs(@Param('0') docPath: string): any {
    console.log('DOCS ENDPOINT HIT');
    console.log('Doc path parameter:', docPath);
    // Extract the specific path requested after /books/docs/
    const path = docPath || 'index';
    console.log('Documentation path requested:', path);
  
    // A simple object to simulate different documentation pages
    const docs = {
      'index': {
        title: 'Books API Documentation',
        sections: ['Getting Started', 'Authentication', 'Endpoints'],
        links: ['/books/docs/getting-started', '/books/docs/auth', '/books/docs/endpoints']
      },
      'getting-started': {
        title: 'Getting Started with Books API',
        content: 'This is the getting started guide for using the Books API...'
      },
      'endpoints': {
        title: 'API Endpoints',
        content: 'The Books API provides the following endpoints...',
        endpoints: [
          { method: 'GET', path: '/books', description: 'Get all books' },
          { method: 'GET', path: '/books/:id', description: 'Get a book by ID' },
          { method: 'POST', path: '/books', description: 'Create a new book' }
        ]
      }
    };
  
    // Return the requested documentation or a 404 message
    return docs[path] || { message: 'Documentation page not found' };
  }

  // @Get(':id') creates a route with a parameter
  // This handles requests like GET /books/1 or /books/2
  // The ':id' syntax defines a route parameter named 'id'
  // IMPORTANT: Put parameterized routes LAST
  @Get(':id')
  // The @Param decorator extracts the 'id' parameter from the URL
  // The parameter type is specified as string (TypeScript feature)
  findOne(@Param('id') id: string) {
    // Convert the id from string to number (TypeScript requires this explicit conversion)
    // Then find a book with a matching id
    return this.books.find((book) => book.id === Number(id));
  }

  // @Post() decorator creates a route handler for POST requests to /books
  // This will handle creating new books
  @Post()
  // @Body() extracts the JSON body from the request
  // TypeScript allows us to work with this data in a type-safe way
  // We haven't specified a type here, so TypeScript infers 'any' type
  create(@Body() createBookData: any) {
    // Create a new book object
    // The ... is the spread operator - it copies all properties from createBookData
    // TypeScript allows us to combine objects this way
    const newBook = {
      id: this.books.length + 1,
      ...createBookData,
    };

    // Add the new book to our array
    this.books.push(newBook);

    // Return the newly created book
    // NestJS will automatically convert this to JSON and send it with status 201 (Created)
    return newBook;
  }


}
