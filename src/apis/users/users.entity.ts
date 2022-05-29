import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from '../likes/likes.entity';
import { Comment } from '../comments/comments.entity';
import { Follow } from '../follows/follows.entity';
import { Photo } from '../photos/photos.entity';
import { AlbumUser } from '../albums/albums.entity';

export enum Status {
  Active = 'Active',
  Busy = 'Busy',
}

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  seed: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  tokenVerify: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Active,
  })
  status: Status;

  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'Updated_At', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Follow, (follow) => follow.user)
  follows: Follow;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => AlbumUser, (albumUser) => albumUser.user)
  albumUsers: AlbumUser[];
}
