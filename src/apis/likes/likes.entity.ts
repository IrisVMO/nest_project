import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Photo } from '../photos/photos.entity';
import { User } from '../users/users.entity';

@Entity({ name: 'Like' })
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'Updated_At', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Photo, (photo) => photo.likes)
  photo: Photo;
}
