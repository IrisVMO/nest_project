import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Photo } from '../photos/photos.entity';

@Entity({ name: 'Comment' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'Updated_At', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Photo, (photo) => photo.comments)
  photo: Photo;
}
