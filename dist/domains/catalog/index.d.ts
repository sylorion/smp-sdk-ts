import { APIClient } from '../../api/APIClient.js';
import { Service } from './ServiceController.js';
import { Asset } from './AssetController.js';
import { ServiceAsset } from './ServiceAssetController.js';
import { Media } from './MediaController.js';
import { Location } from './LocationController.js';
import { EngagementController } from './EngagementController.js';
import { Topic } from './TopicController.js';
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
