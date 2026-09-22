import { Service } from './ServiceController.js';
import { Asset } from './AssetController.js';
import { ServiceAsset } from './ServiceAssetController.js';
import { Media } from './MediaController.js';
import { Location } from './LocationController.js';
import { EngagementController } from './EngagementController.js';
import { Topic } from './TopicController.js';
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
