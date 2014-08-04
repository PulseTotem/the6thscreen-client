/// <reference path="../info/Info.ts" />

interface Renderer<RenderInfo extends Info> {
    transformForBehaviour<ProcessInfo extends Info>(listInfos : Array<ProcessInfo>, renderPolicy : RenderPolicy<ProcessInfo>) : Array<RenderInfo>;

    render(info : RenderInfo, domElem : any);
}