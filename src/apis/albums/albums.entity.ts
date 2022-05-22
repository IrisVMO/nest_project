import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Photo } from '../photos/photos.entity';
import { User } from '../users/users.entity';

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

// export enum inviteStatus {
//   Active = 'Active',
//   Inactive = 'Inactive',
// }

// @Entity({ name: 'Album_User' })
// export class AlbumUser {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ generated: 'uuid' })
//   userId: string;

//   @Column({ generated: 'uuid' })
//   albumId: string;

//   @Column({ nullable: true })
//   role: string;

//   @Column({
//     type: 'enum',
//     enum: inviteStatus,
//     nullable: true,
//   })
//   status: inviteStatus;
// }

@Entity({ name: 'Album' })
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

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

  @OneToMany(() => Photo, (photo) => photo.album)
  photos: Photo[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'Album_User' })
  users: User[];
}
