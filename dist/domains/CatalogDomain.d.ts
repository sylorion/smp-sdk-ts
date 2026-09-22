import { APIClient } from '../api/APIClient.js';
import { Service } from './catalog/ServiceController.js';
import { Asset } from './catalog/AssetController.js';
import { ServiceAsset } from './catalog/ServiceAssetController.js';
import { Media } from './catalog/MediaController.js';
import { Location } from './catalog/LocationController.js';
import { EngagementController } from './catalog/EngagementController.js';
import { Topic } from './catalog/TopicController.js';
export declare class CatalogDomain {
    service: Service;
    asset: Asset;
    serviceAsset: ServiceAsset;
    media: Media;
    location: Location;
    engagementController: EngagementController;
    topic: Topic;
    constructor(client: APIClient);
}
