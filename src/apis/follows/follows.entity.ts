import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity({ name: 'Follow' })
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'uuid' })
  userIdFollower: string;

  @Column({ generated: 'uuid' })
  userId: string;

  @Column({ generated: 'uuid' })
  userIdFollowing: string;

  @ManyToOne(() => User, (user) => user.follows, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
