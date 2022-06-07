import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity({ name: 'FollowUser' })
export class FollowUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'uuid' })
  userIdFollower: string;

  @Column({ generated: 'uuid' })
  userId: string;

  @Column({ generated: 'uuid' })
  userIdFollowing: string;

  @ManyToOne(() => User, (user) => user.followUsers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
