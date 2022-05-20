import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../albums/albums.entity';
import { Comment } from '../comments/comments.entity';
import { Like } from '../likes/likes.entity';
import { User } from '../users/users.entity';

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

@Entity({ name: 'Photo' })
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  caption: string;

  @Column()
  link: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Public,
  })
  status: Status;

  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'Updated_At', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Album, (album) => album.photos)
  album: Album;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @OneToMany(() => Like, (like) => like.photo)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.photo)
  comments: Comment[];
}
