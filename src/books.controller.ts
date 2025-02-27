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
  HttpCode,
  HttpException,
  Delete,
  Patch,
  Header,
  Redirect,
} from "@nestjs/common";
import { Request } from "express"; // Import Express Request type

// The @Controller decorator marks this class as a controller
// 'books' is the route prefix - all routes in this controller will start with /books
@Controller("books")
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
    { id: 1, title: "NestJS Basics", author: "John Doe", price: 29.99 },
    { id: 2, title: "TypeScript 101", author: "Jane Smith", price: 24.99 },
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
  @Get("request/example")
  getWithRequestObject(@Req() request: Request) {
    // 'request' contains the entire HTTP request information
    console.log(request.url); // The request URL
    console.log(request.method); // The HTTP method (GET)
    console.log(request.headers); // All HTTP headers
    console.log(request.query); // Query parameters

    // We can build a response that includes information from the request
    return {
      message: "Accessing the full request object",
      requestedUrl: request.url,
      method: request.method,
      userAgent: request.headers["user-agent"],
    };
  }

  // NEW METHOD: Filtering books with Query Parameters
  // This handles requests like GET /books/filter?author=John&minPrice=24
  @Get("filter")
  filterBooks(@Query() queryParams: any) {
    console.log("Filter endpoint hit!");
    console.log("Query params:", queryParams);
    let filteredBooks = [...this.books];

    // Filter by author if provided
    if (queryParams.author) {
      filteredBooks = filteredBooks.filter((book) =>
        book.author.toLowerCase().includes(queryParams.author.toLowerCase())
      );
    }

    // Filter by minimum price if provided
    if (queryParams.minPrice) {
      const minPrice = parseFloat(queryParams.minPrice);
      filteredBooks = filteredBooks.filter(
        (book) => book.price !== undefined && book.price >= minPrice
      );
    }

    return {
      message: "Books filtered by query parameters",
      queryUsed: queryParams,
      results: filteredBooks,
    };
  }

  // NEW METHOD: Accessing specific query parameter
  // This handles requests like GET /books/search?title=NestJS
  @Get("search")
  searchBooks(@Query("title") title?: string) {
    console.log("Search endpoint hit!");
    console.log("Title query:", title);
    // If no title provided, return all books
    if (!title) {
      return this.books;
    }

    // Filter books by title
    const results = this.books.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );

    return {
      message: `Search results for title: ${title}`,
      results,
    };
  }

  // NEW METHOD: Working with headers
  // This shows how to access HTTP headers
  @Get("headers")
  getWithHeaders(
    @Headers() headers: any,
    @Headers("user-agent") userAgent: string
  ) {
    return {
      message: "Accessing HTTP headers",
      allHeaders: headers,
      specificHeader: userAgent,
    };
  }

  // NEW METHOD: Multiple parameters example
  // This handles requests like GET /books/compare/1/with/2
  @Get("compare/:id1/with/:id2")
  compareBooks(@Param("id1") id1: string, @Param("id2") id2: string) {
    const book1 = this.books.find((book) => book.id === Number(id1));
    const book2 = this.books.find((book) => book.id === Number(id2));

    if (!book1 || !book2) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "One or both books not found",
      };
    }

    return {
      message: "Book comparison",
      book1,
      book2,
      priceDifference: (book1.price || 0) - (book2.price || 0),
    };
  }

  @Get("docs/*")
  getApiDocs(@Param("0") docPath: string): any {
    console.log("DOCS ENDPOINT HIT");
    console.log("Doc path parameter:", docPath);
    // Extract the specific path requested after /books/docs/
    const path = docPath || "index";
    console.log("Documentation path requested:", path);

    // A simple object to simulate different documentation pages
    const docs = {
      index: {
        title: "Books API Documentation",
        sections: ["Getting Started", "Authentication", "Endpoints"],
        links: [
          "/books/docs/getting-started",
          "/books/docs/auth",
          "/books/docs/endpoints",
        ],
      },
      "getting-started": {
        title: "Getting Started with Books API",
        content: "This is the getting started guide for using the Books API...",
      },
      endpoints: {
        title: "API Endpoints",
        content: "The Books API provides the following endpoints...",
        endpoints: [
          { method: "GET", path: "/books", description: "Get all books" },
          {
            method: "GET",
            path: "/books/:id",
            description: "Get a book by ID",
          },
          { method: "POST", path: "/books", description: "Create a new book" },
        ],
      },
    };

    // Return the requested documentation or a 404 message
    return docs[path] || { message: "Documentation page not found" };
  }


    // Example using the @Header decorator to set cache control
  // Make sure you're returning data from your popular books endpoint
  @Get("popular")
  @Header("Cache-Control", "public, max-age=300")
  getPopularBooks() {
    // Make sure you're returning something!
    const popularBooks = this.books
      .slice()
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 3);

    return {
      message: "Most popular books",
      books: popularBooks,
    };
  }

   // Example of redirect with @Redirect decorator
   @Get('store')
   @Redirect('https://amazon.com/books', 302)
   redirectToStore() {
     // This function doesn't need to return anything,
     // since the redirect is handled by the decorator
   }

   // Example of dynamic redirect based on query parameter
  @Get('external/:id')
  @Redirect('https://amazon.com/books', 302)
  redirectToExternalStore(
    @Param('id') id: string,
    @Query('vendor') vendor?: string
  ) {
    // Find the book
    const book = this.books.find((b) => b.id === Number(id));
    
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    
    // Dynamic redirect based on vendor query parameter
    if (vendor === 'amazon') {
      return { url: `https://amazon.com/books/search?title=${encodeURIComponent(book.title)}` };
    } else if (vendor === 'barnes') {
      return { url: `https://barnesandnoble.com/search?title=${encodeURIComponent(book.title)}` };
    }
    
    // Default redirect if no vendor specified or unknown vendor
    return { url: `https://books.com/search?q=${encodeURIComponent(book.title)}` };
  }

  // @Get(':id') creates a route with a parameter
  // This handles requests like GET /books/1 or /books/2
  // The ':id' syntax defines a route parameter named 'id'
  // IMPORTANT: Put parameterized routes LAST
  @Get(":id")
  // The @Param decorator extracts the 'id' parameter from the URL
  // The parameter type is specified as string (TypeScript feature)
  findOne(@Param("id") id: string) {
    // Convert the id from string to number (TypeScript requires this explicit conversion)
    // Then find a book with a matching id
    return this.books.find((book) => book.id === Number(id));
  }

  // @Post() decorator creates a route handler for POST requests to /books
  // This will handle creating new books
  // @Post()
  // // @Body() extracts the JSON body from the request
  // // TypeScript allows us to work with this data in a type-safe way
  // // We haven't specified a type here, so TypeScript infers 'any' type
  // create_simple(@Body() createBookData: any) {
  //   // Create a new book object
  //   // The ... is the spread operator - it copies all properties from createBookData
  //   // TypeScript allows us to combine objects this way
  //   const newBook = {
  //     id: this.books.length + 1,
  //     ...createBookData,
  //   };

  //   // Add the new book to our array
  //   this.books.push(newBook);

  //   // Return the newly created book
  //   // NestJS will automatically convert this to JSON and send it with status 201 (Created)
  //   return newBook;
  // }

  @Post()
  @HttpCode(HttpStatus.CREATED) // Explicitly set 201 CREATED status
  create(@Body() createBookData: any) {
    // Validate input data
    if (!createBookData.title || !createBookData.author) {
      // Throw exception with 400 BAD REQUEST status code
      throw new HttpException(
        "Title and author are required fields",
        HttpStatus.BAD_REQUEST
      );
    }

    const newBook = {
      id: this.books.length + 1,
      ...createBookData,
    };

    this.books.push(newBook);
    return newBook;
  }

  // Add a new method to delete a book by ID
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 NO CONTENT status
  deleteBook(@Param("id") id: string) {
    const bookIndex = this.books.findIndex((book) => book.id === Number(id));

    if (bookIndex === -1) {
      // Book not found, throw 404 NOT FOUND error
      throw new HttpException(
        `Book with ID ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    // Remove the book from the array
    this.books.splice(bookIndex, 1);

    // With 204 status, we don't return any body
    return;
  }

  // Add an update method with conditional status codes
  @Patch(":id")
  updateBook(@Param("id") id: string, @Body() updateData: any) {
    const book = this.books.find((book) => book.id === Number(id));

    if (!book) {
      throw new HttpException(
        `Book with ID ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    // Update the book properties with the new data
    Object.assign(book, updateData);

    // Return updated book with default 200 OK status
    return {
      message: "Book updated successfully",
      book,
    };
  }

  //   # Create a book (should return 201 CREATED)
  // curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"title":"New Book","author":"New Author"}'

  // # Try creating a book without required fields (should return 400 BAD REQUEST)
  // curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"title":"Incomplete Book"}'

  // # Delete a book (should return 204 NO CONTENT - no response body)
  // curl -X DELETE http://localhost:3000/books/1 -v

  // # Try deleting a non-existent book (should return 404 NOT FOUND)
  // curl -X DELETE http://localhost:3000/books/999 -v

  // # Update a book (should return 200 OK with updated book)
  // curl -X PATCH http://localhost:3000/books/2 -H "Content-Type: application/json" -d '{"price":39.99}'


}
