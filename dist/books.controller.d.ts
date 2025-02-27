import { HttpStatus } from "@nestjs/common";
import { Request } from "express";
export declare class BooksController {
    private books;
    findAll(): {
        id: number;
        title: string;
        author: string;
        price?: number;
    }[];
    getWithRequestObject(request: Request): {
        message: string;
        requestedUrl: string;
        method: string;
        userAgent: string | undefined;
    };
    filterBooks(queryParams: any): {
        message: string;
        queryUsed: any;
        results: {
            id: number;
            title: string;
            author: string;
            price?: number;
        }[];
    };
    searchBooks(title?: string): {
        id: number;
        title: string;
        author: string;
        price?: number;
    }[] | {
        message: string;
        results: {
            id: number;
            title: string;
            author: string;
            price?: number;
        }[];
    };
    getWithHeaders(headers: any, userAgent: string): {
        message: string;
        allHeaders: any;
        specificHeader: string;
    };
    compareBooks(id1: string, id2: string): {
        status: HttpStatus;
        message: string;
        book1?: undefined;
        book2?: undefined;
        priceDifference?: undefined;
    } | {
        message: string;
        book1: {
            id: number;
            title: string;
            author: string;
            price?: number;
        };
        book2: {
            id: number;
            title: string;
            author: string;
            price?: number;
        };
        priceDifference: number;
        status?: undefined;
    };
    getApiDocs(docPath: string): any;
    getPopularBooks(): {
        message: string;
        books: {
            id: number;
            title: string;
            author: string;
            price?: number;
        }[];
    };
    redirectToStore(): void;
    redirectToExternalStore(id: string, vendor?: string): {
        url: string;
    };
    getBookDetails(id: string): {
        message: string;
        book: {
            id: number;
            title: string;
            author: string;
            price?: number;
        };
        links: {
            collection: string;
            reviews: string;
            similar: string;
        };
    };
    getBookReview(bookId: string, reviewId: string): {
        bookId: number;
        reviewId: number;
        author: string;
        rating: number;
        content: string;
    };
    findOne(id: string): {
        id: number;
        title: string;
        author: string;
        price?: number;
    } | undefined;
    create(createBookData: any): any;
    deleteBook(id: string): void;
    updateBook(id: string, updateData: any): {
        message: string;
        book: {
            id: number;
            title: string;
            author: string;
            price?: number;
        };
    };
}
