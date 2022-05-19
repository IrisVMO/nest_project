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

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  index: number;

  @Column({ nullable: true })
  tokenVerify: string;

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

  @OneToMany(() => Follow, (follow) => follow.user)
  follows: Follow[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
