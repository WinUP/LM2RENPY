import * as GeneralScript from './include/GeneralScript';
import * as LiteScript from './include/LiteScript';
import * as Utilities from './Utilities';

import * as _ from 'lodash';

export function analyseProject(source: GeneralScript.Project): LiteScript.Project {
    let project = new LiteScript.Project();
    // Global variable
    source.variable.forEach(variable => {
        project.addVariable(variable.name, variable.type, variable.scope);
    });
    // Menu file
    Object.keys(source.extendedResource.menuFile).forEach(menuPath => {
        let menuFile = source.extendedResource.menuFile[menuPath];
        let menuObject: LiteScript.Menu = { item: [] };
        menuFile.item.forEach(item => {
            let idleImage = project.findResourceByPath<LiteScript.ImageResource>(item.idleImage);
            if (!idleImage)
                idleImage = project.findImage(project.addResource<LiteScript.ImageResource>(LiteScript.ResourceType.Image, item.idleImage));
            let hoverImage = idleImage;
            if (item.hoverImage && item.hoverImage != '') {
                hoverImage = project.findResourceByPath<LiteScript.ImageResource>(item.hoverImage);
                if (!hoverImage)
                    hoverImage = project.findImage(project.addResource<LiteScript.ImageResource>(LiteScript.ResourceType.Image, item.hoverImage));
            }
            let previewImage: LiteScript.ImageResource = null;
            if (item.preview && item.preview.image) {
                previewImage = project.findResourceByPath<LiteScript.ImageResource>(item.preview.image);
                if (!previewImage)
                    
            }

        });
    });
}

export function analyseScene(source: GeneralScript.Scene): LiteScript.File {

}
