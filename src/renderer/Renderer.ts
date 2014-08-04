/// <reference path="../info/Info.ts" />

class Renderer<RenderInfo extends Info> {
    static transformForBehaviour<ProcessInfo extends Info>(listInfos : Array<ProcessInfo>, renderPolicy : RenderPolicy<ProcessInfo>) : Array<RenderInfo> {
        return renderPolicy.process(listInfos);
    }

    static render(info : RenderInfo, domElem : any) {

    }
}