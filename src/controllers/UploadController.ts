import { APIClient } from '../api/APIClient';
import { mediaMutations } from '../api/graphql/mutations/document/mediaMutations';

export interface Media {
  mediaID: string;
  uniqRef: string;
  slug: string;
  mediaType: string;
  legend: string;
  summary: string;
  originalName: string;
  finalName: string;
  url: string;
  size: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateMediaInput {
  mediaType?: string;
  legend: string;
  summary: string;
  originalName?: string;
  finalName: string;
  url: string;
  size?: string;
  state: string;
}

export class MediaService {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Crée un média avec un fichier uploadé.
   * @param input Les métadonnées du media.
   * @param file Le fichier à uploader (File ou Blob).
   * @returns Le média créé.
   */
  async createMedia(input: CreateMediaInput, file: File): Promise<Media> {
    const mutation = mediaMutations.CREATE_MEDIA; // Assurez-vous d'avoir défini cette mutation dans mediaMutations
    const variables = { input };
    const response = await this.client.mutateWithFile(
      mutation,
      variables,
      "file", // Nom de la variable dans la mutation qui contiendra le fichier
      file
    ) as { createMedia: Media };
    return response.createMedia;
  }
}
