
export interface ServiceActionMap {
    services: { [name: string]: {
        baseURL: string;
    }; },
    routes:{ [name: string]: {
        serviceName: string;
        path: string;
        method: string;
        inputPath?: string;
        multiInput?: {
            [key: string]: string
        };
        urlAppend?: string;
        msgTemplate: string;
    }; }
}
export class ConfigManager {
  public serviceActionMap:ServiceActionMap;
    constructor(filePath: string) {
        this.serviceActionMap = (<ServiceActionMap>require(filePath));
    }

}