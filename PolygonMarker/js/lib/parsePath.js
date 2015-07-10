/**
 * @brief Parse an svg path object and return commands
 * Parse an svg path object and generate an Array of path commands.
 * Each command is an Array of the form `[command, arg1, arg2, ...]`
 * NOTE: parsing is done via "pathSegList" which is faster and more
 * reliable than parsing the path string directly, but might not
 * work in old browsers.
 *
 * @author Balint Morvai <balint@morvai.de>
 * @license http://en.wikipedia.org/wiki/MIT_License MIT License
 * @param {Object} path object
 * @return {Array}
 */
function parsePath(path) {
    var list = path.pathSegList;
    var res = [];
    for(var i = 0; i < list.numberOfItems; i++) {
        var item = list.getItem(i);
        var cmd = item.pathSegTypeAsLetter;
        var sub = [];
        switch(cmd) {
            case "C":
            case "c":
                sub.unshift(item.y2); sub.unshift(item.x2);
            case "Q":
            case "q":
                sub.unshift(item.y1); sub.unshift(item.x1);
            case "M":
            case "m":
            case "L":
            case "l":
                sub.push(item.x); sub.push(item.y);
                break;
            case "A":
            case "a":
                sub.push(item.r1); sub.push(item.r2);
                sub.push(item.angle);
                sub.push(item.largeArcFlag);
                sub.push(item.sweepFlag);
                sub.push(item.x); sub.push(item.y);
                break;
            case "H":
            case "h":
                sub.push(item.x);
                break;
            case "V":
            case "v":
                sub.push(item.y);
                break;
            case "S":
            case "s":
                sub.push(item.x2); sub.push(item.y2);
                sub.push(item.x); sub.push(item.y);
                break;
            case "T":
            case "t":
                sub.push(item.x); sub.push(item.y);
                break;
        }
        sub.unshift(cmd);
        res.push(sub);
    }
    return res;
}