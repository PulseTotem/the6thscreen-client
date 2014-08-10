/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

declare var log : any; // Use 'log' lib.

/**
 * Represents a logger with a coloration option.
 *
 * @class Logger
 */
class Logger {

    /**
     * Status of color mode.
     *
     * @property color
     * @type boolean
     * @static
     * @default true
     */
    static color : boolean = true;

    /**
     * Change the color status.
     *
     * @method useColor
     * @static
     * @param {boolean} status - The new status.
     */
    static useColor(status : boolean) {
        Logger.color = status;
    }

    /**
     * Log message as Debug Level.
     *
     * @method debug
     * @static
     * @param {string} msg - The message to log.
     */
    static debug(msg) {
        if(typeof msg !== "string") {
            console.log(msg);
        } else {
            if(Logger.color) {
                log("[c=\"color:green\"]" + msg + "[c]");
            } else {
                console.log(msg);
            }
        }
    }

    /**
     * Log message as Info Level.
     *
     * @method info
     * @static
     * @param {string} msg - The message to log.
     */
    static info(msg) {
        if(Logger.color) {
            log("[c=\"color:blue\"]" + msg + "[c]");
        } else {
            console.log(msg);
        }
    }

    /**
     * Log message as Warn Level.
     *
     * @method warn
     * @static
     * @param {string} msg - The message to log.
     */
    static warn(msg) {
        if(Logger.color) {
            log("[c=\"color:orange\"]" + msg + "[c]");
        } else {
            console.log(msg);
        }
    }

    /**
     * Log message as Error Level.
     *
     * @method error
     * @static
     * @param {string} msg - The message to log.
     */
    static error(msg) {
        if(Logger.color) {
            log("[c=\"color:red\"]" + msg + "[c]");
        } else {
            console.log(msg);
        }
    }

}