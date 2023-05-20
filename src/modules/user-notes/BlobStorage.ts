import { BlobServiceClient } from '@azure/storage-blob';

interface IBlobStorage {
  putFile(filename: string): Promise<void>;
  containsFileWithNoteId(noteId: string): Promise<boolean>;
  findByUser(userId: number): Promise<string[]>;
}

interface BlobStorageOptions {
  accountName: string;
  containerName: string;
  sasToken: string;
}

export class BlobStorage implements IBlobStorage {
  protected blobContainerName: string;
  private readonly blobServiceClient: BlobServiceClient;

  constructor(blobStorageOptions: BlobStorageOptions) {
    const { containerName, accountName, sasToken } = blobStorageOptions;

    this.blobContainerName = containerName;

    const blobServiceUri = `https://${accountName}.blob.core.windows.net${sasToken}`;

    this.blobServiceClient = new BlobServiceClient(blobServiceUri, null);
  }

  async putFile(filename: string): Promise<void> {
    await this.blobServiceClient
      .getContainerClient(this.blobContainerName)
      .getBlockBlobClient(filename)
      .upload('', 0);
  }

  async containsFileWithNoteId(noteId: string): Promise<boolean> {
    const blobsIterator = this.blobServiceClient
      .getContainerClient(this.blobContainerName)
      .listBlobsFlat();

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
    const blobsIterator = this.blobServiceClient
      .getContainerClient(this.blobContainerName)
      .listBlobsFlat();

    for await (const { name: blobName } of blobsIterator) {
      const [blobUserId, blobNoteId] = blobName.split('_');
      if (blobUserId === userId.toString()) {
        notes.push(blobNoteId);
      }
    }

    return notes;
  }
}
