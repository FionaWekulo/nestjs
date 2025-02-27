"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const common_1 = require("@nestjs/common");
let BooksController = class BooksController {
    books = [
        { id: 1, title: "NestJS Basics", author: "John Doe", price: 29.99 },
        { id: 2, title: "TypeScript 101", author: "Jane Smith", price: 24.99 },
    ];
    findAll() {
        return this.books;
    }
    getWithRequestObject(request) {
        console.log(request.url);
        console.log(request.method);
        console.log(request.headers);
        console.log(request.query);
        return {
            message: "Accessing the full request object",
            requestedUrl: request.url,
            method: request.method,
            userAgent: request.headers["user-agent"],
        };
    }
    filterBooks(queryParams) {
        console.log("Filter endpoint hit!");
        console.log("Query params:", queryParams);
        let filteredBooks = [...this.books];
        if (queryParams.author) {
            filteredBooks = filteredBooks.filter((book) => book.author.toLowerCase().includes(queryParams.author.toLowerCase()));
        }
        if (queryParams.minPrice) {
            const minPrice = parseFloat(queryParams.minPrice);
            filteredBooks = filteredBooks.filter((book) => book.price !== undefined && book.price >= minPrice);
        }
        return {
            message: "Books filtered by query parameters",
            queryUsed: queryParams,
            results: filteredBooks,
        };
    }
    searchBooks(title) {
        console.log("Search endpoint hit!");
        console.log("Title query:", title);
        if (!title) {
            return this.books;
        }
        const results = this.books.filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));
        return {
            message: `Search results for title: ${title}`,
            results,
        };
    }
    getWithHeaders(headers, userAgent) {
        return {
            message: "Accessing HTTP headers",
            allHeaders: headers,
            specificHeader: userAgent,
        };
    }
    compareBooks(id1, id2) {
        const book1 = this.books.find((book) => book.id === Number(id1));
        const book2 = this.books.find((book) => book.id === Number(id2));
        if (!book1 || !book2) {
            return {
                status: common_1.HttpStatus.NOT_FOUND,
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
    getApiDocs(docPath) {
        console.log("DOCS ENDPOINT HIT");
        console.log("Doc path parameter:", docPath);
        const path = docPath || "index";
        console.log("Documentation path requested:", path);
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
        return docs[path] || { message: "Documentation page not found" };
    }
    getPopularBooks() {
        const popularBooks = this.books
            .slice()
            .sort((a, b) => (b.price || 0) - (a.price || 0))
            .slice(0, 3);
        return {
            message: "Most popular books",
            books: popularBooks,
        };
    }
    redirectToStore() {
    }
    redirectToExternalStore(id, vendor) {
        const book = this.books.find((b) => b.id === Number(id));
        if (!book) {
            throw new common_1.HttpException("Book not found", common_1.HttpStatus.NOT_FOUND);
        }
        if (vendor === "amazon") {
            return {
                url: `https://amazon.com/books/search?title=${encodeURIComponent(book.title)}`,
            };
        }
        else if (vendor === "barnes") {
            return {
                url: `https://barnesandnoble.com/search?title=${encodeURIComponent(book.title)}`,
            };
        }
        return {
            url: `https://books.com/search?q=${encodeURIComponent(book.title)}`,
        };
    }
    getBookDetails(id) {
        const bookId = Number(id);
        if (isNaN(bookId)) {
            throw new common_1.HttpException("Invalid ID format. Must be a number", common_1.HttpStatus.BAD_REQUEST);
        }
        const book = this.books.find((b) => b.id === bookId);
        if (!book) {
            throw new common_1.HttpException(`Book with ID ${id} not found`, common_1.HttpStatus.NOT_FOUND);
        }
        return {
            message: `Details for book #${id}`,
            book,
            links: {
                collection: "/books",
                reviews: `/books/${id}/reviews`,
                similar: `/books/similar?author=${encodeURIComponent(book.author)}`,
            },
        };
    }
    getBookReview(bookId, reviewId) {
        return {
            bookId: Number(bookId),
            reviewId: Number(reviewId),
            author: "Jane Reader",
            rating: 4.5,
            content: "This book was excellent! Highly recommended.",
        };
    }
    findOne(id) {
        return this.books.find((book) => book.id === Number(id));
    }
    create(createBookData) {
        if (!createBookData.title || !createBookData.author) {
            throw new common_1.HttpException("Title and author are required fields", common_1.HttpStatus.BAD_REQUEST);
        }
        const newBook = {
            id: this.books.length + 1,
            ...createBookData,
        };
        this.books.push(newBook);
        return newBook;
    }
    deleteBook(id) {
        const bookIndex = this.books.findIndex((book) => book.id === Number(id));
        if (bookIndex === -1) {
            throw new common_1.HttpException(`Book with ID ${id} not found`, common_1.HttpStatus.NOT_FOUND);
        }
        this.books.splice(bookIndex, 1);
        return;
    }
    updateBook(id, updateData) {
        const book = this.books.find((book) => book.id === Number(id));
        if (!book) {
            throw new common_1.HttpException(`Book with ID ${id} not found`, common_1.HttpStatus.NOT_FOUND);
        }
        Object.assign(book, updateData);
        return {
            message: "Book updated successfully",
            book,
        };
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("request/example"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getWithRequestObject", null);
__decorate([
    (0, common_1.Get)("filter"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "filterBooks", null);
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)("title")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "searchBooks", null);
__decorate([
    (0, common_1.Get)("headers"),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Headers)("user-agent")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getWithHeaders", null);
__decorate([
    (0, common_1.Get)("compare/:id1/with/:id2"),
    __param(0, (0, common_1.Param)("id1")),
    __param(1, (0, common_1.Param)("id2")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "compareBooks", null);
__decorate([
    (0, common_1.Get)("docs/*"),
    __param(0, (0, common_1.Param)("0")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], BooksController.prototype, "getApiDocs", null);
__decorate([
    (0, common_1.Get)("popular"),
    (0, common_1.Header)("Cache-Control", "public, max-age=300"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getPopularBooks", null);
__decorate([
    (0, common_1.Get)("store"),
    (0, common_1.Redirect)("https://amazon.com/books", 302),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "redirectToStore", null);
__decorate([
    (0, common_1.Get)("external/:id"),
    (0, common_1.Redirect)("https://amazon.com/books", 302),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("vendor")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "redirectToExternalStore", null);
__decorate([
    (0, common_1.Get)(":id/details"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getBookDetails", null);
__decorate([
    (0, common_1.Get)(":id/reviews/:reviewId"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("reviewId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getBookReview", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "deleteBook", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "updateBook", null);
exports.BooksController = BooksController = __decorate([
    (0, common_1.Controller)("books")
], BooksController);
//# sourceMappingURL=books.controller.js.map