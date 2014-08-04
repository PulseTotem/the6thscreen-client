/// <reference path="./Policy.ts" />
/// <reference path="../info/Info.ts" />

class RenderPolicy<ProcessInfo extends Info> extends Policy {
    process(listInfos : Array<ProcessInfo>) : Array<ProcessInfo> {
        return listInfos;
    }
}