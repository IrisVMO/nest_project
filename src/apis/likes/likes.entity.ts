import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Photo } from '../photos/photos.entity';
import { User } from '../users/users.entity';

@Entity({ name: 'Like' })
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'uuid' })
  userId: string;

  @Column({ generated: 'uuid' })
  photoId: string;

  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'Updated_At', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.likes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Photo, (photo) => photo.likes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  photo: Photo;
}
