import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import {v4 as uuidv4} from "uuid"
@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async addBook(book: Book,userId:string) {
    const {name,author,description} = book;
     
    const user = await this.userRepository.findOneBy({id:userId})

    const myBook = new BookEntity()

    myBook.name = name;
    myBook.author = author;
    myBook.description = description;
    myBook.user = user;

    return this.bookRepository.save(myBook);
  }

   async findAllBook(userId:string) {
    const data = await this.bookRepository.find({where:{user:{id:userId}}});
    return data;
  }

  async updateBook(book: Book, bookId: string) {

    let myBook = await this.bookRepository.findOneBy({id:bookId });

    if (myBook) {
      return await this.bookRepository.update({ id:bookId }, book);
    }

    throw new Error('Book is not Available');
  }

  async deleteBook(bookId: string) {
    const book = await this.bookRepository.findOneBy({id:bookId});

    if(!book){
        throw new NotFoundException("Book not found");
    }
      return await this.bookRepository.delete(bookId)
  }
}
