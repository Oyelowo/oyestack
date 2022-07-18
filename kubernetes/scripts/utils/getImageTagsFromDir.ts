#!/usr/bin/env node
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import util from 'util';
import { getManifestsBaseDir } from '../../resources/shared/manifestsDirectory';
import { ImageTags, imageTagsObjectValidator } from '../../resources/shared/validations';

const globAsync = util.promisify(glob);

const MANIFESTS_DIR = getManifestsBaseDir();
const IMAGE_TAGS_FILES = path.join(MANIFESTS_DIR, 'image-tags', '*');

export async function getImageTagsFromDir(): Promise<ImageTags> {
    const imageTagsPaths = await globAsync(IMAGE_TAGS_FILES, {
        dot: true,
    });

    const imageTagsList = imageTagsPaths.map((x) => {
        const imageTagKey = path.basename(x);
        const imageTagValue = fs.readFileSync(x, { encoding: 'utf-8' });
        return [imageTagKey, imageTagValue];
    });

    const imageTagsObject = imageTagsObjectValidator.parse(Object.fromEntries(imageTagsList));

    return imageTagsObject;
}
