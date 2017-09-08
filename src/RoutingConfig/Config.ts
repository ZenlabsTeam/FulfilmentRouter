

export interface ServiceDetail {
    name: string;
    baseURL: string;
}
export interface ServiceRoute {
    service: ServiceDetail;
    path: string;
    method: string;
    inputPath?: string;
    multiInput?: {
        [key: string]: string
    };
    urlAppend?: string;
    msgTemplate: string;
}

export class ConfigManager {
    public serviceRouteMap: { [name: string]: ServiceRoute; } = {};
    constructor(filePath: string) {
        const configData = (<any>require(filePath));
        const servicesMap: { [id: string]: ServiceDetail; } = {};
        for (const serviceName in configData.services) {
            for (const serviceName in configData.services) {
                servicesMap[serviceName] = { name: serviceName, baseURL: configData.services[serviceName].baseURL };
            }
            for (const operationName in configData.routes) {
                const operation = configData.routes[operationName];
                this.serviceRouteMap[operationName] = {
                    service: servicesMap[operation.serviceName],
                    path: operation.path,
                    method: operation.method,
                    inputPath: operation.inputPath,
                    multiInput:operation.multiInput,
                    urlAppend: operation.urlAppend,
                    msgTemplate: operation.msgTemplate
                };
            }
        }

    }

}