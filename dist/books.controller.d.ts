import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
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
    findOne(id: string): {
        id: number;
        title: string;
        author: string;
        price?: number;
    } | undefined;
    create(createBookData: any): any;
}
