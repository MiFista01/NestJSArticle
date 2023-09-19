import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movies } from './schemas/articles.schemas';

@Injectable()
export class AppService {
  constructor(@InjectModel('Movies') private readonly moviesModel: Model<Movies>) {}
  async createMovie(movieData: Movies): Promise<Movies> {
    const newMovie = new this.moviesModel(movieData);
    return await newMovie.save();
  }

  async findMovieById(id: string): Promise<Movies | null> {
    return await this.moviesModel.findById(id).exec();
  }

  async findAllMovies(): Promise<Movies[]> {
    return await this.moviesModel.find().exec();
  }
  async findRandomMovies(count: number): Promise<Movies[]> {
    return await this.moviesModel.aggregate([
      { $sample: { size: count } }, // Выбирает случайные записи
    ]).exec();
  }
  async updateMovie(id: string, updatedData: Partial<Movies>): Promise<Movies | null> {
    return await this.moviesModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
  }

  async deleteMovie(id: string): Promise<void> {
    await this.moviesModel.findByIdAndRemove(id).exec();
  }
}
