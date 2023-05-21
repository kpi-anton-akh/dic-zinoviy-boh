import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { IUserNotesStorage } from './interfaces/IUserNotesStorage';

export class UserNotesStorage implements IUserNotesStorage {
  private readonly containerClient: ContainerClient;

  constructor(connectionStr: string, containerName: string) {
    const blobServiceClient = new BlobServiceClient(connectionStr, null);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async putFile(filename: string): Promise<void> {
    await this.containerClient.getBlockBlobClient(filename).upload('', 0);
  }

  async containsFileWithNoteId(noteId: string): Promise<boolean> {
    const blobsIterator = this.containerClient.listBlobsFlat();

    for await (const { name: blobName } of blobsIterator) {
      const [, blobNoteId] = blobName.split('_');
      if (blobNoteId === noteId) {
        return true;
      }
    }

    return false;
  }

  async findByUser(userId: number): Promise<string[]> {
    const notes: string[] = [];
    const blobsIterator = this.containerClient.listBlobsFlat();

    for await (const { name: blobName } of blobsIterator) {
      const [blobUserId, blobNoteId] = blobName.split('_');
      if (blobUserId === userId.toString()) {
        notes.push(blobNoteId);
      }
    }

    return notes;
  }
}
