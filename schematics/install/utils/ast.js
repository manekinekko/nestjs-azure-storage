"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addModuleImportToRootModule = addModuleImportToRootModule;
exports.addModuleImportToModule = addModuleImportToModule;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const ast_utils_1 = require("./ast-utils");
const change_1 = require("@schematics/angular/utility/change");
function addModuleImportToRootModule(options) {
    return (host, moduleName, src) => {
        const modulePath = (0, core_1.normalize)(options.rootDir + `/` + options.rootModuleFileName + `.ts`);
        addModuleImportToModule(host, modulePath, moduleName, src);
    };
}
function addModuleImportToModule(host, modulePath, moduleName, src) {
    const moduleSource = (0, schematics_2.parseSourceFile)(host, modulePath);
    if (!moduleSource) {
        throw new schematics_1.SchematicsException(`Module not found: ${modulePath}`);
    }
    const changes = (0, ast_utils_1.addImportToModule)(moduleSource, modulePath, moduleName, src);
    const recorder = host.beginUpdate(modulePath);
    changes.forEach(change => {
        if (change instanceof change_1.InsertChange) {
            recorder.insertLeft(change.pos, change.toAdd);
        }
    });
    host.commitUpdate(recorder);
}
