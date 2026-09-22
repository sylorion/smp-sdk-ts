import { Service } from './catalog/ServiceController.js';
import { Asset } from './catalog/AssetController.js';
import { ServiceAsset } from './catalog/ServiceAssetController.js';
import { Media } from './catalog/MediaController.js';
import { Location } from './catalog/LocationController.js';
import { EngagementController } from './catalog/EngagementController.js';
import { Topic } from './catalog/TopicController.js';
export class CatalogDomain {
    constructor(client) {
        this.service = new Service(client);
        this.asset = new Asset(client);
        this.serviceAsset = new ServiceAsset(client);
        this.media = new Media(client);
        this.location = new Location(client);
        this.engagementController = new EngagementController(client);
        this.topic = new Topic(client);
    }
}
