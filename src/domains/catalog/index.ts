import { APIClient } from '../../api/APIClient.js';
import { Service } from './ServiceController.js';
import { Asset } from './AssetController.js';
import { ServiceAsset } from './ServiceAssetController.js';
import { Media } from './MediaController.js';
import { Location } from './LocationController.js';
import { EngagementController } from './EngagementController.js';

export class CatalogDomain {
  public service: Service;
  public asset: Asset;
  public serviceAsset: ServiceAsset;
  public media: Media;
  public location: Location;
  public engagementController: EngagementController;

  constructor(client: APIClient) {
    this.service = new Service(client);
    this.asset = new Asset(client);
    this.serviceAsset = new ServiceAsset(client);
    this.media = new Media(client);
    this.location = new Location(client);
    this.engagementController = new EngagementController(client);
  }
}
