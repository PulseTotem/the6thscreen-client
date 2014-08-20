/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Policy.ts" />
/// <reference path="../info/Info.ts" />

interface RenderPolicy<ProcessInfo extends Info> extends Policy {
    process(listInfos : Array<ProcessInfo>) : Array<ProcessInfo>;
}